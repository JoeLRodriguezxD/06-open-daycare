import { createClient } from '@/lib/supabase/server';
import type { Kid } from '@/lib/kids-mock';

export type KidRow = {
  id: string;
  full_name: string;
  birth_date: string;
  room_id: string;
  room_name: string;
  allergy_tags: string[] | null;
  medical_notes: string | null;
  status: 'active' | 'archived';
};

export type ChildrenResult = {
  kids: Kid[];
  error: string | null;
};

type ChildRowRaw = {
  id: string;
  full_name: string;
  birth_date: string;
  room_id: string;
  allergy_tags: string[] | null;
  medical_notes: string | null;
  status: 'active' | 'archived';
  rooms: { name: string } | { name: string }[] | null;
};

const AVATAR_PAIRS: Array<{ bg: string; fg: string }> = [
  { bg: 'var(--avatar-sky-bg)', fg: 'var(--avatar-sky-fg)' },
  { bg: 'var(--avatar-rose-bg)', fg: 'var(--avatar-rose-fg)' },
  { bg: 'var(--avatar-mint-bg)', fg: 'var(--avatar-mint-fg)' },
  { bg: 'var(--avatar-sand-bg)', fg: 'var(--avatar-sand-fg)' },
  { bg: 'var(--avatar-lavender-bg)', fg: 'var(--avatar-lavender-fg)' },
];

const TAG_TO_LABEL: Record<string, string> = {
  peanut: 'MANÍ',
  lactose: 'LACTOSA',
  gluten: 'GLUTEN',
  egg: 'HUEVO',
  soy: 'SOJA',
};

const MONTH_LABELS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function ageLabelFromBirthDate(birthDateIso: string): { years: number; label: string } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDateIso);
  if (!match) {
    return { years: 0, label: 'Sin edad' };
  }
  const birth = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (beforeBirthday) {
    years -= 1;
  }
  if (years <= 0) {
    return { years: 0, label: 'Menos de 1 año' };
  }
  return { years, label: years === 1 ? '1 año' : `${years} años` };
}

function displayBirthDate(birthDateIso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDateIso);
  if (!match) {
    return birthDateIso;
  }
  const day = String(Number(match[3])).padStart(2, '0');
  const month = MONTH_LABELS[Number(match[2]) - 1] ?? match[2];
  return `${day} ${month} ${match[1]}`;
}

function allergyTagFromTags(tags: string[] | null): string | undefined {
  if (!tags || tags.length === 0) {
    return undefined;
  }
  const first = tags[0].trim();
  if (first === '') {
    return undefined;
  }
  const known = TAG_TO_LABEL[first.toLowerCase()];
  return known ?? first.toUpperCase();
}

export function mapKidRowToKid(row: KidRow): Kid {
  const fullName = row.full_name.trim();
  const shortName = fullName.split(/\s+/)[0] ?? fullName;
  const initial = (fullName.charAt(0) || '?').toUpperCase();
  const palette = AVATAR_PAIRS[hashString(row.id) % AVATAR_PAIRS.length];
  const age = ageLabelFromBirthDate(row.birth_date);
  const allergyTag = allergyTagFromTags(row.allergy_tags);

  return {
    id: row.id,
    slug: row.id,
    fullName,
    shortName,
    initial,
    avatarBg: palette.bg,
    avatarFg: palette.fg,
    ageYears: age.years,
    ageLabel: age.label,
    classroom: row.room_name,
    birthDate: displayBirthDate(row.birth_date),
    enrolledAt: '',
    allergyTag,
    allergyNotes: row.medical_notes ?? undefined,
    linkedParentsCount: 0,
    linkedParents: [],
  };
}

export async function getChildren(): Promise<ChildrenResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('children')
      .select(
        'id, full_name, birth_date, room_id, allergy_tags, medical_notes, status, rooms ( name )',
      )
      .order('full_name', { ascending: true });

    if (error) {
      return { kids: [], error: 'No se pudieron cargar los niños. Intentá de nuevo' };
    }

    const rows = ((data ?? []) as ChildRowRaw[]).map((row) => {
      const rooms = Array.isArray(row.rooms) ? row.rooms[0] : row.rooms;
      const kidRow: KidRow = {
        id: row.id,
        full_name: row.full_name,
        birth_date: row.birth_date,
        room_id: row.room_id,
        room_name: rooms?.name ?? '',
        allergy_tags: row.allergy_tags,
        medical_notes: row.medical_notes,
        status: row.status,
      };
      return kidRow;
    });

    return { kids: rows.map(mapKidRowToKid), error: null };
  } catch {
    return { kids: [], error: 'No se pudieron cargar los niños. Intentá de nuevo' };
  }
}
