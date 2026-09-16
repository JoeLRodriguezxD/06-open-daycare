import Link from "next/link";
import { notFound } from "next/navigation";
import { MobileNav } from "../../components/home/MobileNav";
import { Sidebar } from "../../components/home/Sidebar";
import { AllergyNotes } from "../../components/kids/AllergyNotes";
import { KidFacts } from "../../components/kids/KidFacts";
import { LinkedParents } from "../../components/kids/LinkedParents";
import { ProfileHeader } from "../../components/kids/ProfileHeader";
import { getKidBySlug, kids } from "@/lib/kids-mock";

export function generateStaticParams() {
  return kids.map((kid) => ({ slug: kid.slug }));
}

type KidProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function KidProfilePage({ params }: KidProfilePageProps) {
  const { slug } = await params;
  const kid = getKidBySlug(slug);

  if (kid === undefined) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="flex min-h-screen">
        <div className="hidden md:block">
          <Sidebar activeItem="kids" />
        </div>

        <main className="min-w-0 flex-1">
          <MobileNav activeItem="kids" />

          <div className="mx-auto w-full max-w-[820px] px-5 pt-[34px] pb-20 md:px-10">
            <Link
              href="/kids"
              className="text-secondary mb-5 flex items-center gap-[7px] text-sm font-bold"
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Volver a Niños
            </Link>

            <div className="flex flex-wrap items-start gap-[26px]">
              <div className="flex min-w-[300px] flex-1 flex-col gap-[18px]">
                <ProfileHeader kid={kid} />
                {kid.allergyNotes ? (
                  <AllergyNotes notes={kid.allergyNotes} />
                ) : null}
                <KidFacts kid={kid} />
              </div>

              <div className="flex w-full flex-none flex-col gap-[14px] md:w-[300px]">
                <Link
                  href="/resumen-dia"
                  className="flex w-full items-center justify-center gap-[9px] rounded-[14px] p-[13px] text-[15px] font-extrabold text-white"
                  style={{ backgroundColor: "var(--foreground)" }}
                >
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                  </svg>
                  Resumen del día
                </Link>
                <LinkedParents kid={kid} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
