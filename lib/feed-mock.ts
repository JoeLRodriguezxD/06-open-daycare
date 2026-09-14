export type PostType = "ACHIEVEMENT" | "ACTIVITY" | "ANNOUNCEMENT";

export type FeedPost = {
  id: string;
  type: PostType;
  authorName: string;
  authorInitial: string;
  time: string;
  publishedBy: string;
  audience: string;
  body: string;
  likes: number;
  comments: number;
  hasPhotoPlaceholder: boolean;
  photoLabel?: string;
};

export const POST_TYPE_LABELS: Record<PostType, string> = {
  ACHIEVEMENT: "LOGRO",
  ACTIVITY: "ACTIVIDAD",
  ANNOUNCEMENT: "ANUNCIO",
};

export const currentUser = {
  name: "Caro Giménez",
  role: "Maestra · Soles",
  initial: "C",
};

export const feedHeader = {
  eyebrow: "GUARDERÍA · SALA SOLES",
  title: "Buenas, Caro",
  subtitle: "12 niños · martes 17 jun",
};

export const feedPosts: FeedPost[] = [
  {
    id: "achievement-potty-training",
    type: "ACHIEVEMENT",
    authorName: "Mateo",
    authorInitial: "M",
    time: "14:20",
    publishedBy: "publicado por vos",
    audience: "familia de Mateo",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
    hasPhotoPlaceholder: false,
  },
  {
    id: "activity-tempera-painting",
    type: "ACTIVITY",
    authorName: "Mateo",
    authorInitial: "M",
    time: "09:40",
    publishedBy: "publicado por vos",
    audience: "familia de Mateo",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    likes: 5,
    comments: 2,
    hasPhotoPlaceholder: true,
    photoLabel: "Foto · pintando con témperas",
  },
  {
    id: "announcement-park-trip",
    type: "ANNOUNCEMENT",
    authorName: "Anuncio general",
    authorInitial: "",
    time: "07:50",
    publishedBy: "publicado por vos",
    audience: "toda la sala",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
    hasPhotoPlaceholder: false,
  },
];
