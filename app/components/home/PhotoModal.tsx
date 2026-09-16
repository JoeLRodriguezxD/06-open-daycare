"use client";

import { useEffect, useRef, useState } from "react";

export type ViewerPhoto = {
  url: string;
};

type PhotoModalProps = {
  photos: ViewerPhoto[];
  initialIndex?: number;
  title: string;
  metadata: string;
  caption: string;
  error?: string;
  onClose: () => void;
  onAddFiles: (files: FileList | File[]) => void;
};

const circleButton =
  "flex h-[42px] w-[42px] flex-none cursor-pointer items-center justify-center rounded-full text-white hover:opacity-80";

export function PhotoModal({
  photos,
  initialIndex = 0,
  title,
  metadata,
  caption,
  error = "",
  onClose,
  onAddFiles,
}: PhotoModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasPhotos = photos.length > 0;
  const safeIndex = hasPhotos
    ? Math.min(Math.max(currentIndex, 0), photos.length - 1)
    : 0;
  const currentPhoto = hasPhotos ? photos[safeIndex] : undefined;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
      if (event.key === "ArrowLeft" && photos.length > 1) {
        setCurrentIndex(
          (prev) => (prev - 1 + photos.length) % photos.length,
        );
      }
      if (event.key === "ArrowRight" && photos.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, photos.length]);

  function showPrevious() {
    if (photos.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  }

  function showNext() {
    if (photos.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Foto · ${title}`}
      className="fixed inset-0 z-[60] flex min-h-full flex-col"
      style={{ backgroundColor: "var(--photo-viewer-bg)" }}
    >
      <div className="flex items-center justify-between gap-3 px-[26px] py-[22px]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar visor de foto"
          className={circleButton}
          style={{ backgroundColor: "var(--photo-viewer-circle)" }}
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="min-w-0 flex-1 text-center">
          <div className="truncate font-display text-[16px] font-semibold text-white">
            {title}
          </div>
          {metadata ? (
            <div
              className="truncate text-[13px]"
              style={{ color: "var(--photo-viewer-muted)" }}
            >
              {metadata}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Descargar"
          title="Descargar"
          onClick={(event) => event.preventDefault()}
          className={circleButton}
          style={{ backgroundColor: "var(--photo-viewer-circle)" }}
        >
          <svg
            aria-hidden="true"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-[26px]">
        <div className="w-full max-w-[760px]">
          {currentPhoto ? (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);
                if (event.dataTransfer.files.length > 0) {
                  onAddFiles(event.dataTransfer.files);
                }
              }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px]"
              style={{
                backgroundColor: "var(--photo-viewer-zone)",
                outline: dragActive
                  ? "2px solid var(--accent-strong)"
                  : "1.5px solid transparent",
                outlineOffset: "3px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPhoto.url}
                alt={`Foto ${safeIndex + 1} de ${photos.length}`}
                className="h-full w-full object-contain"
              />
              {photos.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    aria-label="Foto anterior"
                    className={`${circleButton} absolute top-1/2 left-3 -translate-y-1/2`}
                    style={{
                      backgroundColor: "var(--photo-viewer-circle)",
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Foto siguiente"
                    className={`${circleButton} absolute top-1/2 right-3 -translate-y-1/2`}
                    style={{
                      backgroundColor: "var(--photo-viewer-circle)",
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);
                if (event.dataTransfer.files.length > 0) {
                  onAddFiles(event.dataTransfer.files);
                }
              }}
              aria-label="Agregar fotos"
              className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[20px] border-[1.5px] border-dashed"
              style={{
                background:
                  "linear-gradient(160deg, var(--photo-viewer-zone), var(--photo-viewer-bg))",
                borderColor: dragActive
                  ? "var(--accent-strong)"
                  : "var(--photo-viewer-border)",
                color: "var(--photo-viewer-faint)",
              }}
            >
              <svg
                aria-hidden="true"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
              </svg>
              <span className="px-6 text-center text-[15px]">
                Arrastrá o hacé clic para agregar fotos
              </span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            aria-label="Elegir fotos"
            className="hidden"
            onChange={(event) => {
              if (event.target.files && event.target.files.length > 0) {
                onAddFiles(event.target.files);
                event.target.value = "";
              }
            }}
          />
          {error ? (
            <p
              role="alert"
              className="mt-3 text-center text-[13.5px] font-bold"
              style={{ color: "var(--accent-strong)" }}
            >
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <div className="px-[26px] pt-6 pb-[34px] text-center">
        {caption ? (
          <p
            className="mx-auto my-0 max-w-[560px] text-[15px] leading-[1.55]"
            style={{ color: "var(--photo-viewer-caption)" }}
          >
            {caption}
          </p>
        ) : null}
      </div>
    </div>
  );
}
