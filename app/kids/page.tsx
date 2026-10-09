import { MobileNav } from "../components/home/MobileNav";
import { Sidebar } from "../components/home/Sidebar";
import { AddKidTrigger } from "../components/kids/AddKidTrigger";
import { KidSearch } from "../components/kids/KidSearch";
import { getChildren } from "@/lib/children";
import { getRooms } from "@/lib/rooms";
import { getSessionUser } from "@/lib/session-user";

export default async function KidsPage() {
  const user = await getSessionUser();
  const { rooms, error: roomsError } = await getRooms();
  const { kids, error: kidsError } = await getChildren();

  return (
    <div className="bg-background min-h-screen">
      <div className="flex min-h-screen">
        <div className="hidden md:block">
          <Sidebar activeItem="kids" user={user} />
        </div>

        <main className="min-w-0 flex-1">
          <MobileNav activeItem="kids" user={user} />

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
              <AddKidTrigger rooms={rooms} roomsError={roomsError} />
            </div>

            {kidsError ? (
              <p
                role="alert"
                className="text-auth-error bg-surface border-border rounded-2xl border px-5 py-8 text-center text-[15px] font-bold"
              >
                {kidsError}
              </p>
            ) : kids.length === 0 ? (
              <p className="text-secondary bg-surface border-border rounded-2xl border px-5 py-8 text-center text-[15px]">
                Todavía no hay niños. Agregá el primero con “Agregar niño”.
              </p>
            ) : (
              <KidSearch kids={kids} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
