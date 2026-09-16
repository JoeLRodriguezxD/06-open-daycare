import { Avatar } from "../shared/Avatar";
import { LinkParentTrigger } from "./LinkParentTrigger";
import type { Kid, LinkedParent, ParentStatus } from "@/lib/kids-mock";

type LinkedParentsProps = {
  kid: Kid;
};

const statusBadgeLabels: Record<ParentStatus, string> = {
  ACTIVE: "ACTIVA",
  PENDING: "PENDIENTE",
};

const statusDetailLabels: Record<ParentStatus, string> = {
  ACTIVE: "activa",
  PENDING: "invitación enviada",
};

function ParentRow({ parent }: { parent: LinkedParent }) {
  const isActive = parent.status === "ACTIVE";

  return (
    <div className="flex items-center gap-3">
      <Avatar
        initial={parent.initial}
        background={parent.avatarBg}
        foreground={parent.avatarFg}
        size={40}
      />
      <div className="min-w-0 flex-1">
        <div className="text-foreground text-[14.5px] font-extrabold">
          {parent.name}
        </div>
        <div className="text-muted text-[12.5px]">
          {parent.relation} · {statusDetailLabels[parent.status]}
        </div>
      </div>
      <span
        className={`flex-none rounded-full px-[9px] py-1 text-[10.5px] font-extrabold ${
          isActive
            ? "bg-badge-achievement-bg text-badge-achievement-fg"
            : "bg-badge-pending-bg text-badge-pending-fg"
        }`}
      >
        {statusBadgeLabels[parent.status]}
      </span>
    </div>
  );
}

export function LinkedParents({ kid }: LinkedParentsProps) {
  const parents = kid.linkedParents;
  return (
    <div className="bg-surface border-border rounded-2xl border px-[18px] py-4">
      <div className="text-label mb-[14px] text-[12.5px] font-extrabold tracking-[0.8px]">
        PADRES VINCULADOS
      </div>
      <div className="flex flex-col gap-[14px]">
        {parents.map((parent) => (
          <ParentRow key={parent.id} parent={parent} />
        ))}
        <LinkParentTrigger
          kid={kid}
          ariaLabel={`Vincular padre a ${kid.fullName}`}
          className="flex cursor-pointer items-center gap-3 pt-2 text-left"
        >
          <span
            aria-hidden="true"
            className="text-photo-fg flex h-10 w-10 flex-none items-center justify-center rounded-full border-[1.5px] border-dashed"
            style={{ borderColor: "var(--invite-border)" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span className="text-edit text-[14.5px] font-extrabold">
            Vincular otro padre
          </span>
        </LinkParentTrigger>
      </div>
    </div>
  );
}
