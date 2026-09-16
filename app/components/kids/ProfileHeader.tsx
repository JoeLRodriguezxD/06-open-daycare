import { Avatar } from "../shared/Avatar";
import { EditKidTrigger } from "./EditKidTrigger";
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
      <EditKidTrigger kid={kid} />
    </div>
  );
}
