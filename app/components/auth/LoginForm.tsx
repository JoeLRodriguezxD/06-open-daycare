"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateLogin, type FormErrors } from "@/lib/auth-validation";

const inputBase =
  "w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[14px] text-[15px] outline-none";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateLogin({ email, password });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      router.push("/");
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
        className="block w-full cursor-pointer rounded-[15px] p-[15px] text-base font-extrabold text-white"
        style={{
          background:
            "linear-gradient(180deg, var(--auth-button-start), var(--auth-button-end))",
          boxShadow: "0 10px 22px -8px rgba(238,129,100,.7)",
        }}
      >
        Iniciar sesión
      </button>

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
