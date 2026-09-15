import { BrandPanel } from "../components/auth/BrandPanel";
import { LoginForm } from "../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="grid min-h-screen grid-cols-1 md:grid-cols-[1.05fr_1fr]"
      style={{ background: "var(--auth-bg)" }}
    >
      <BrandPanel />

      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-[392px]">
          <h2 className="font-display m-0 mb-[6px] text-[30px] font-semibold" style={{ color: "var(--foreground)" }}>
            Iniciar sesión
          </h2>
          <p className="text-secondary m-0 mb-7 text-[15px]">
            Ingresá para ver el día de hoy.
          </p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
