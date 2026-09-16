# SPEC 07 — Modal crear publicación con fotos y visor foto con dropzone

> **Status:** Approved
> **Depends on:** SPEC 01
> **Date:** 2026-09-16
> **Objective:** Mostrar el formulario de crear-publicacion.dc.html como modal overlay desde el feed con PARA múltiple, TIPO único y descripción obligatorios, y el visor de foto.dc.html como segundo modal apilado cuya zona dashed central es dropzone de hasta 4 imágenes, con Editar precargado y Publicar que solo cierra sin persistencia.

## Scope

**In:**

- Componente client `app/components/home/CreatePostModal.tsx`: overlay con tarjeta exacta del mockup (max-width 580px, header Cancelar / Nueva publicación / Publicar, secciones PARA, TIPO, DESCRIPCIÓN, FOTOS).
- Apertura sin cambiar URL vía portal a `document.body` desde el botón `Nueva publicación` de `Sidebar.tsx` y desde el `Composer.tsx` (`Compartí un momento…`), manteniendo ambas pages como server mediante triggers client.
- PARA múltiple sin selección inicial: chips Mateo / Sofía / Benjamín + `Toda la sala` que marca los 3; desmarcar un niño desmarca `Toda la sala`; obligatorio al menos un destinatario.
- TIPO único sin selección inicial: 7 pills Comida / Siesta / Actividad / Logro / Ánimo / Foto / Anuncio con los colores del mockup; obligatorio elegir uno.
- DESCRIPCIÓN con placeholder `Contá cómo le fue hoy…`, obligatoria no vacía (trim).
- FOTOS con thumbnail 96px + tile `Agregar` dashed: clic abre file picker (`accept="image/*"`, múltiple); drag & drop sobre el tile y sobre la zona dashed de `PhotoModal`; `dragover` resalta el borde; previews locales con `objectURL` y X para quitar; máximo 4 y solo imágenes con error en español bajo FOTOS.
- Componente client `app/components/home/PhotoModal.tsx`: fullscreen oscuro idéntico a `foto.dc.html` (X, título + metadata, botón Descargar decorativo, zona central dashed, caption); vacío muestra icono + `Arrastrá o hacé clic para agregar fotos`; con fotos muestra una grande con anterior/siguiente + caption; apilado encima de Crear vía portal, al cerrar vuelve a Crear con fotos conservadas.
- Validación local al Publicar con errores en español bajo cada zona: PARA, TIPO y descripción; fotos ya validadas al agregar; bloquea sin cerrar.
- Publicar válido solo cierra el modal y queda en origen, sin persistencia ni backend.
- Editar en cada `PostCard` abre el mismo modal precargado desde `feed-mock.ts` (PARA desde `audience`, TIPO desde `PostType`, descripción desde `body`, fotos vacío); misma validación y mismo cierre sin persistencia.
- Cierres sin guardar vía Cancelar, X, clic en overlay y Escape, sin errores persistentes.
- Estilo luz idéntico con tokens en `app/globals.css`, Fredoka + Nunito vía `next/font`.
- Código interno en inglés; solo textos visibles en español.

**Out of scope (for future specs):**

- Backend, base de datos, API o subida real de archivos.
- Persistencia del post nuevo o aparición en el feed (ni en memoria).
- Página `/crear-publicacion` o `/foto` como rutas independientes.
- Apertura del visor desde el placeholder de foto del feed o desde `detalle-publicacion`.
- Descarga real de fotos.
- Editar con precarga de archivos o eliminar publicaciones.
- Comentarios, detalle de publicación, resto de rutas futuras.

## Data model

Esta feature no usa DB. Reutiliza `FeedPost` de SPEC 01 y agrega tipos puros en `lib/post-form-validation.ts`:

