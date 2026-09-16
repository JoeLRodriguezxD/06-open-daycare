export type LoginValues = {
  email: string;
  password: string;
};

export type ActivationValues = {
  inviteCode: string;
  email: string;
  password: string;
  photoConsent: boolean;
};

export type FormErrors = Partial<
  Record<"email" | "password" | "inviteCode" | "photoConsent", string>
>;

export function isValidEmail(email: string): boolean {
  const normalizedEmail = email.trim();
  if (normalizedEmail === "") {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
}

export function validateLogin(values: LoginValues): FormErrors {
  const errors: FormErrors = {};

  if (!isValidEmail(values.email)) {
    errors.email = "Ingresá un email válido";
  }

  if (values.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  return errors;
}

export function validateActivation(values: ActivationValues): FormErrors {
  const errors: FormErrors = {};

  if (values.inviteCode.trim() === "") {
    errors.inviteCode = "Ingresá el código de invitación";
  }

  if (!isValidEmail(values.email)) {
    errors.email = "Ingresá un email válido";
  }

  if (values.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  if (!values.photoConsent) {
    errors.photoConsent = "Tenés que autorizar el uso de fotos para continuar";
  }

  return errors;
}
