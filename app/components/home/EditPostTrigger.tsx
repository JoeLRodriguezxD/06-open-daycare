"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { CreatePostModal, type CreatePostInitialValues } from "./CreatePostModal";
import type { FeedPost } from "@/lib/feed-mock";
import type { PostAudience, PostKind } from "@/lib/post-form-validation";

type EditPostTriggerProps = {
  post: FeedPost;
  className?: string;
};

function mapAudience(audience: string): {
  audiences: PostAudience[];
  wholeRoom: boolean;
} {
  const normalized = audience.toLowerCase();
  if (normalized.includes("toda la sala")) {
    return { audiences: ["MATEO", "SOFIA", "BENJAMIN"], wholeRoom: true };
  }
  const found: PostAudience[] = [];
  if (normalized.includes("mateo")) {
    found.push("MATEO");
  }
  if (normalized.includes("sofia") || normalized.includes("sofía")) {
    found.push("SOFIA");
  }
  if (normalized.includes("benjam")) {
    found.push("BENJAMIN");
  }
  return { audiences: found, wholeRoom: false };
}

export function mapFeedPostToInitial(post: FeedPost): CreatePostInitialValues {
  const { audiences, wholeRoom } = mapAudience(post.audience);
  return {
    audiences,
    wholeRoom,
    kind: post.type as PostKind,
    description: post.body,
  };
}

export function EditPostTrigger({ post, className }: EditPostTriggerProps) {
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-haspopup="dialog"
        className={className ?? "cursor-pointer text-sm font-extrabold text-edit"}
      >
        Editar
      </button>
      {open
        ? createPortal(
            <CreatePostModal
              onClose={handleClose}
              initialValues={mapFeedPostToInitial(post)}
            />,
            document.body,
          )
        : null}
    </>
  );
}
