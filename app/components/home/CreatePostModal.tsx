"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PhotoModal } from "./PhotoModal";
import {
  MAX_POST_PHOTOS,
  POST_AUDIENCE_LABELS,
  POST_KIND_LABELS,
  validateCreatePost,
  type CreatePostErrors,
  type PostAudience,
  type PostKind,
} from "@/lib/post-form-validation";
import { kids, type Kid } from "@/lib/kids-mock";

export type CreatePostInitialValues = {
  audiences: PostAudience[];
  wholeRoom: boolean;
  kind: PostKind | "";
  description: string;
};

type CreatePostModalProps = {
  onClose: () => void;
  initialValues?: CreatePostInitialValues;
  title?: string;
};

export type PhotoPreview = {
  file: File;
  url: string;
};

const emptyInitialValues: CreatePostInitialValues = {
  audiences: [],
  wholeRoom: false,
  kind: "",
  description: "",
};

const audienceOptions: PostAudience[] = [
  "MATEO",
  "SOFIA",
  "BENJAMIN",
  "VALENTINA",
  "TOMAS",
  "EMMA",
  "LUCAS",
  "OLIVIA",
];

function normalizeShortName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase();
}

const kidByAudience: Record<PostAudience, Kid | undefined> =
  Object.fromEntries(
    audienceOptions.map((audience) => [
      audience,
      kids.find((kid) => normalizeShortName(kid.shortName) === audience),
    ]),
  ) as Record<PostAudience, Kid | undefined>;

function getAudienceKid(audience: PostAudience): Kid | undefined {
  return kidByAudience[audience];
}

function getAudienceLabel(audience: PostAudience): string {
  return kidByAudience[audience]?.shortName ?? POST_AUDIENCE_LABELS[audience];
}

const kindOptions: PostKind[] = [
  "MEAL",
  "NAP",
  "ACTIVITY",
  "ACHIEVEMENT",
  "MOOD",
  "PHOTO",
  "ANNOUNCEMENT",
];

const kindStyles: Record<PostKind, { bg: string; fg: string }> = {
  MEAL: { bg: "var(--post-kind-meal-bg)", fg: "var(--post-kind-meal-fg)" },
  NAP: { bg: "var(--post-kind-nap-bg)", fg: "var(--post-kind-nap-fg)" },
  ACTIVITY: {
    bg: "var(--post-kind-activity-bg)",
    fg: "var(--post-kind-activity-fg)",
  },
  ACHIEVEMENT: {
    bg: "var(--post-kind-achievement-bg)",
    fg: "var(--post-kind-achievement-fg)",
  },
  MOOD: { bg: "var(--post-kind-mood-bg)", fg: "var(--post-kind-mood-fg)" },
  PHOTO: { bg: "var(--post-kind-photo-bg)", fg: "var(--post-kind-photo-fg)" },
  ANNOUNCEMENT: {
    bg: "var(--post-kind-announcement-bg)",
    fg: "var(--post-kind-announcement-fg)",
  },
};

const sectionLabel =
  "mb-[10px] block text-xs font-extrabold tracking-[0.7px] text-secondary";

const errorBase = "mt-[6px] text-[13.5px] font-bold text-auth-error";

function revokePreviews(photos: PhotoPreview[]) {
  for (const photo of photos) {
    URL.revokeObjectURL(photo.url);
  }
}

