"use client";

import { useState } from "react";
import { AddKidModal } from "./AddKidModal";

export function AddKidTrigger() {
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
        className="flex cursor-pointer items-center gap-2 rounded-[14px] px-[18px] py-[11px] text-[14.5px] font-extrabold text-white"
        style={{
          background:
            "linear-gradient(180deg, #f4977e, var(--accent-strong))",
          boxShadow: "0 8px 18px -8px rgba(238,129,100,.7)",
        }}
      >
        <svg
          aria-hidden="true"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Agregar niño
      </button>
      {open ? <AddKidModal onClose={handleClose} /> : null}
    </>
  );
}
