"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { LinkParentModal } from "./LinkParentModal";
import type { Kid } from "@/lib/kids-mock";

type LinkParentTriggerProps = {
  kid: Kid;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function LinkParentTrigger({
  kid,
  children,
  className,
  ariaLabel,
}: LinkParentTriggerProps) {
  const [open, setOpen] = useState(false);

  function handleOpen(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
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
      >
        {children}
      </button>
      {open
        ? createPortal(
            <LinkParentModal
              kidFullName={kid.fullName}
              kidShortName={kid.shortName}
              onClose={handleClose}
            />,
            document.body,
          )
        : null}
    </>
  );
}
