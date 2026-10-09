'use server';

import { revalidatePath } from 'next/cache';
import { validateKidForm } from '@/lib/kid-form-validation';
import { createClient } from '@/lib/supabase/server';

export type CreateChildInput = {
  fullName: string;
  birthDate: string;
  roomId: string;
  allergies: string;
  medicalNotes: string;
};

export type CreateChildResult = { error?: string };

const ALLERGY_DICTIONARY: Record<string, string> = {
  'maní': 'peanut',
  mani: 'peanut',
  lactosa: 'lactose',
  gluten: 'gluten',
  huevo: 'egg',
  soja: 'soy',
};

function slugifyTag(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function mapAllergiesToTags(allergies: string): string[] | null {
  const parts = allergies
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part !== '');
  if (parts.length === 0) {
    return null;
  }
  const tags = parts
    .map((part) => {
      const key = part.toLowerCase().trim();
      return ALLERGY_DICTIONARY[key] ?? slugifyTag(part);
    })
    .filter((tag) => tag !== '');
  return tags.length > 0 ? tags : null;
}

function parseBirthDate(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  const monthLabel = String(month).padStart(2, '0');
  const dayLabel = String(day).padStart(2, '0');
  return `${year}-${monthLabel}-${dayLabel}`;
}

export async function createChild(
  input: CreateChildInput,
): Promise<CreateChildResult> {
  const fullName = (input.fullName ?? '').trim();
  const birthDate = (input.birthDate ?? '').trim();
  const roomId = (input.roomId ?? '').trim();
  const allergies = input.allergies ?? '';
  const medicalNotes = input.medicalNotes ?? '';

  const validationErrors = validateKidForm({
    fullName,
    birthDate,
    classroom: roomId === '' ? '' : 'SOLES',
    allergies,
    medicalNotes,
  });

  if (validationErrors.fullName) {
    return { error: validationErrors.fullName };
  }
  if (validationErrors.birthDate) {
    return { error: validationErrors.birthDate };
  }
  if (roomId === '') {
    return { error: 'Elegí una sala' };
  }

  const birthDateIso = parseBirthDate(birthDate);
  if (!birthDateIso) {
    return { error: 'Ingresá una fecha válida (dd/mm/aaaa)' };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub as string | undefined;
  if (!userId) {
    return { error: 'Tenés que iniciar sesión para agregar un niño' };
  }

  const medicalNotesValue = medicalNotes.trim() === '' ? null : medicalNotes.trim();
  const allergyTags = mapAllergiesToTags(allergies);

  const { error } = await supabase.from('children').insert({
    room_id: roomId,
    full_name: fullName,
    birth_date: birthDateIso,
    medical_notes: medicalNotesValue,
    allergy_tags: allergyTags,
  });

  if (error) {
    return { error: 'No se pudo guardar. Intentá de nuevo' };
  }

  revalidatePath('/kids');
  return {};
}
