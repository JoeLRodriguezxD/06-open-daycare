import { Avatar } from "../shared/Avatar";
import { CreatePostTrigger } from "./CreatePostTrigger";
import { currentUser } from "@/lib/feed-mock";

export function Composer() {
  return (
    <CreatePostTrigger
      ariaLabel="Crear publicación"
      className="bg-surface border-border mb-6 flex w-full cursor-pointer items-center gap-[14px] rounded-[18px] border px-[18px] py-[14px] text-left"
      style={{ boxShadow: "0 4px 14px -10px rgba(120,90,60,.4)" }}
    >
      <Avatar initial={currentUser.initial} tone="user" size={40} />
      <span className="text-muted flex-1 text-[15px]">
        Compartí un momento…
      </span>
      <span className="bg-accent-bg text-accent-soft flex h-[38px] w-[38px] items-center justify-center rounded-xl">
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </span>
    </CreatePostTrigger>
  );
}
