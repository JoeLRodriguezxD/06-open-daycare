import Link from "next/link";
import { Avatar } from "../shared/Avatar";
import type { Kid } from "@/lib/kids-mock";

type KidCardProps = {
  kid: Kid;
};

function parentsLabel(count: number): string {
  if (count === 0) {
    return "sin padres vinculados";
  }
  if (count === 1) {
    return "1 padre vinculado";
  }
  return `${count} padres vinculados`;
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="flex-none"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--kid-chevron)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function KidCard({ kid }: KidCardProps) {
  const hasAllergyTag = kid.allergyTag !== undefined && kid.allergyTag !== "";
  const showLinkBadge = !hasAllergyTag && kid.linkedParentsCount === 0;

  return (
    <Link
      href={`/kids/${kid.slug}`}
      className="bg-surface border-border hover:border-kid-hover-border flex min-w-0 items-center gap-[14px] rounded-[18px] border p-4 transition-transform duration-150 hover:-translate-y-0.5"
      style={{ boxShadow: "0 4px 14px -12px rgba(120,90,60,.5)" }}
    >
      <Avatar
        initial={kid.initial}
        background={kid.avatarBg}
        foreground={kid.avatarFg}
        size={48}
      />
      <div className="min-w-0 flex-1">
        <div className="font-display text-foreground truncate text-[16px] font-semibold">
          {kid.fullName}
        </div>
        <div className="text-muted truncate text-[13px]">
          {kid.ageLabel} · {parentsLabel(kid.linkedParentsCount)}
        </div>
      </div>
      {hasAllergyTag ? (
        <span className="bg-badge-allergy-bg text-badge-allergy-fg flex-none rounded-full px-[9px] py-[5px] text-[11px] font-extrabold">
          {kid.allergyTag}
        </span>
      ) : showLinkBadge ? (
        <span className="bg-badge-link-bg text-badge-link-fg flex-none rounded-full px-[9px] py-[5px] text-[11px] font-extrabold">
          VINCULAR
        </span>
      ) : (
        <ChevronIcon />
      )}
    </Link>
  );
}