```ts
// lib/post-form-validation.ts
type PostAudience = "MATEO" | "SOFIA" | "BENJAMIN";
type PostKind = "MEAL" | "NAP" | "ACTIVITY" | "ACHIEVEMENT" | "MOOD" | "PHOTO" | "ANNOUNCEMENT";
type CreatePostValues = { audiences: PostAudience[]; wholeRoom: boolean; kind: PostKind | ""; description: string; photoCount: number; photoError: string | "" };
type CreatePostErrors = Partial<Record<"audiences" | "kind" | "description" | "photos", string>>;

function validateCreatePost(values: CreatePostValues): CreatePostErrors;
```

Convenciones:

- Código en inglés: `audiences`, `wholeRoom`, `kind`, `validateCreatePost`. Prohibidos identificadores en español.
- UI en español: labels del mockup y errores como `Elegí al menos un destinatario`, `Elegí un tipo`, `Contá cómo le fue hoy`, `Solo imágenes, hasta 4 fotos`.
- Los `File` y sus `objectURL` de preview viven solo en estado de los modales; se revocan al quitar/cerrar; no se persisten.
- Mapeo Editar: `audience` (`familia de Mateo` → `MATEO`, `toda la sala` → `wholeRoom` + 3) y `PostType` (`ACHIEVEMENT` → `ACHIEVEMENT`, `ACTIVITY` → `ACTIVITY`, `ANNOUNCEMENT` → `ANNOUNCEMENT`) de `lib/feed-mock.ts`.
- Colores y radios desde tokens CSS en `app/globals.css`.

## Implementation plan

1. Crear `lib/post-form-validation.ts` con `PostAudience`, `PostKind`, labels ES y `validateCreatePost` puro. Manual test: vacío devuelve 3 errores; `wholeRoom` cuenta como audiencia; descripción con solo espacios falla.
2. Crear `app/components/home/CreatePostModal.tsx` client con `useState`, overlay + tarjeta 580px del mockup, chips PARA múltiples, pills TIPO únicas, textarea, zona FOTOS con previews y validación al Publicar. Manual test: render aislado idéntico a `crear-publicacion.dc.html`.
3. Crear `app/components/home/PhotoModal.tsx` client oscuro fullscreen de `foto.dc.html` con dropzone central (click + drop + highlight), estado vacío vs carrusel con anterior/siguiente y Descargar decorativo. Manual test: vacío muestra ayuda; con fotos navega.
4. Crear triggers client reutilizables (crear desde Sidebar/Composer, editar desde `PostCard` con precarga) que abren los modales en portal a `body` manteniendo pages server. Manual test: `/` sin cambios hasta pulsar.
5. Cablear en `Sidebar.tsx` y `Composer.tsx` sustituyendo `href="/crear-publicacion"` y en `PostCard.tsx` sustituyendo Editar, con `PhotoModal` apilado sobre `CreatePostModal` al pulsar Agregar. Comparar lado a lado con ambos mockups.
6. Validar con Playwright (artefactos SOLO en `.playwright-mcp/`) sobre `npm run dev`: snapshot + screenshot de ambos modales vs mockups; validación triple; fotos máx 4 + error; drag highlight; carrusel apilado; Editar precarga; Publicar cierra sin persistencia; cierres; resize <768px sin scroll horizontal.

## Acceptance criteria

