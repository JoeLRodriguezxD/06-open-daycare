"use client";

import { useEffect, useState } from "react";
import {
  PARENT_RELATION_LABELS,
  generateInviteCode,
  validateParentInvite,
  type InviteErrors,
  type ParentRelation,
} from "@/lib/parent-invite-validation";

type LinkParentModalProps = {
  kidFullName: string;
  kidShortName: string;
  onClose: () => void;
};

const inputBase =
  "w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] outline-none placeholder:text-auth-placeholder";

const labelBase =
  "text-secondary mb-2 block text-xs font-extrabold tracking-[0.7px]";

const errorBase = "text-auth-error mt-[6px] text-[13.5px] font-bold";

const relationOptions: ParentRelation[] = ["MOTHER", "FATHER", "GUARDIAN"];

export function LinkParentModal({
  kidFullName,
  kidShortName,
  onClose,
}: LinkParentModalProps) {
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [relation, setRelation] = useState<ParentRelation | "">("");
  const [errors, setErrors] = useState<InviteErrors>({});
  const [inviteCode] = useState(() => generateInviteCode());

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateParentInvite({
      parentName,
      email,
      relation,
    });
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
        aria-label={`Vincular padre a ${kidFullName}`}
        className="bg-auth-bg border-border w-full max-w-[480px] overflow-hidden rounded-[24px] border shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]"
      >
        <div className="border-border flex items-center justify-between gap-3 border-b px-[26px] py-5">
          <div className="min-w-0">
            <div className="font-display text-foreground text-[18px] font-semibold">
              Vincular padre
            </div>
            <div className="text-muted text-[13px]">a {kidFullName}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="bg-card-divider text-secondary flex h-[34px] w-[34px] flex-none cursor-pointer items-center justify-center rounded-[10px] hover:opacity-70"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-[26px] py-[22px]">
            <div
              className="mb-5 flex gap-[11px] rounded-[14px] px-4 py-[13px]"
              style={{ backgroundColor: "var(--invite-info-bg)" }}
            >
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--invite-info-icon)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-[1px] flex-none"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <span
                className="text-[13.5px] leading-[1.45]"
                style={{ color: "var(--invite-info-fg)" }}
              >
                Le enviaremos un correo con un código para que active su cuenta.
                Solo verá el feed de {kidShortName}.
              </span>
            </div>

            <label htmlFor="link-parent-name" className={labelBase}>
              NOMBRE DEL PADRE/MADRE
            </label>
            <input
              id="link-parent-name"
              type="text"
              value={parentName}
              onChange={(event) => setParentName(event.target.value)}
              placeholder="Ej. Diego Fernández"
              autoFocus
              autoComplete="off"
              className={inputBase}
              style={{
                borderColor: errors.parentName
                  ? "var(--auth-error)"
                  : "var(--auth-input-border)",
                color: "var(--foreground)",
                marginBottom: errors.parentName ? "0" : "18px",
              }}
            />
            {errors.parentName ? (
              <p role="alert" className={`${errorBase} mb-[18px]`}>
                {errors.parentName}
              </p>
            ) : null}

            <label htmlFor="link-parent-email" className={labelBase}>
              EMAIL
            </label>
            <input
              id="link-parent-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="correo@ejemplo.com"
              autoComplete="off"
              className={inputBase}
              style={{
                borderColor: errors.email
                  ? "var(--auth-error)"
                  : "var(--auth-input-border)",
                color: "var(--foreground)",
                marginBottom: errors.email ? "0" : "18px",
              }}
            />
            {errors.email ? (
              <p role="alert" className={`${errorBase} mb-[18px]`}>
                {errors.email}
              </p>
            ) : null}

            <div className={`${labelBase} mb-[10px]`}>PARENTESCO</div>
            <div className="mb-5 flex gap-[9px]">
              {relationOptions.map((option) => {
                const selected = relation === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRelation(option)}
                    aria-pressed={selected}
                    className="flex-1 cursor-pointer rounded-full border-[1.5px] px-2 py-[11px] text-sm font-extrabold"
                    style={{
                      borderColor: selected
                        ? "var(--invite-pill-selected-border)"
                        : "var(--border)",
                      backgroundColor: selected
                        ? "var(--invite-pill-selected-bg)"
                        : "var(--surface)",
                      color: selected
                        ? "var(--invite-pill-selected-fg)"
                        : "var(--nav-inactive)",
                    }}
                  >
                    {PARENT_RELATION_LABELS[option]}
                  </button>
                );
              })}
            </div>
            {errors.relation ? (
              <p role="alert" className={`${errorBase} mt-[-12px] mb-5`}>
                {errors.relation}
              </p>
            ) : null}

            <div
              className="mb-5 rounded-[16px] border-[1.5px] border-dashed px-4 py-[18px] text-center"
              style={{
                backgroundColor: "var(--auth-consent-bg)",
                borderColor: "var(--invite-code-border)",
              }}
            >
              <div
                className="mb-2 text-xs font-extrabold tracking-[0.7px]"
                style={{ color: "var(--invite-code-label)" }}
              >
                CÓDIGO DE INVITACIÓN
              </div>
              <div
                className="font-display text-[34px] font-semibold tracking-[7px]"
                style={{ color: "var(--auth-consent-fg)" }}
              >
                {inviteCode}
              </div>
              <div
                className="mt-[6px] text-[13px]"
                style={{ color: "var(--invite-code-label)" }}
              >
                Vence en 7 días
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-[9px] rounded-[14px] p-[14px] text-[15.5px] font-extrabold text-white"
              style={{
                background:
                  "linear-gradient(180deg, var(--auth-button-start), var(--auth-button-end))",
                boxShadow: "0 10px 22px -8px rgba(238,129,100,.7)",
              }}
            >
              <svg
                aria-hidden="true"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4z" />
                <path d="M22 2 11 13" />
              </svg>
              Enviar invitación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
