export type ParentStatus = "ACTIVE" | "PENDING";

export type LinkedParent = {
  id: string;
  name: string;
  relation: string;
  status: ParentStatus;
  initial: string;
  avatarBg: string;
  avatarFg: string;
};

export type Kid = {
  id: string;
  slug: string;
  fullName: string;
  shortName: string;
  initial: string;
  avatarBg: string;
  avatarFg: string;
  ageYears: number;
  ageLabel: string;
  classroom: string;
  birthDate: string;
  enrolledAt: string;
  allergyTag?: string;
  allergyNotes?: string;
  linkedParentsCount: number;
  linkedParents: LinkedParent[];
};

export const kids: Kid[] = [
  {
    id: "mateo-fernandez",
    slug: "mateo-fernandez",
    fullName: "Mateo Fernández",
    shortName: "Mateo",
    initial: "M",
    avatarBg: "var(--avatar-sky-bg)",
    avatarFg: "var(--avatar-sky-fg)",
    ageYears: 3,
    ageLabel: "3 años",
    classroom: "Soles",
    birthDate: "12 mar 2022",
    enrolledAt: "feb 2025",
    allergyTag: "MANÍ",
    allergyNotes:
      "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    linkedParentsCount: 2,
    linkedParents: [
      {
        id: "lucia-fernandez",
        name: "Lucía Fernández",
        relation: "Mamá",
        status: "ACTIVE",
        initial: "L",
        avatarBg: "var(--avatar-lavender-bg)",
        avatarFg: "#ffffff",
      },
      {
        id: "diego-fernandez",
        name: "Diego Fernández",
        relation: "Papá",
        status: "PENDING",
        initial: "D",
        avatarBg: "var(--avatar-parent-blue-bg)",
        avatarFg: "#ffffff",
      },
    ],
  },
  {
    id: "sofia-mendez",
    slug: "sofia-mendez",
    fullName: "Sofía Méndez",
    shortName: "Sofía",
    initial: "S",
    avatarBg: "var(--avatar-rose-bg)",
    avatarFg: "var(--avatar-rose-fg)",
    ageYears: 2,
    ageLabel: "2 años",
    classroom: "Soles",
    birthDate: "14 jun 2023",
    enrolledAt: "mar 2024",
    linkedParentsCount: 1,
    linkedParents: [
      {
        id: "valeria-mendez",
        name: "Valeria Méndez",
        relation: "Mamá",
        status: "ACTIVE",
        initial: "V",
        avatarBg: "var(--avatar-rose-bg)",
        avatarFg: "#ffffff",
      },
    ],
  },
  {
    id: "benjamin-ruiz",
    slug: "benjamin-ruiz",
    fullName: "Benjamín Ruiz",
    shortName: "Benjamín",
    initial: "B",
    avatarBg: "var(--avatar-mint-bg)",
    avatarFg: "var(--avatar-mint-fg)",
    ageYears: 3,
    ageLabel: "3 años",
    classroom: "Soles",
    birthDate: "05 oct 2022",
    enrolledAt: "ago 2024",
    linkedParentsCount: 2,
    linkedParents: [
      {
        id: "carolina-ruiz",
        name: "Carolina Ruiz",
        relation: "Mamá",
        status: "ACTIVE",
        initial: "C",
        avatarBg: "var(--avatar-mint-bg)",
        avatarFg: "#ffffff",
      },
      {
        id: "pablo-ruiz",
        name: "Pablo Ruiz",
        relation: "Papá",
        status: "ACTIVE",
        initial: "P",
        avatarBg: "var(--avatar-sand-bg)",
        avatarFg: "#ffffff",
      },
    ],
  },
  {
    id: "valentina-soto",
    slug: "valentina-soto",
    fullName: "Valentina Soto",
    shortName: "Valentina",
    initial: "V",
    avatarBg: "var(--avatar-sand-bg)",
    avatarFg: "var(--avatar-sand-fg)",
    ageYears: 2,
    ageLabel: "2 años",
    classroom: "Soles",
    birthDate: "22 ene 2024",
    enrolledAt: "feb 2025",
    linkedParentsCount: 0,
    linkedParents: [],
  },
  {
    id: "tomas-diaz",
    slug: "tomas-diaz",
    fullName: "Tomás Díaz",
    shortName: "Tomás",
    initial: "T",
    avatarBg: "var(--avatar-lavender-bg)",
    avatarFg: "var(--avatar-lavender-fg)",
    ageYears: 3,
    ageLabel: "3 años",
    classroom: "Soles",
    birthDate: "30 jul 2022",
    enrolledAt: "sep 2024",
    allergyTag: "LACTOSA",
    allergyNotes: "Intolerancia a la lactosa. Evitar leche y derivados.",
    linkedParentsCount: 1,
    linkedParents: [
      {
        id: "martin-diaz",
        name: "Martín Díaz",
        relation: "Papá",
        status: "ACTIVE",
        initial: "M",
        avatarBg: "var(--avatar-lavender-bg)",
        avatarFg: "#ffffff",
      },
    ],
  },
  {
    id: "emma-castro",
    slug: "emma-castro",
    fullName: "Emma Castro",
    shortName: "Emma",
    initial: "E",
    avatarBg: "var(--avatar-rose-bg)",
    avatarFg: "var(--avatar-rose-fg)",
    ageYears: 2,
    ageLabel: "2 años",
    classroom: "Soles",
    birthDate: "09 nov 2023",
    enrolledAt: "ene 2025",
    linkedParentsCount: 1,
    linkedParents: [
      {
        id: "paula-castro",
        name: "Paula Castro",
        relation: "Mamá",
        status: "ACTIVE",
        initial: "P",
        avatarBg: "var(--avatar-rose-bg)",
        avatarFg: "#ffffff",
      },
    ],
  },
  {
    id: "lucas-romero",
    slug: "lucas-romero",
    fullName: "Lucas Romero",
    shortName: "Lucas",
    initial: "L",
    avatarBg: "var(--avatar-sky-bg)",
    avatarFg: "var(--avatar-sky-fg)",
    ageYears: 3,
    ageLabel: "3 años",
    classroom: "Soles",
    birthDate: "17 abr 2022",
    enrolledAt: "oct 2024",
    linkedParentsCount: 1,
    linkedParents: [
      {
        id: "daniela-romero",
        name: "Daniela Romero",
        relation: "Mamá",
        status: "ACTIVE",
        initial: "D",
        avatarBg: "var(--avatar-sky-bg)",
        avatarFg: "#ffffff",
      },
    ],
  },
  {
    id: "olivia-vega",
    slug: "olivia-vega",
    fullName: "Olivia Vega",
    shortName: "Olivia",
    initial: "O",
    avatarBg: "var(--avatar-mint-bg)",
    avatarFg: "var(--avatar-mint-fg)",
    ageYears: 2,
    ageLabel: "2 años",
    classroom: "Soles",
    birthDate: "25 dic 2023",
    enrolledAt: "abr 2025",
    linkedParentsCount: 1,
    linkedParents: [
      {
        id: "camila-vega",
        name: "Camila Vega",
        relation: "Mamá",
        status: "ACTIVE",
        initial: "C",
        avatarBg: "var(--avatar-mint-bg)",
        avatarFg: "#ffffff",
      },
    ],
  },
];

export function getKidBySlug(slug: string): Kid | undefined {
  return kids.find((kid) => kid.slug === slug);
}