- [ ] Clic en `Nueva publicación` del Sidebar abre Crear sin cambiar la URL.
- [ ] Clic en `Compartí un momento…` del Composer abre el mismo Crear sin cambiar la URL.
- [ ] Crear es idéntico a `references/pantallas/crear-publicacion.dc.html` (tarjeta 580px, header, 4 secciones).
- [ ] PARA inicia vacío y admite selección múltiple; `Toda la sala` marca los 3 y desmarcar un niño la desmarca.
- [ ] TIPO inicia sin selección y solo admite una activa a la vez.
- [ ] Publicar sin PARA, sin TIPO o con descripción vacía muestra sus errores en español y no cierra.
- [ ] Clic en Agregar abre el picker de solo imágenes; elegir no-imagen muestra error bajo FOTOS y no se agrega.
- [ ] Arrastrar imágenes sobre el tile o la zona dashed las agrega con preview y `dragover` resalta el borde.
- [ ] Más de 4 fotos bloquea con error en español y no se agregan las excedentes; la X quita cada preview.
- [ ] Foto es idéntico a `references/pantallas/foto.dc.html` y vacío muestra ayuda de dropzone en la zona dashed.
- [ ] Con fotos, Foto muestra carrusel con anterior/siguiente y Descargar no navega ni descarga.
- [ ] Foto abre apilado sobre Crear y al cerrarlo vuelve a Crear con todo conservado.
- [ ] Editar en un post abre Crear precargado con su PARA, TIPO y descripción.
- [ ] Publicar válido cierra y deja en origen.
- [ ] Recargar tras Publicar no muestra ningún post nuevo.
- [ ] Cancelar, X, overlay y Escape cierran sin guardar ni errores persistentes.
- [ ] En viewport menor a 768px ambos modales se usan sin scroll horizontal.
- [ ] Código solo con identificadores en inglés.
- [ ] `npm run lint` pasa sin errores.
- [ ] `npx tsc --noEmit` pasa sin errores.
- [ ] `npm run build` pasa sin errores.

## Decisions

- **Sí:** modal overlay sin URL como SPEC 04/05/06. Pedido explícito en preguntas.
- **No:** ruta `/crear-publicacion` como página. Se descarta por lo anterior.
- **Sí:** doble trigger Sidebar + Composer. Pedido explícito.
- **Sí:** Foto como visor fiel + dropzone central. La zona dashed de `foto.dc.html` es la dropzone pedida; el tile Agregar comparte la misma lógica con previews.
- **No:** modal Agregar-foto intermedio separado. Se descarta; un solo Foto apilado cubre visor y subida.
- **No:** solo visor sin drag & drop. Se descarta; el pedido incluye drag & drop.
- **Sí:** PARA múltiple + `Toda la sala` selecciona todo. Pedido explícito; TIPO queda único.
- **No:** nada preseleccionado alternativo (Mateo fijo). Se descarta por respuesta final.
- **Sí:** máx 4 solo imágenes con error en español. Patrón de validación SPEC 03–05.
- **Sí:** apilado encima que vuelve a Crear. Pedido explícito.
- **Sí:** Editar incluido con precarga desde `feed-mock`. Pedido explícito en última ronda; placeholder de foto no se precarga como archivo.
- **No:** foto desde el feed o detalle en este spec. No pedido; va en futuro spec.
- **Sí:** Publicar solo cierra sin persistencia. Patrón mock SPEC 01–06.
- **No:** post nuevo en memoria. Finge backend inexistente.
- **Sí:** definición con preguntas en tres bloques. No hubo atajo.

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Dos modales apilados con portales rompen foco/Escape | Cada modal su portal a `body`; Escape cierra solo el superior; foco inicial en cada apertura |
| `fixed` recortado por ancestro con transform (SPEC 06) | Portales a `body`, nunca `fixed` bajo tarjeta con hover/transform; sin interactivo dentro de interactivo |
| `objectURL` fugados al quitar/cerrar | Revocar URL al quitar preview y al cerrar cada modal |
| File API y drag & drop flaky en tests | Validar por `photoCount` y tipo en la lib pura; Playwright con archivos reales pequeños |
| Mapeo Editar ambiguo (audience/TIPO del mock) | Tabla explícita en Data model; fotos siempre vacío en Editar |

## What is **not** in this spec

- Backend o subida real de archivos.
- Persistencia del post o aparición en el feed.
- Rutas `/crear-publicacion` o `/foto` independientes.
- Visor desde el feed o desde detalle-publicación.
- Descarga real.
- Eliminar publicaciones o precargar archivos en Editar.
- Comentarios o detalle de publicación.

Cada uno de esos, si llega, va en su propio spec.
