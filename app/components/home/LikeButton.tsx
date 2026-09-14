"use client";

import { useState } from "react";

type LikeButtonProps = {
  initialLikes: number;
};

export function LikeButton({ initialLikes }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const count = initialLikes + (liked ? 1 : 0);

  return (
    <button
      type="button"
      onClick={() => setLiked((previous) => !previous)}
      aria-pressed={liked}
      aria-label={liked ? "Quitar me gusta" : "Dar me gusta"}
      className="text-accent-soft flex cursor-pointer items-center gap-[7px] text-sm font-bold transition-transform hover:opacity-80"
      style={{ transform: liked ? "scale(1.08)" : "scale(1)" }}
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
      {count}
    </button>
  );
}
