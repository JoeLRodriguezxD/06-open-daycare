"use client";

import Link from "next/link";
import { useState } from "react";
import { validateLogin, type FormErrors } from "@/lib/auth-validation";
import { login } from "@/app/login/actions";

const inputBase =
  "w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[14px] text-[15px] outline-none";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateLogin({ email, password });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setServerError(null);
      return;
    }
    setServerError(null);
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.set("email", email.trim());
      formData.set("password", password);
      const result = await login(formData);
      if (result?.error) {
        setServerError(result.error);
      }
    } catch {
      setServerError("No se pudo iniciar sesión. Intentá de nuevo");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label
        htmlFor="login-email"
        className="text-secondary mb-2 block text-xs font-bold tracking-[0.7px]"
      >
        EMAIL
      </label>
      <input
        id="login-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        className={inputBase}
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
        htmlFor="login-password"
        className="text-secondary mb-2 block text-xs font-bold tracking-[0.7px]"
      >
        CONTRASEÑA
      </label>
      <input
        id="login-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="••••••••"
        autoComplete="current-password"
        className={`${inputBase} placeholder:text-auth-placeholder`}
        style={{
          borderColor: errors.password
            ? "var(--auth-error)"
            : "var(--auth-input-border)",
          color: "var(--foreground)",
          marginBottom: errors.password ? "6px" : "10px",
        }}
      />
      {errors.password ? (
        <p role="alert" className="text-auth-error mb-[10px] text-[13.5px] font-bold">
          {errors.password}
        </p>
      ) : null}

      <div className="mb-5 text-right">
        <Link
          href="/recuperar-password"
          className="text-auth-error text-[13.5px] font-bold"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="block w-full cursor-pointer rounded-[15px] p-[15px] text-base font-extrabold text-white disabled:cursor-wait disabled:opacity-70"
        style={{
          background:
            "linear-gradient(180deg, var(--auth-button-start), var(--auth-button-end))",
          boxShadow: "0 10px 22px -8px rgba(238,129,100,.7)",
        }}
      >
        Iniciar sesión
      </button>
      {serverError ? (
        <p role="alert" className="text-auth-error mt-4 text-center text-[13.5px] font-bold">
          {serverError}
        </p>
      ) : null}

      <p className="text-secondary mt-6 text-center text-[14.5px]">
        ¿Te invitó la guardería?{" "}
        <Link
          href="/activate-account"
          className="text-auth-error font-extrabold"
        >
          Activá tu cuenta
        </Link>
      </p>
    </form>
  );
}
