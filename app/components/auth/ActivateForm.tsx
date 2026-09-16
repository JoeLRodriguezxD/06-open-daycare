"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateActivation, type FormErrors } from "@/lib/auth-validation";

const inputBase =
  "w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[14px] outline-none";

export function ActivateForm() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("7K4P9");
  const [email, setEmail] = useState("lucia.fernandez@gmail.com");
  const [password, setPassword] = useState("");
  const [photoConsent, setPhotoConsent] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateActivation({
      inviteCode,
      email,
      password,
      photoConsent,
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      router.push("/");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label
        htmlFor="activate-code"
        className="text-secondary mb-2 block text-xs font-bold tracking-[0.7px]"
      >
        CÓDIGO DE INVITACIÓN
      </label>
      <input
        id="activate-code"
        type="text"
        value={inviteCode}
        onChange={(event) => setInviteCode(event.target.value)}
        autoComplete="off"
        className={`${inputBase} font-display text-[18px] font-bold tracking-[3px]`}
        style={{
          borderColor: errors.inviteCode
            ? "var(--auth-error)"
            : "var(--auth-input-border)",
          color: "var(--foreground)",
          marginBottom: errors.inviteCode ? "6px" : "18px",
        }}
      />
      {errors.inviteCode ? (
        <p role="alert" className="text-auth-error mb-[18px] text-[13.5px] font-bold">
          {errors.inviteCode}
        </p>
      ) : null}

      <label
        htmlFor="activate-email"
        className="text-secondary mb-2 block text-xs font-bold tracking-[0.7px]"
      >
        EMAIL
      </label>
      <input
        id="activate-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        className={`${inputBase} text-[15px]`}
        style={{
          borderColor: errors.email
            ? "var(--auth-error)"
            : "var(--auth-input-border)",
          color: "var(--foreground)",
          marginBottom: errors.email ? "6px" : "18px",
        }}
      />
      {errors.email ? (
        <p role="alert" className="text-auth-error mb-[18px] text-[13.5px] font-bold">
          {errors.email}
        </p>
      ) : null}

      <label
        htmlFor="activate-password"
        className="text-secondary mb-2 block text-xs font-bold tracking-[0.7px]"
      >
        CREAR CONTRASEÑA
      </label>
      <input
        id="activate-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Mínimo 6 caracteres"
        autoComplete="new-password"
        className={`${inputBase} placeholder:text-auth-placeholder text-[15px]`}
        style={{
          borderColor: errors.password
            ? "var(--auth-error)"
            : "var(--auth-input-border)",
          color: "var(--foreground)",
          marginBottom: errors.password ? "6px" : "18px",
        }}
      />
      {errors.password ? (
        <p role="alert" className="text-auth-error mb-[18px] text-[13.5px] font-bold">
          {errors.password}
        </p>
      ) : null}

      <label
        className="mb-6 flex cursor-pointer items-start gap-3 rounded-[14px] px-4 py-[14px]"
        style={{ background: "var(--auth-consent-bg)" }}
      >
        <input
          type="checkbox"
          checked={photoConsent}
          onChange={(event) => setPhotoConsent(event.target.checked)}
          aria-label="Autorizo el uso de fotos"
          className="sr-only"
        />
        <span
          aria-hidden="true"
          className="mt-[1px] flex h-6 w-6 flex-none items-center justify-center rounded-lg"
          style={{
            background: photoConsent
              ? "var(--auth-consent-check)"
              : "#fff",
            border: photoConsent
              ? "none"
              : "1.5px solid var(--auth-input-border)",
          }}
        >
          {photoConsent ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : null}
        </span>
        <span
          className="text-sm leading-[1.45]"
          style={{ color: "var(--auth-consent-fg)" }}
        >
          Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro
          de la app.
        </span>
      </label>
      {errors.photoConsent ? (
        <p role="alert" className="text-auth-error mt-[-12px] mb-[18px] text-[13.5px] font-bold">
          {errors.photoConsent}
        </p>
      ) : null}

      <button
        type="submit"
        className="block w-full cursor-pointer rounded-[15px] p-[15px] text-base font-extrabold text-white"
        style={{
          background:
            "linear-gradient(180deg, var(--auth-button-start), var(--auth-button-end))",
          boxShadow: "0 10px 22px -8px rgba(238,129,100,.7)",
        }}
      >
        Activar mi cuenta
      </button>
    </form>
  );
}
