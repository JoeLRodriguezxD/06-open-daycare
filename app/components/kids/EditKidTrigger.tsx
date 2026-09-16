"use client";

import { useState } from "react";
import { AddKidModal } from "./AddKidModal";
import type { AddKidValues, Classroom } from "@/lib/kid-form-validation";
import type { Kid } from "@/lib/kids-mock";

type EditKidTriggerProps = {
  kid: Kid;
};

const monthNumbers: Record<string, string> = {
  ene: "01",
  feb: "02",
  mar: "03",
  abr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  ago: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dic: "12",
};

const classroomValues: Record<string, Classroom> = {
  Soles: "SOLES",
  Lunas: "LUNAS",
  Estrellas: "ESTRELLAS",
};

function toBirthDateInput(displayDate: string): string {
  const parts = displayDate.trim().split(/\s+/);
  if (parts.length !== 3) {
    return "";
  }
  const day = parts[0].padStart(2, "0");
  const month = monthNumbers[parts[1].toLowerCase()] ?? "";
  const year = parts[2];
  if (month === "") {
    return "";
  }
  return `${day}/${month}/${year}`;
}

function toFormValues(kid: Kid): AddKidValues {
  return {
    fullName: kid.fullName,
    birthDate: toBirthDateInput(kid.birthDate),
    classroom: classroomValues[kid.classroom] ?? "",
    allergies: kid.allergyTag ?? "",
    medicalNotes: kid.allergyNotes ?? "",
  };
}

export function EditKidTrigger({ kid }: EditKidTriggerProps) {
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
        className="bg-surface border-border text-nav-inactive flex-none cursor-pointer rounded-xl border-[1.5px] px-4 py-[9px] text-sm font-bold"
      >
        Editar
      </button>
      {open ? (
        <AddKidModal
          onClose={handleClose}
          initialValues={toFormValues(kid)}
          title="Editar niño"
        />
      ) : null}
    </>
  );
}
