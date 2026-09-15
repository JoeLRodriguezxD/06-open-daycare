"use client";

import { useState } from "react";
import { KidsGrid } from "./KidsGrid";
import type { Kid } from "@/lib/kids-mock";

type KidSearchProps = {
  kids: Kid[];
};

export function KidSearch({ kids }: KidSearchProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleKids =
    normalizedQuery === ""
      ? kids
      : kids.filter((kid) =>
          kid.fullName.toLowerCase().includes(normalizedQuery),
        );

  return (
    <div>
      <div className="bg-surface border-border mb-[22px] flex items-center gap-[11px] rounded-[14px] border px-4 py-3">
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--photo-fg)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar niño…"
          aria-label="Buscar niño"
          className="text-foreground placeholder:text-muted min-w-0 flex-1 border-none bg-transparent text-[15px] outline-none"
        />
      </div>

      {visibleKids.length > 0 ? (
        <KidsGrid kids={visibleKids} />
      ) : (
        <p className="text-secondary bg-surface border-border rounded-2xl border px-5 py-8 text-center text-[15px]">
          No se encontró ningún niño con ese nombre.
        </p>
      )}
    </div>
  );
}
