import Link from "next/link";
import { ActivateForm } from "../components/auth/ActivateForm";

const invitePreview = { childName: "Mateo", classroom: "Sala Soles", initial: "M" };

export default function ActivateAccountPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-10"
      style={{ background: "var(--auth-bg)" }}
    >
      <div className="w-full max-w-[440px]">
        <div
          aria-hidden="true"
          className="mb-[22px] flex h-[58px] w-[58px] items-center justify-center rounded-[18px]"
          style={{
            background: "linear-gradient(155deg,#F8C3A8,#F2937A)",
            boxShadow: "0 12px 26px -10px rgba(238,129,100,.65)",
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </div>

        <h1
          className="font-display m-0 mb-2 text-[32px] leading-[1.15] font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Bienvenida a OpenDayCare
        </h1>
        <p className="text-secondary m-0 mb-[26px] text-[15.5px] leading-[1.55]">
          Te invitaron a seguir el día de tu hijo. Creá tu contraseña para
          activar la cuenta.
        </p>

        <div
          className="mb-[22px] flex items-center gap-[14px] rounded-2xl border-[1.5px] bg-white px-4 py-[14px]"
          style={{ borderColor: "var(--auth-input-border)" }}
        >
          <div
            aria-hidden="true"
            className="font-display flex h-11 w-11 flex-none items-center justify-center rounded-full text-[19px] font-semibold"
            style={{
              background: "var(--avatar-sky-bg)",
              color: "var(--avatar-sky-fg)",
            }}
          >
            {invitePreview.initial}
          </div>
          <div>
            <div className="text-secondary text-[13px]">
              Te invitaron a seguir a
            </div>
            <div
              className="font-display text-[17px] font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {invitePreview.childName} · {invitePreview.classroom}
            </div>
          </div>
        </div>

        <ActivateForm />

        <p className="text-secondary mt-[22px] mb-0 text-center text-[14.5px]">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-auth-error font-extrabold">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
