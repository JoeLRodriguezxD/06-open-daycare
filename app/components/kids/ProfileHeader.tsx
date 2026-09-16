import Link from "next/link";
import { Avatar } from "../shared/Avatar";
import type { Kid } from "@/lib/kids-mock";

type ProfileHeaderProps = {
  kid: Kid;
};

export function ProfileHeader({ kid }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-[18px]">
      <Avatar
        initial={kid.initial}
        background={kid.avatarBg}
        foreground={kid.avatarFg}
        size={84}
      />
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-foreground text-[28px] font-semibold">
          {kid.fullName}
        </h1>
        <p className="text-secondary mt-[3px] text-[15px]">
          {kid.ageLabel} · Sala {kid.classroom}
        </p>
      </div>
      <Link
        href="/agregar-nino"
        className="bg-surface border-border text-nav-inactive flex-none rounded-xl border-[1.5px] px-4 py-[9px] text-sm font-bold"
      >
        Editar
      </Link>
    </div>
  );
}
