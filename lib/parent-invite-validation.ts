export type ParentRelation = "MOTHER" | "FATHER" | "GUARDIAN";

export type InviteValues = {
  parentName: string;
  email: string;
  relation: ParentRelation | "";
};

export type InviteErrors = Partial<
  Record<"parentName" | "email" | "relation", string>
>;

export const PARENT_RELATION_LABELS: Record<ParentRelation, string> = {
  MOTHER: "Mamá",
  FATHER: "Papá",
  GUARDIAN: "Tutor/a",
};

const INVITE_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateInviteCode(): string {
  let code = "";
  for (let index = 0; index < 5; index += 1) {
    const randomIndex = Math.floor(Math.random() * INVITE_CODE_ALPHABET.length);
    code += INVITE_CODE_ALPHABET[randomIndex];
  }
  return code;
}

function isValidEmail(email: string): boolean {
  const normalizedEmail = email.trim();
  if (normalizedEmail === "") {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
}

export function validateParentInvite(values: InviteValues): InviteErrors {
  const errors: InviteErrors = {};

  if (values.parentName.trim() === "") {
    errors.parentName = "Ingresá el nombre";
  }

  if (!isValidEmail(values.email)) {
    errors.email = "Ingresá un email válido";
  }

  if (values.relation === "") {
    errors.relation = "Elegí un parentesco";
  }

  return errors;
}
