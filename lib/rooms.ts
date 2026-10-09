import { createClient } from '@/lib/supabase/server';

export type RoomOption = {
  id: string;
  name: string;
};

export type RoomsResult = {
  rooms: RoomOption[];
  error: string | null;
};

export async function getRooms(): Promise<RoomsResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('rooms')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      return { rooms: [], error: 'No se pudieron cargar las salas. Intentá de nuevo' };
    }

    return { rooms: (data ?? []) as RoomOption[], error: null };
  } catch {
    return { rooms: [], error: 'No se pudieron cargar las salas. Intentá de nuevo' };
  }
}
