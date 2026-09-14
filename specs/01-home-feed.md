# SPEC 01 — Home feed luz desde plantilla feed.dc.html

> **Status:** Approved
> **Depends on:** Ninguna
> **Date:** 2026-09-14
> **Objective:** Implementar la plantilla references/pantallas/feed.dc.html como home (/) en modo luz idéntico al mockup, con datos mockeados y sin autenticación ni base de datos.

## Scope

**In:**

- Home (/) con layout desktop del mockup: sidebar 248px sticky a altura completa + columna central max-width 760px con padding 34px 40px 80px.
- Sidebar: logo OpenDayCare / Sala Soles, botón Nueva publicación, nav Feed activo / Niños / Avisos / Mi cuenta, bloque usuario Caro Giménez Maestra · Soles.
- Header del feed: eyebrow GUARDERÍA · SALA SOLES, título Buenas, Caro, subtítulo 12 niños · martes 17 jun.
- Composer "Compartí un momento…" + divisor PUBLICADO HOY + los 3 posts exactos del mockup: LOGRO Mateo 14:20, ACTIVIDAD Mateo 09:40 con placeholder de foto, ANUNCIO general 07:50 con sus textos, horas, audiencias y contadores 3/5/8 y 1/2/0.
- Estilo luz idéntico: fondo #F6ECDF, superficies #FFFDF9, bordes #ECE0D0, texto #3F362E / secundario #94887B / muted #A89A8B, acentos #F2937A / #EE8164 / #D9583C / #E0654A, badges LOGRO #CFEBD8/#3E9B6C, ACTIVIDAD #C7E7F1/#2E89A6, ANUNCIO #CCD8F4/#4E72C8, Fredoka en títulos + Nunito en cuerpo, radios 12/14/18/20px y sombras suaves del mockup.
- Fuentes vía next/font/google con variables + tokens Tailwind v4 en app/globals.css.
- Datos mock tipados en lib/feed-mock.ts, sin fetch ni estado global. Todo el código interno en inglés; solo los textos visibles quedan en español.
- Estructura app/components/shared/ para comunes y app/components/home/ para propios del home, un componente por archivo en PascalCase con export nombrado.
- Likes locales con useState: valores iniciales 3/5/8, toggle +1/-1 con estado visual, sin persistencia.
- Responsive móvil: sidebar oculto debajo de 768px, topbar con hamburguesa que abre el mismo Sidebar en drawer overlay, cierre por X, overlay y Escape.
- Enlaces del mockup conservados como href futuros sin crear archivos de ruta en este spec.

**Out of scope (for future specs):**

- Autenticación, roles, sesión y cerrar sesión funcional.
- Base de datos, API o fetch real.
- Páginas /ninos, /avisos, /mi-cuenta, /crear-publicacion, /detalle-publicacion, /foto.
- Crear publicación, editar, comentar, ver detalle o foto.
- Toggle light/dark funcional.
- Persistencia de likes entre recargas.
- Modo oscuro activo o nuevo lenguaje visual.

## Data model

Esta feature no usa DB. Solo un mock tipado en `lib/feed-mock.ts`. Todo el código interno está en inglés siguiendo las reglas de código limpio; los textos visibles siguen en español vía mapa de etiquetas:

```ts
// lib/feed-mock.ts
type PostType = "ACHIEVEMENT" | "ACTIVITY" | "ANNOUNCEMENT";

type FeedPost = {
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

const POST_TYPE_LABELS: Record<PostType, string> = {
  ACHIEVEMENT: "LOGRO",
  ACTIVITY: "ACTIVIDAD",
  ANNOUNCEMENT: "ANUNCIO",
};

const currentUser = { name: "Caro Giménez", role: "Maestra · Soles", initial: "C" };

const feedHeader = {
  eyebrow: "GUARDERÍA · SALA SOLES",
  title: "Buenas, Caro",
  subtitle: "12 niños · martes 17 jun",
};

const feedPosts: FeedPost[] = [
  { id: "achievement-potty-training", type: "ACHIEVEMENT", authorName: "Mateo", likes: 3, comments: 1, hasPhotoPlaceholder: false },
  { id: "activity-tempera-painting", type: "ACTIVITY", authorName: "Mateo", likes: 5, comments: 2, hasPhotoPlaceholder: true },
  { id: "announcement-park-trip", type: "ANNOUNCEMENT", authorName: "Anuncio general", likes: 8, comments: 0, hasPhotoPlaceholder: false },
];
```

Convenciones:

- Código en inglés: tipos, variables, funciones, props, nombres de archivo y `PostType` usan `ACHIEVEMENT`, `ACTIVITY`, `ANNOUNCEMENT` e ids como `achievement-potty-training`. Prohibidos identificadores en español como `LOGRO` o `logro-orinal`.
- UI en español: `TypeBadge` renderiza `POST_TYPE_LABELS[type]` para mostrar LOGRO, ACTIVIDAD, ANUNCIO; `body`, `audience`, `feedHeader` y `currentUser` conservan los textos exactos del mockup.
- Los textos completos, horas y audiencias salen del mockup y viven en `feedPosts`.
- Los colores y radios salen de tokens CSS en `app/globals.css`, no hardcodeados por componente.

## Implementation plan

