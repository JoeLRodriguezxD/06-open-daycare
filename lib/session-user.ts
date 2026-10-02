import { createClient } from "@/lib/supabase/server";

export type SessionUser = {
  name: string;
  detail: string;
  initial: string;
};

const ROLE_LABELS: Record<string, string> = {
  staff: "Personal",
  parent: "Familia",
  admin: "Admin",
};

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub as string | undefined;

    if (!userId) {
      return null;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("full_name, role, daycare_id")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      return null;
    }

    let daycareName: string | null = null;
    if (profile.daycare_id) {
      const { data: daycare } = await supabase
        .from("daycares")
        .select("name")
        .eq("id", profile.daycare_id)
        .maybeSingle();
      daycareName = daycare?.name ?? null;
    }

    const name = (profile.full_name ?? "").trim() || "Usuario";
    const roleLabel = profile.role ? (ROLE_LABELS[profile.role] ?? profile.role) : "";
    const shortDaycare = daycareName?.replace(/^guardería\s+/i, "") || null;
    const detail =
      roleLabel && shortDaycare
        ? `${roleLabel} · ${shortDaycare}`
        : (roleLabel || shortDaycare || "");

    return {
      name,
      detail,
      initial: (name.charAt(0) || "?").toUpperCase(),
    };
  } catch {
    return null;
  }
}
