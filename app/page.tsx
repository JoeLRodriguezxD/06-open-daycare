import { Composer } from "./components/home/Composer";
import { FeedHeader } from "./components/home/FeedHeader";
import { MobileNav } from "./components/home/MobileNav";
import { PostCard } from "./components/home/PostCard";
import { Sidebar } from "./components/home/Sidebar";
import { feedPosts } from "@/lib/feed-mock";

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <div className="flex min-h-screen">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="min-w-0 flex-1">
          <MobileNav />

          <div className="mx-auto w-full max-w-[760px] px-5 pt-[34px] pb-20 md:px-10">
            <FeedHeader />
            <Composer />

            <div className="mb-[14px] flex items-center gap-[14px]">
              <span className="text-label text-[12.5px] font-extrabold tracking-[0.8px]">
                PUBLICADO HOY
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1"
                style={{ backgroundColor: "var(--divider)" }}
              />
            </div>

            <div className="flex flex-col gap-4">
              {feedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
