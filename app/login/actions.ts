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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: mapLoginError(error.message) };
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
