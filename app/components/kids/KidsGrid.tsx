import { KidCard } from "./KidCard";
import type { Kid } from "@/lib/kids-mock";

type KidsGridProps = {
  kids: Kid[];
};

export function KidsGrid({ kids }: KidsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
      {kids.map((kid) => (
        <KidCard key={kid.id} kid={kid} />
      ))}
    </div>
  );
}
