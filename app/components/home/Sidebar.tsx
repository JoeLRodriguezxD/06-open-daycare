import Link from "next/link";
import { Avatar } from "../shared/Avatar";
import { currentUser } from "@/lib/feed-mock";

const navLinkBase =
  "flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px]";

export function Sidebar() {
  return (
    <aside className="bg-surface border-border sticky top-0 flex h-screen w-[248px] flex-none flex-col border-r px-4 py-6">
      <Link href="/" className="flex items-center gap-[11px] px-2 pt-1 pb-[22px]">
        <div
          aria-hidden="true"
          className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl"
          style={{
            background: "linear-gradient(155deg, #f8c3a8, var(--accent))",
          }}
        >
          <svg
            width="21"
            height="21"
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
        <div>
          <div className="font-display text-foreground text-[17px] leading-none font-semibold">
            OpenDayCare
          </div>
          <div className="text-muted mt-[2px] text-[11.5px]">Sala Soles</div>
        </div>
      </Link>

      <a
        href="/crear-publicacion"
        className="mb-[18px] flex w-full items-center justify-center gap-2 rounded-[14px] p-3 text-[14.5px] font-extrabold text-white"
        style={{
          background: "linear-gradient(180deg, #f4977e, var(--accent-strong))",
          boxShadow: "0 8px 18px -8px rgba(238,129,100,.75)",
        }}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Nueva publicación
      </a>

      <nav className="flex flex-1 flex-col gap-1">
        <Link
          href="/"
          aria-current="page"
          className={`${navLinkBase} bg-accent-bg text-accent-deep font-extrabold`}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
          </svg>
          Feed
        </Link>
        <a
          href="/ninos"
          className={`${navLinkBase} text-nav-inactive font-semibold`}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="7" r="3" />
            <circle cx="17" cy="9" r="2.4" />
            <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 20a5 5 0 0 1 5.5-4.9" />
          </svg>
          Niños
        </a>
        <a
          href="/avisos"
          className={`${navLinkBase} text-nav-inactive font-semibold`}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
          Avisos
        </a>
        <a
          href="/mi-cuenta"
          className={`${navLinkBase} text-nav-inactive font-semibold`}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Mi cuenta
        </a>
      </nav>

      <div className="border-border mt-[10px] border-t pt-[14px]">
        <div className="flex items-center gap-[11px] px-2 py-1.5">
          <Avatar initial={currentUser.initial} tone="user" size={38} />
          <div className="min-w-0 flex-1">
            <div className="text-foreground truncate text-sm font-extrabold">
              {currentUser.name}
            </div>
            <div className="text-muted text-xs">{currentUser.role}</div>
          </div>
          <a
            href="/login"
            title="Cerrar sesión"
            className="bg-background text-secondary flex h-8 w-8 flex-none items-center justify-center rounded-[10px]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
}
