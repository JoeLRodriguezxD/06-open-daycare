import { MobileNav } from "../components/home/MobileNav";
import { Sidebar } from "../components/home/Sidebar";
import { AddKidTrigger } from "../components/kids/AddKidTrigger";
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
              <AddKidTrigger />
            </div>

            <KidSearch kids={kids} />
          </div>
        </main>
      </div>
    </div>
  );
}