1. Actualizar `app/layout.tsx`: lang es, metadata OpenDayCare, carga Fredoka + Nunito vía next/font/google.
2. Actualizar `app/globals.css`: tokens light #F6ECDF / #FFFDF9 / #ECE0D0 y acentos, forzar light eliminando el override oscuro activo, conservar estructura de variables para futuro dark. Manual test: `npm run dev` muestra fondo crema sin cambios en OS dark.
3. Crear `lib/feed-mock.ts` con `PostType` en inglés (`ACHIEVEMENT` | `ACTIVITY` | `ANNOUNCEMENT`), `POST_TYPE_LABELS` para la UI en español, `FeedPost`, `currentUser`, `feedHeader` y los 3 posts exactos del mockup.
4. Crear `app/components/shared/TypeBadge.tsx` y `app/components/shared/Avatar.tsx` como server components reutilizables.
5. Crear `app/components/home/Sidebar.tsx`, `FeedHeader.tsx`, `Composer.tsx` y `PostCard.tsx` como server components con el JSX del mockup.
6. Crear `app/components/home/LikeButton.tsx` client con useState para toggle +1/-1 sin persistencia. Manual test: clic suma y resta, recarga vuelve a 3/5/8.
7. Crear `app/components/home/MobileNav.tsx` client con hamburguesa y drawer que reutiliza `Sidebar`, cierre por X, overlay y Escape.
8. Componer `app/page.tsx` con Sidebar + main de 760px + header + composer + divisor PUBLICADO HOY + lista de PostCards. Manual test: comparar lado a lado con `references/pantallas/feed.dc.html` abierto en navegador.

## Acceptance criteria

- [ ] `npm run dev` muestra (/) con fondo #F6ECDF, sidebar 248px y columna 760px como el mockup.
- [ ] Se ven header, composer, divisor PUBLICADO HOY y exactamente los 3 posts con textos, horas, audiencias y badges del mockup en español (LOGRO, ACTIVIDAD, ANUNCIO).
- [ ] El código usa solo identificadores en inglés (`ACHIEVEMENT`, `ACTIVITY`, `ANNOUNCEMENT`, `achievement-potty-training`); no hay tipos ni variables en español.
- [ ] Tipografías Fredoka y Nunito cargadas vía next/font, sin `<link>` Google Fonts manual.
- [ ] Con el SO en modo oscuro la página sigue mostrando estilo luz.
- [ ] Clic en like suma 1 y segundo clic resta 1; al recargar vuelven a 3/5/8.
- [ ] En viewport menor a 768px el sidebar está oculto y la hamburguesa abre y cierra el drawer.
- [ ] Existe `app/components/shared/` con comunes y `app/components/home/` con propios del home en PascalCase.
- [ ] `npm run lint` pasa sin errores.
- [ ] `npx tsc --noEmit` pasa sin errores.
- [ ] `npm run build` pasa sin errores.

## Decisions

- **Sí:** mock en `lib/feed-mock.ts`. Reutilizable por próximos specs sin tocar `page.tsx`.
- **Sí:** código interno 100% en inglés con UI en español vía `POST_TYPE_LABELS`. Cumple reglas de código limpio del repo sin cambiar lo visual.
- **No:** identificadores en español (`LOGRO`, `ACTIVIDAD`, `logro-orinal`). Se descartan aunque la UI los muestre.
- **No:** JSON en `public/` o fetch. Sobrecarga sin backend.
- **Sí:** `app/components/` en inglés dentro de `app/` con `shared` + `home`. Respeta convención Next.js y el pedido de subcarpetas por contenido.
- **No:** `componentes/` en español en raíz. Rompe la convención y el alias `@/*`.
- **Sí:** subcarpeta `shared` en inglés. Evita el typo `shares` y confusión futura.
- **No:** `shares` o `comunes`. Menos estándar.
- **Sí:** convención `shared` + `home`, futuras páginas agregan su carpeta. Deja escalado claro para `ninos` y `avisos`.
- **Sí:** un componente por archivo en `PascalCase` con export nombrado. Legible y compatible con el router.
- **Sí:** `next/font/google` + Tailwind v4. Patrón Next.js 16, evita CLS del `<link>` del mockup.
- **No:** copiar `<link>` del mockup. Peor rendimiento.
- **Sí:** forzar light y quitar dark activo, conservando estructura de variables. Garantiza estilo luz idéntico y deja base para futuro toggle.
- **No:** implementar toggle dark ahora. Va en otro spec.
- **Sí:** `href` futuros sin crear archivos. Más rápido; el 404 temporal es aceptado explícitamente.
- **No:** crear páginas placeholder mínimas. Descartado por el usuario en la segunda ronda.
- **Sí:** likes locales con `useState`. Da vida mínima sin persistencia ni backend.
- **No:** composer, editar, comentarios, detalle o foto funcionales. Son specs propios.

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Links sin archivo dan 404 al clickear | Aceptado en alcance; documentado como fuera de alcance |
| next/font/google sin red en build falla | Fallback a system fonts; el build local lo verifica |
| Drawer móvil diverge del mockup desktop | Drawer reutiliza el mismo Sidebar sin inventar UI |

## What is **not** in this spec

- Autenticación.
- Base de datos.
- Rutas /ninos, /avisos, /mi-cuenta, /crear-publicacion, /detalle-publicacion, /foto.
- Toggle light/dark.
- Persistencia de likes.
- Modo oscuro activo.

Cada uno de esos, si llega, va en su propio spec.