export function CreatePostModal({
  onClose,
  initialValues = emptyInitialValues,
  title = "Nueva publicación",
}: CreatePostModalProps) {
  const [audiences, setAudiences] = useState<PostAudience[]>(
    initialValues.audiences,
  );
  const [wholeRoom, setWholeRoom] = useState(initialValues.wholeRoom);
  const [kind, setKind] = useState<PostKind | "">(initialValues.kind);
  const [description, setDescription] = useState(initialValues.description);
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [errors, setErrors] = useState<CreatePostErrors>({});
  const [dragActive, setDragActive] = useState(false);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !photoViewerOpen) {
        event.stopPropagation();
        handleClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoViewerOpen]);

  function handleClose() {
    revokePreviews(photos);
    onClose();
  }

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function toggleAudience(audience: PostAudience) {
    if (audiences.includes(audience)) {
      const next = audiences.filter((item) => item !== audience);
      setAudiences(next);
      setWholeRoom(false);
    } else {
      const next = [...audiences, audience];
      setAudiences(next);
      setWholeRoom(next.length === audienceOptions.length);
    }
  }

  function toggleWholeRoom() {
    if (wholeRoom) {
      setAudiences([]);
      setWholeRoom(false);
    } else {
      setAudiences([...audienceOptions]);
      setWholeRoom(true);
    }
  }

  function addFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList);
    const images = incoming.filter((file) => file.type.startsWith("image/"));
    if (images.length !== incoming.length) {
      setPhotoError("Solo imágenes, hasta 4 fotos");
    }
    const roomLeft = MAX_POST_PHOTOS - photos.length;
    if (roomLeft <= 0) {
      setPhotoError("Solo imágenes, hasta 4 fotos");
      return;
    }
    const accepted = images.slice(0, roomLeft);
    if (images.length > roomLeft) {
      setPhotoError("Solo imágenes, hasta 4 fotos");
    } else if (images.length === incoming.length) {
      setPhotoError("");
    }
    if (accepted.length === 0) {
      return;
    }
    const previews = accepted.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...previews]);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      const target = prev[index];
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      const next = prev.filter((_, itemIndex) => itemIndex !== index);
      if (next.length <= MAX_POST_PHOTOS) {
        setPhotoError((current) =>
          current === "Solo imágenes, hasta 4 fotos" &&
          next.length < MAX_POST_PHOTOS
            ? ""
            : current,
        );
      }
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateCreatePost({
      audiences,
      wholeRoom,
      kind,
      description,
      photoCount: photos.length,
      photoError,
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      revokePreviews(photos);
      onClose();
    }
  }

  function openPhotoViewer(index: number) {
    setPhotoViewerIndex(index);
    setPhotoViewerOpen(true);
  }

  function closePhotoViewer() {
    setPhotoViewerOpen(false);
  }

  const photoViewerTitle =
    audiences.length === 1
      ? getAudienceLabel(audiences[0])
      : audiences.length > 1 || wholeRoom
        ? "Toda la sala"
        : title;

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-6 py-10"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-[580px] overflow-hidden rounded-[24px] border border-border bg-auth-bg shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]"
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex items-center justify-between gap-3 border-b border-border px-[26px] py-5">
            <button
              type="button"
              onClick={handleClose}
              className="flex-none cursor-pointer text-[15px] font-bold text-secondary"
            >
              Cancelar
            </button>
            <span className="min-w-0 flex-1 truncate text-center font-display text-[18px] font-semibold text-foreground">
              {title}
            </span>
            <div className="flex flex-none items-center gap-2">
              <button
                type="submit"
                className="cursor-pointer text-[15px] font-extrabold text-accent-deep"
              >
                Publicar
              </button>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Cerrar"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-secondary hover:opacity-70"
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-[26px] py-6">
            <span className={sectionLabel}>PARA</span>
            <div className="mb-[22px] flex flex-wrap gap-[9px]">
              {audienceOptions.map((option) => {
                const selected = audiences.includes(option);
                const kid = getAudienceKid(option);
                const label = kid?.shortName ?? POST_AUDIENCE_LABELS[option];
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleAudience(option)}
                    aria-pressed={selected}
                    className="flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] py-[6px] pr-[14px] pl-[6px] text-sm font-bold"
                    style={{
                      borderColor: selected
                        ? "var(--foreground)"
                        : "var(--border)",
                      backgroundColor: selected
                        ? "var(--foreground)"
                        : "var(--surface)",
                      color: selected ? "#fff" : "var(--nav-inactive)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-[26px] w-[26px] items-center justify-center rounded-full font-display text-[13px] font-semibold"
                      style={{
                        backgroundColor:
                          kid?.avatarBg ?? "var(--avatar-sky-bg)",
                        color: kid?.avatarFg ?? "var(--avatar-sky-fg)",
                      }}
                    >
                      {kid?.initial ?? label.charAt(0)}
                    </span>
                    {label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={toggleWholeRoom}
                aria-pressed={wholeRoom}
                className="cursor-pointer rounded-full border-[1.5px] px-4 py-[6px] text-sm font-bold"
                style={{
                  borderColor: wholeRoom
                    ? "var(--foreground)"
                    : "var(--border)",
                  backgroundColor: wholeRoom
                    ? "var(--foreground)"
                    : "var(--surface)",
                  color: wholeRoom ? "#fff" : "var(--nav-inactive)",
                }}
              >
                Toda la sala
              </button>
            </div>
            {errors.audiences ? (
              <p role="alert" className={`${errorBase} mt-[-14px] mb-[22px]`}>
                {errors.audiences}
              </p>
            ) : null}

            <span className={sectionLabel}>TIPO</span>
            <div className="mb-[22px] flex flex-wrap gap-[9px]">
              {kindOptions.map((option) => {
                const selected = kind === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setKind(option)}
                    aria-pressed={selected}
                    className="cursor-pointer rounded-full border-none px-4 py-2 text-[13.5px] font-extrabold"
                    style={{
                      backgroundColor: kindStyles[option].bg,
                      color: kindStyles[option].fg,
                      boxShadow: selected
                        ? "0 0 0 2px var(--foreground)"
                        : "none",
                    }}
                  >
                    {POST_KIND_LABELS[option]}
                  </button>
                );
              })}
            </div>
            {errors.kind ? (
              <p role="alert" className={`${errorBase} mt-[-14px] mb-[22px]`}>
                {errors.kind}
              </p>
            ) : null}

            <label htmlFor="create-post-description" className={sectionLabel}>
              DESCRIPCIÓN
            </label>
            <textarea
              id="create-post-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Contá cómo le fue hoy…"
              rows={4}
              className="mb-[22px] min-h-[120px] w-full resize-y rounded-[14px] border-[1.5px] bg-white px-4 py-[14px] text-[15px] leading-[1.5] outline-none placeholder:text-auth-placeholder"
              style={{
                borderColor: errors.description
                  ? "var(--auth-error)"
                  : "var(--auth-input-border)",
                color: "var(--foreground)",
                marginBottom: errors.description ? "0" : "22px",
              }}
            />
            {errors.description ? (
              <p role="alert" className={`${errorBase} mb-[22px]`}>
                {errors.description}
              </p>
            ) : null}

            <span className={sectionLabel}>FOTOS</span>
            <div className="flex flex-wrap gap-3">
              {photos.map((photo, index) => (
                <div key={photo.url} className="relative h-24 w-24 flex-none">
                  <button
                    type="button"
                    onClick={() => openPhotoViewer(index)}
                    aria-label={`Ver foto ${index + 1}`}
                    aria-haspopup="dialog"
                    className="h-full w-full cursor-pointer overflow-hidden rounded-[14px] border border-border bg-photo-bg"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={`Foto ${index + 1} agregada`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    aria-label={`Quitar foto ${index + 1}`}
                    className="absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-foreground text-white shadow"
                  >
                    <svg
                      aria-hidden="true"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  openPhotoViewer(Math.max(photos.length - 1, 0));
                  fileInputRef.current?.click();
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                  if (event.dataTransfer.files.length > 0) {
                    addFiles(event.dataTransfer.files);
                  }
                }}
                aria-label="Agregar fotos"
                className="flex h-24 w-24 flex-none cursor-pointer flex-col items-center justify-center gap-[6px] rounded-[14px] border-[1.5px] border-dashed bg-photo-bg text-photo-fg"
                style={{
                  borderColor: dragActive
                    ? "var(--accent-deep)"
                    : "var(--photo-border)",
                }}
              >
                <svg
                  aria-hidden="true"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C5503A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="text-xs">Agregar</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              aria-label="Elegir fotos"
              className="hidden"
              onChange={(event) => {
                if (event.target.files && event.target.files.length > 0) {
                  addFiles(event.target.files);
                  event.target.value = "";
                }
              }}
            />
            {errors.photos || photoError ? (
              <p role="alert" className={`${errorBase} mt-[10px]`}>
                {errors.photos ?? photoError}
              </p>
            ) : null}
          </div>
        </form>
      </div>
      {photoViewerOpen
        ? createPortal(
            <PhotoModal
              photos={photos}
              initialIndex={photoViewerIndex}
              title={photoViewerTitle}
              metadata="Sala Soles"
              caption={description}
              error={photoError}
              onClose={closePhotoViewer}
              onAddFiles={addFiles}
            />,
            document.body,
          )
        : null}
    </div>
  );
}
