type AllergyNotesProps = {
  notes: string;
};

export function AllergyNotes({ notes }: AllergyNotesProps) {
  return (
    <div className="bg-allergy-box-bg flex gap-[14px] rounded-2xl px-[18px] py-4">
      <div
        aria-hidden="true"
        className="bg-allergy-icon-bg flex h-10 w-10 flex-none items-center justify-center rounded-[11px]"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      </div>
      <div>
        <div className="text-allergy-title-fg mb-[2px] text-[15px] font-extrabold">
          Alergias y notas
        </div>
        <div className="text-allergy-body-fg text-[14.5px] leading-[1.5]">
          {notes}
        </div>
      </div>
    </div>
  );
}
