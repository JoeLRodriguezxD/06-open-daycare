"use client";

import { useEffect, useState } from "react";
import {
  CLASSROOM_LABELS,
  validateKidForm,
  type AddKidValues,
  type Classroom,
  type KidFormErrors,
} from "@/lib/kid-form-validation";

type AddKidModalProps = {
  onClose: () => void;
  initialValues?: AddKidValues;
  title?: string;
};

const emptyValues: AddKidValues = {
  fullName: "",
  birthDate: "",
  classroom: "",
  allergies: "",
  medicalNotes: "",
};

const inputBase =
  "w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] outline-none placeholder:text-auth-placeholder";

const labelBase =
  "text-secondary mb-2 block text-xs font-extrabold tracking-[0.7px]";

const errorBase = "text-auth-error mt-[6px] text-[13.5px] font-bold";

export function AddKidModal({
  onClose,
  initialValues = emptyValues,
  title = "Agregar niño",
}: AddKidModalProps) {
  const [fullName, setFullName] = useState(initialValues.fullName);
  const [birthDate, setBirthDate] = useState(initialValues.birthDate);
  const [classroom, setClassroom] = useState<Classroom | "">(
    initialValues.classroom,
  );
  const [allergies, setAllergies] = useState(initialValues.allergies);
  const [medicalNotes, setMedicalNotes] = useState(initialValues.medicalNotes);
  const [errors, setErrors] = useState<KidFormErrors>({});

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values: AddKidValues = {
      fullName,
      birthDate,
      classroom,
      allergies,
      medicalNotes,
    };
    const validationErrors = validateKidForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onClose();
    }
  }

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-6 py-10"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-auth-bg border-border w-full max-w-[520px] overflow-hidden rounded-[24px] border shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]"
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="border-border flex items-center justify-between gap-3 border-b px-[26px] py-5">
            <button
              type="button"
              onClick={onClose}
              className="text-secondary flex-none cursor-pointer text-[15px] font-bold"
            >
              Cancelar
            </button>
            <span className="font-display text-foreground min-w-0 flex-1 truncate text-center text-[18px] font-semibold">
              {title}
            </span>
            <div className="flex flex-none items-center gap-3">
              <button
                type="submit"
                className="text-accent-deep cursor-pointer text-[15px] font-extrabold"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="text-secondary flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl hover:opacity-70"
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-[26px] py-6">
            <label htmlFor="add-kid-full-name" className={labelBase}>
              NOMBRE COMPLETO
            </label>
            <input
              id="add-kid-full-name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Ej. Martina López"
              autoFocus
              autoComplete="off"
              className={inputBase}
              style={{
                borderColor: errors.fullName
                  ? "var(--auth-error)"
                  : "var(--auth-input-border)",
                color: "var(--foreground)",
                marginBottom: errors.fullName ? "0" : "18px",
              }}
            />
            {errors.fullName ? (
              <p role="alert" className={`${errorBase} mb-[18px]`}>
                {errors.fullName}
              </p>
            ) : null}

            <div className="flex gap-[14px]">
              <div className="min-w-0 flex-1">
                <label htmlFor="add-kid-birth-date" className={labelBase}>
                  FECHA DE NACIMIENTO
                </label>
                <input
                  id="add-kid-birth-date"
                  type="text"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                  placeholder="dd/mm/aaaa"
                  autoComplete="off"
                  inputMode="numeric"
                  className={inputBase}
                  style={{
                    borderColor: errors.birthDate
                      ? "var(--auth-error)"
                      : "var(--auth-input-border)",
                    color: "var(--foreground)",
                  }}
                />
                {errors.birthDate ? (
                  <p role="alert" className={errorBase}>
                    {errors.birthDate}
                  </p>
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <label htmlFor="add-kid-classroom" className={labelBase}>
                  SALA
                </label>
                <div className="relative">
                  <select
                    id="add-kid-classroom"
                    value={classroom}
                    onChange={(event) =>
                      setClassroom(event.target.value as Classroom | "")
                    }
                    aria-label="Sala"
                    className={`${inputBase} cursor-pointer appearance-none pr-10 font-bold`}
                    style={{
                      borderColor: errors.classroom
                        ? "var(--auth-error)"
                        : "var(--auth-input-border)",
                      color:
                        classroom === ""
                          ? "var(--auth-placeholder)"
                          : "var(--foreground)",
                    }}
                  >
                    <option value="">Elegir sala</option>
                    {(Object.keys(CLASSROOM_LABELS) as Classroom[]).map(
                      (option) => (
                        <option key={option} value={option}>
                          {CLASSROOM_LABELS[option]}
                        </option>
                      ),
                    )}
                  </select>
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B0A290"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
                {errors.classroom ? (
                  <p role="alert" className={errorBase}>
                    {errors.classroom}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-[18px]">
              <label htmlFor="add-kid-allergies" className={labelBase}>
                ALERGIAS (ETIQUETAS)
              </label>
              <input
                id="add-kid-allergies"
                type="text"
                value={allergies}
                onChange={(event) => setAllergies(event.target.value)}
                placeholder="Ej. Maní, Lactosa"
                autoComplete="off"
                className={`${inputBase} mb-[18px]`}
                style={{
                  borderColor: "var(--auth-input-border)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            <label htmlFor="add-kid-notes" className={labelBase}>
              NOTAS MÉDICAS
            </label>
            <textarea
              id="add-kid-notes"
              value={medicalNotes}
              onChange={(event) => setMedicalNotes(event.target.value)}
              placeholder="Indicaciones, medicación, contactos…"
              rows={3}
              className={`${inputBase} min-h-[90px] resize-y leading-[1.5]`}
              style={{
                borderColor: "var(--auth-input-border)",
                color: "var(--foreground)",
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
