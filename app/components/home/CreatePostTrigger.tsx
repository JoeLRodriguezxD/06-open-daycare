"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { CreatePostModal } from "./CreatePostModal";

type CreatePostTriggerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
};

export function CreatePostTrigger({
  children,
  className,
  style,
  ariaLabel,
}: CreatePostTriggerProps) {
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
        aria-label={ariaLabel}
        className={className}
        style={style}
      >
        {children}
      </button>
      {open
        ? createPortal(<CreatePostModal onClose={handleClose} />, document.body)
        : null}
    </>
  );
}
