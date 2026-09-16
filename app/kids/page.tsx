import Link from "next/link";
import { MobileNav } from "../components/home/MobileNav";
import { Sidebar } from "../components/home/Sidebar";
import { KidSearch } from "../components/kids/KidSearch";
import { kids } from "@/lib/kids-mock";

export default function KidsPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="flex min-h-screen">
        <div className="hidden md:block">
          <Sidebar activeItem="kids" />
        </div>

        <main className="min-w-0 flex-1">
          <MobileNav activeItem="kids" />

          <div className="mx-auto w-full max-w-[880px] px-5 pt-[34px] pb-20 md:px-10">
            <div className="mb-[22px] flex items-end justify-between gap-4">
              <div>
                <div className="text-accent-deep mb-1 text-[12.5px] font-extrabold tracking-[0.8px]">
                  GESTIÓN
                </div>
                <h1 className="font-display text-foreground text-[30px] leading-none font-semibold">
                  Niños
                </h1>
              </div>
              <Link
                href="/agregar-nino"
                className="flex items-center gap-2 rounded-[14px] px-[18px] py-[11px] text-[14.5px] font-extrabold text-white"
                style={{
                  background:
                    "linear-gradient(180deg, #f4977e, var(--accent-strong))",
                  boxShadow: "0 8px 18px -8px rgba(238,129,100,.7)",
                }}
              >
                <svg
                  aria-hidden="true"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Agregar niño
              </Link>
            </div>

            <KidSearch kids={kids} />
          </div>
        </main>
      </div>
    </div>
  );
}
