import { POST_TYPE_LABELS, type PostType } from "@/lib/feed-mock";

const badgeColors: Record<PostType, { background: string; foreground: string }> = {
  ACHIEVEMENT: {
    background: "var(--badge-achievement-bg)",
    foreground: "var(--badge-achievement-fg)",
  },
  ACTIVITY: {
    background: "var(--badge-activity-bg)",
    foreground: "var(--badge-activity-fg)",
  },
  ANNOUNCEMENT: {
    background: "var(--badge-announcement-bg)",
    foreground: "var(--badge-announcement-fg)",
  },
};

type TypeBadgeProps = {
  type: PostType;
};

export function TypeBadge({ type }: TypeBadgeProps) {
  const colors = badgeColors[type];

  return (
    <span
      className="flex items-center gap-[7px] rounded-full px-3 py-1.5"
      style={{ backgroundColor: colors.background }}
    >
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: colors.foreground }}
      />
      <span
        className="text-xs font-extrabold tracking-[0.5px]"
        style={{ color: colors.foreground }}
      >
        {POST_TYPE_LABELS[type]}
      </span>
    </span>
  );
}
