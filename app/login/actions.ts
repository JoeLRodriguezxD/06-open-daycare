'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type LoginResult = { error?: string };

function mapLoginError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes('invalid login credentials')) {
    return 'Email o contraseña incorrectos';
  }
  if (normalized.includes('email not confirmed')) {
    return 'Tenés que confirmar tu email antes de ingresar';
  }
  return 'No se pudo iniciar sesión. Intentá de nuevo';
}

export async function login(formData: FormData): Promise<LoginResult> {
  const email = ((formData.get('email') as string | null) ?? '').trim();
  const password = ((formData.get('password') as string | null) ?? '');

  try {
    const supabase = await createClient();
    const { data: signInData, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      return { error: mapLoginError(error.message) };
    }

    const userId = signInData.user?.id;
    if (!userId) {
      await supabase.auth.signOut();
      return { error: 'No se pudo iniciar sesión. Intentá de nuevo' };
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, role, status')
      .eq('id', userId)
      .maybeSingle();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      return {
        error: 'No encontramos un perfil para este usuario. Pedí ayuda a la guardería',
      };
    }

    if (profile.status === 'pending') {
      await supabase.auth.signOut();
      return {
        error: 'Tu cuenta está pendiente de activación. Pedí a la guardería que la active',
      };
    }
  } catch {
    return { error: 'No se pudo iniciar sesión. Intentá de nuevo' };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
