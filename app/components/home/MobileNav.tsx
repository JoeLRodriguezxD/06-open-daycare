"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Avatar } from "../shared/Avatar";
import { currentUser } from "@/lib/feed-mock";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="bg-surface border-border flex items-center gap-3 border-b px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="text-foreground flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl hover:opacity-70"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="font-display text-foreground flex-1 text-[17px] font-semibold">
          OpenDayCare
        </div>
        <Avatar initial={currentUser.initial} tone="user" size={34} />
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="absolute inset-0 cursor-pointer bg-black/40"
          />
          <div className="bg-surface absolute top-0 left-0 h-full w-[280px] max-w-[85vw] overflow-y-auto shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="text-secondary absolute top-4 right-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl hover:opacity-70"
            >
              <svg
                width="20"
                height="20"
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
            <Sidebar />
          </div>
        </div>
      ) : null}
    </>
  );
}
