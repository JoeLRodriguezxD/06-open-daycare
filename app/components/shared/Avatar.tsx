type AvatarTone = "user" | "child";

type AvatarProps = {
  initial: string;
  tone?: AvatarTone;
  size?: number;
};

const toneColors: Record<AvatarTone, { background: string; foreground: string }> = {
  user: {
    background: "var(--accent)",
    foreground: "#ffffff",
  },
  child: {
    background: "var(--avatar-child-bg)",
    foreground: "var(--avatar-child-fg)",
  },
};

export function Avatar({ initial, tone = "user", size = 40 }: AvatarProps) {
  const colors = toneColors[tone];

  return (
    <div
      aria-hidden="true"
      className="font-display flex flex-none items-center justify-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        backgroundColor: colors.background,
        color: colors.foreground,
      }}
    >
      {initial}
    </div>
  );
}
