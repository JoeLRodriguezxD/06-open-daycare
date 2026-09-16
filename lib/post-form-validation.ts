export type PostAudience = "MATEO" | "SOFIA" | "BENJAMIN";

export type PostKind =
  | "MEAL"
  | "NAP"
  | "ACTIVITY"
  | "ACHIEVEMENT"
  | "MOOD"
  | "PHOTO"
  | "ANNOUNCEMENT";

export type CreatePostValues = {
  audiences: PostAudience[];
  wholeRoom: boolean;
  kind: PostKind | "";
  description: string;
  photoCount: number;
  photoError: string | "";
};

export type CreatePostErrors = Partial<
  Record<"audiences" | "kind" | "description" | "photos", string>
>;

export const POST_AUDIENCE_LABELS: Record<PostAudience, string> = {
  MATEO: "Mateo",
  SOFIA: "Sofía",
  BENJAMIN: "Benjamín",
};

export const POST_KIND_LABELS: Record<PostKind, string> = {
  MEAL: "Comida",
  NAP: "Siesta",
  ACTIVITY: "Actividad",
  ACHIEVEMENT: "Logro",
  MOOD: "Ánimo",
  PHOTO: "Foto",
  ANNOUNCEMENT: "Anuncio",
};

export const WHOLE_ROOM_LABEL = "Toda la sala";

export const MAX_POST_PHOTOS = 4;

export function validateCreatePost(values: CreatePostValues): CreatePostErrors {
  const errors: CreatePostErrors = {};

  if (values.audiences.length === 0 && !values.wholeRoom) {
    errors.audiences = "Elegí al menos un destinatario";
  }

  if (values.kind === "") {
    errors.kind = "Elegí un tipo";
  }

  if (values.description.trim() === "") {
    errors.description = "Contá cómo le fue hoy";
  }

  if (values.photoError !== "") {
    errors.photos = values.photoError;
  } else if (values.photoCount > MAX_POST_PHOTOS) {
    errors.photos = "Solo imágenes, hasta 4 fotos";
  }

  return errors;
}
