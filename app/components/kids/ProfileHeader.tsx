import { Avatar } from "../shared/Avatar";
import { EditKidTrigger } from "./EditKidTrigger";
import type { Kid } from "@/lib/kids-mock";
import type { RoomOption } from "@/lib/rooms";

type ProfileHeaderProps = {
  kid: Kid;
  rooms: RoomOption[];
  roomsError?: string | null;
};

export function ProfileHeader({ kid, rooms, roomsError = null }: ProfileHeaderProps) {
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
      <EditKidTrigger kid={kid} rooms={rooms} roomsError={roomsError} />
    </div>
  );
}
