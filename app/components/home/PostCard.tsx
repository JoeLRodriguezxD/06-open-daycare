import { Avatar } from "../shared/Avatar";
import { TypeBadge } from "../shared/TypeBadge";
import { LikeButton } from "./LikeButton";
import type { FeedPost } from "@/lib/feed-mock";

type PostCardProps = {
  post: FeedPost;
};

function AnnouncementIcon() {
  return (
    <div
      aria-hidden="true"
      className="bg-badge-announcement-bg text-badge-announcement-fg flex h-11 w-11 flex-none items-center justify-center rounded-full"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    </div>
  );
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article
      className="bg-surface border-border rounded-[20px] border px-[22px] py-5"
      style={{ boxShadow: "0 4px 16px -12px rgba(120,90,60,.5)" }}
    >
      <div className="mb-[14px] flex items-center gap-3">
        {post.type === "ANNOUNCEMENT" ? (
          <AnnouncementIcon />
        ) : (
          <Avatar initial={post.authorInitial} tone="child" size={44} />
        )}
        <div className="flex-1">
          <div className="font-display text-foreground text-[16.5px] font-semibold">
            {post.authorName}
          </div>
          <div className="text-muted text-[12.5px]">
            {post.time} · {post.publishedBy}
          </div>
        </div>
        <TypeBadge type={post.type} />
      </div>

      <div className="text-muted mb-[10px] text-[12.5px]">
        Para: {post.audience}
      </div>
      <p className="text-body m-0 text-[15.5px] leading-[1.55]">{post.body}</p>

      {post.hasPhotoPlaceholder ? (
        <a
          href="/foto"
          className="bg-photo-bg text-photo-fg mt-[14px] flex h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed"
          style={{ borderColor: "var(--photo-border)" }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
          </svg>
          <span className="text-[13.5px]">{post.photoLabel}</span>
        </a>
      ) : null}

      <div
        className="mt-4 flex items-center gap-[18px] border-t pt-[14px]"
        style={{ borderColor: "var(--card-divider)" }}
      >
        <LikeButton initialLikes={post.likes} />
        <a
          href="/detalle-publicacion"
          className="text-secondary flex items-center gap-[7px] text-sm font-bold"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
          </svg>
          {post.comments}
        </a>
        <span className="flex-1" />
        <a href="/crear-publicacion" className="text-edit text-sm font-extrabold">
          Editar
        </a>
      </div>
    </article>
  );
}
