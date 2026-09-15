import type { Kid } from "@/lib/kids-mock";

type KidFactsProps = {
  kid: Kid;
};

type FactRowProps = {
  label: string;
  value: string;
  isLast?: boolean;
};

function FactRow({ label, value, isLast = false }: FactRowProps) {
  return (
    <div
      className={`flex justify-between px-[18px] py-[15px] ${isLast ? "" : "border-b"}`}
      style={isLast ? undefined : { borderColor: "var(--card-divider)" }}
    >
      <span className="text-secondary text-[14.5px]">{label}</span>
      <span className="text-foreground text-[14.5px] font-extrabold">
        {value}
      </span>
    </div>
  );
}

export function KidFacts({ kid }: KidFactsProps) {
  return (
    <div className="bg-surface border-border overflow-hidden rounded-2xl border">
      <FactRow label="Fecha de nacimiento" value={kid.birthDate} />
      <FactRow label="Sala" value={kid.classroom} />
      <FactRow label="Ingreso" value={kid.enrolledAt} isLast />
    </div>
  );
}
