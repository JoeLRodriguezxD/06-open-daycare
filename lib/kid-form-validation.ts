export type Classroom = "SOLES" | "LUNAS" | "ESTRELLAS";

export type AddKidValues = {
  fullName: string;
  birthDate: string;
  classroom: Classroom | "";
  allergies: string;
  medicalNotes: string;
};

export type KidFormErrors = Partial<
  Record<"fullName" | "birthDate" | "classroom", string>
>;

export const CLASSROOM_LABELS: Record<Classroom, string> = {
  SOLES: "Soles",
  LUNAS: "Lunas",
  ESTRELLAS: "Estrellas",
};

function isValidCalendarDate(day: number, month: number, year: number): boolean {
  if (month < 1 || month > 12) {
    return false;
  }
  if (day < 1 || day > 31) {
    return false;
  }
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isFutureDate(day: number, month: number, year: number): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const value = new Date(year, month - 1, day);
  value.setHours(0, 0, 0, 0);
  return value.getTime() > today.getTime();
}

export function validateKidForm(values: AddKidValues): KidFormErrors {
  const errors: KidFormErrors = {};

  if (values.fullName.trim() === "") {
    errors.fullName = "Ingresá el nombre";
  }

  const birthDate = values.birthDate.trim();
  const dateMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(birthDate);
  if (!dateMatch) {
    errors.birthDate = "Ingresá una fecha válida (dd/mm/aaaa)";
  } else {
    const day = Number(dateMatch[1]);
    const month = Number(dateMatch[2]);
    const year = Number(dateMatch[3]);
    if (!isValidCalendarDate(day, month, year)) {
      errors.birthDate = "Ingresá una fecha válida (dd/mm/aaaa)";
    } else if (isFutureDate(day, month, year)) {
      errors.birthDate = "La fecha no puede ser futura";
    }
  }

  if (values.classroom === "") {
    errors.classroom = "Elegí una sala";
  }

  return errors;
}
