<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## MCPs

- Playwright (`opencode.json` → `mcp.playwright`: `npx -y @playwright/mcp@latest`, `enabled: true`): snapshot/screenshot/click/press_key/resize para verificación visual y de comportamiento. Screenshots, logs y snapshots van SOLO en `.playwright-mcp/` (gitignored vía `.gitignore` → `.playwright-mcp/*`, nunca commitear).
- Context7: obligatorio para código Next.js/React/Tailwind vigente (este repo es Next.js 16.3.5 + React 19 + Tailwind v4 con breaking changes). Flujo: `resolve-library-id` con `Next.js` → `query-docs` por concepto (una llamada por concepto: App Router, `next/font/google`, Server vs Client Components, Tailwind v4). Si hay conflicto entre criterio propio y doc vigente (o avisos en `node_modules/next/dist/docs/`), manda la doc vigente y se cita en el reporte.
- Supabase (global `~/.config/opencode/opencode.json` → `mcp.supabase` remote `https://mcp.supabase.com/mcp?project_ref=qsmqaljvnhnbodiktriw&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching`, `enabled: true`, OAuth con `opencode mcp auth supabase`; reiniciar opencode tras cambiar config): docs/account/database/debugging/development/functions/branching del proyecto `qsmqaljvnhnbodiktriw`.

## Stack

- Next.js 16.3.5 (App Router) + React 19 + Tailwind CSS v4 + strict TS. Specs 01–07 implementados (ver `Estado actual`); datos aún mock en `lib/*-mock.ts`, sin backend. Supabase sin implementar: `package.json` sin `@supabase/supabase-js` ni `@supabase/ssr`, sin cliente ni conexión a DB.
- Entrypoints: `app/layout.tsx`, `app/page.tsx`. Path alias `@/*` maps to repo root.
- No test runner, no CI, no pre-commit. Do not invent test commands.

## Commands

- `npm run dev` (http://localhost:3000), `npm run build`, `npm run start`
- `npm run lint` (flat config: `next/core-web-vitals` + `next/typescript`; `eslint.config.mjs` ignora `.next/**`, `out/**`, `build/**`, `next-env.d.ts`, `references/**`, `.playwright-mcp/**`)
- Typecheck: `npx tsc --noEmit` (no script defined)
- Verify order: `lint` -> `tsc --noEmit` -> `build`
- `/verify-spec <NN-slug|ruta|número>` (`.opencode/commands/verify-spec.md`, delega en agente `spec-verifier` con `subtask: true`): verifica acceptance criteria del spec, corre en orden comandos → revisión código con Context7 → verificación visual con Playwright sobre `npm run dev` vs `references/`, corrige código+spec y marca `- [x]` solo con evidencia real.

## Agents (`.opencode/agents/`)

- `spec-verifier.md` (subagent, model `opencode-go/muse-spark-1.3-contributor`, `temperature: 0.1`): verifica los acceptance criteria del spec indicado, corrige código y spec con reglas Next.js 16, y marca los checks. Responde en el idioma del spec.
  - Entrada: ruta (`specs/01-home-feed.md`), número (`01`) o slug (`home-feed`); si falta o no existe, lista `specs/` y pregunta con `question`, no adivina.
  - Fases: 1 leer spec (Status/Objective/Scope/plan/checklist; si Status ≠ Approved avisa pero sigue, a diferencia de `/spec-impl`), 2 clasificar cada `- [ ]` (comandos → ejecutar; código/estructura → glob/grep/read; tipografías/estilo → layout+globals; comportamiento/visual → Playwright vs mockups), 3 Context7 obligatorio antes de validar/corregir Next.js, 4 Playwright obligatorio para UI (dev + snapshot/screenshot/click/resize, compara con `references/pantallas/*.dc.html` y `references/screenshots/*.png`), 5 fix mínimo sin romper otros, 6 solo edita líneas de checklist (`- [ ]` → `- [x]` con evidencia; no cambia Status ni reescribe secciones).
  - Reporte final en tabla `Criterio | ✅/❌ | Evidencia | Fix` + archivos tocados + fallos restantes + siguiente paso (si todo pasa: pedir cambiar Status a Implemented y commitear).
  - Permisos: `read/edit/glob/grep/list/skill/question/todowrite/playwright_*/context7_*/webfetch: allow`; `bash` solo `npm run lint*`, `npx tsc --noEmit`, `npm run build*`, `git status/diff/log*` (allow), `npm run dev` y `npx next *` (ask), resto deny; `websearch/task/external_directory: deny`.
  - Reglas duras: nunca `[x]` sin evidencia ejecutada; nunca inventar test runners/CI/pre-commits; nunca borrar bloque `nextjs-agent-rules`; nunca commitear/pushear/PR sin petición explícita.

## Next.js 16 gotchas

- This major has breaking changes vs training data. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecations.
- Never delete the `nextjs-agent-rules` block at the top of this file: `next dev` re-adds it, so commit it with your work to keep the tree clean.

## UI source of truth

- `references/pantallas/*.dc.html` are static clickable mockups of every screen (open in a browser; `support.js` renders the `<x-dc>` elements). `references/screenshots/*.png` mirror them.
- When building screens, match the mockups (Fredoka + Nunito fonts, warm cream palette), don't invent a new visual language.

## DB source of truth (Supabase, solo referencia)

- `opencode.json` → `references.docs` → `../07-DB-Schema/opendaycare-database-schema.md`: 13 tablas (`daycares`, `users`, `rooms`, `children`, `parent_children`, `invitations`, `posts`, `post_children`, `post_photos`, `reactions`, `comments`, `daily_summaries`, `devices` opcional) + enums en inglés (`user_role`, `user_status`, `relationship_type`, `invitation_status`, `post_type` 6 valores, `child_status`); la UI traduce a español, nunca persistir etiquetas.
- Solo referencia, nada implementado en la DB del proyecto `qsmqaljvnhnbodiktriw`: no asumir tablas/RLS/triggers existentes sin verificar con el MCP (`list_tables`/`execute_sql`).
- `.env.template` commiteado como plantilla (`SUPABASE_DB_PASSWORD`, excepción en `.gitignore` → `!.env.template`); secretos reales solo en `.env` local, nunca commitear.

## Workflow

- Skills en `.agents/skills/` (ver `skills-lock.json`): `spec` + `spec-impl` de `klerith/fernando-skills`; `supabase` (v0.1.2) + `supabase-postgres-best-practices` (v1.1.1) de `supabase/agent-skills`. Supabase: cargar skill `supabase` en CUALQUIER tarea Supabase (verificar changelog + `search_docs` del MCP antes de implementar, CLI solo vía `--help`, pasar `advisors` + checklist de seguridad antes de migrar); cargar `supabase-postgres-best-practices` ANTES de tocar Postgres (tablas/columnas, migraciones, RLS, índices, funciones, triggers). Mirrors de la misma instalación en `.claude/skills/` y `agent/skills/`; fuente canónica `.agents/skills/` + `skills-lock.json`.
- `/spec` (`spec` de `klerith/fernando-skills`, ver `skills-lock.json`): solo diseña el spec en `specs/NN-slug.md` (Status Draft por defecto, nunca Approved auto), nunca escribe código ni propone implementar. Lee `CLAUDE.md`/`AGENTS.md`, respeta numeración `NN` y convenciones de specs previos, configura `specs/.spec-config.yml` (`AutoCreateBranch: true` por defecto) solo si falta.
- `/spec-impl` (`spec-impl` de `klerith/fernando-skills`): solo implementa specs con Status = Approved (cualquier idioma); si es Draft/Implemented/otro, se detiene. Exige working tree limpio, crea/cambia a rama `spec-NN-slug` (según `AutoCreateBranch`), implementa paso a paso con pausas para revisar diff, nunca commitea solo.

## Estado actual (specs 01–07 implementados)

- `specs/07-crear-publicacion-foto.md` = Aprobado → implementado en rama `spec-07-crear-publicacion-foto` (2026-09-16) + verificado 2026-09-17 (21/21 checks con evidencia real, sin cambios de alcance): modal Crear (overlay tarjeta 580px desde `Nueva publicación` del Sidebar y `Compartí un momento…` del Composer, sin cambio de URL ni persistencia) + visor Foto oscuro apilado con dropzone central; PARA múltiple + `Toda la sala` (8 chips desde `kids-mock`, desmarcar uno la desmarca), TIPO único (7 pills), descripción obligatoria, fotos máx 4 solo imágenes con previews `objectURL` (revocados al quitar/cerrar), Editar precargado desde `feed-mock`, Publicar solo cierra. Fix 2026-09-17: icono `+` del tile Agregar usa `style={{ stroke: "var(--auth-error)" }}` en vez de `stroke="#C5503A"` hardcodeado (`app/components/home/CreatePostModal.tsx`). Verificado con Playwright sobre `npm run dev` (ambos triggers abren sin cambiar URL, validación triple bloquea en español, `Toda la sala` marca los 8 y desmarcar desmarca, TIPO único, picker `accept="image/*"` múltiple + drop real con previews `blob:`, no-imagen y 5ª foto bloquean con error, X quita, `dragover` resalta borde a `var(--accent-deep)`, carrusel anterior/siguiente, Descargar no navega, Foto apilado vacío con ayuda y con fotos que vuelve a Crear conservando, Editar precarga PARA/TIPO/descripción, Publicar válido cierra y queda en origen, recarga sin post nuevo, cierres Cancelar/X/overlay/Escape (visor solo cierra el superior), 390px sin scroll horizontal, 0 errores consola); `npm run lint`, `npx tsc --noEmit` y `npm run build` pasan.

- `specs/06-vincular-modal-fix.md` = Aprobado → implementado en rama `spec-06-vincular-modal-fix` (2026-09-16): fix raíz del modal Vincular padre recortado (botón dentro de `<Link>` + `fixed` bajo ancestro con transform). `KidCard` reestructurado a contenedor + `Link` interno + VINCULAR hermano; `LinkParentTrigger` renderiza `LinkParentModal` en portal a `document.body` vía `createPortal` (cubre lista y perfil, sin cambios en validación/código/persistencia). Verificado con Playwright sobre `npm run dev` (fullscreen 1056×666 con padre `BODY` desde lista y perfil, 1 diálogo estable sin cambio de URL, resto de tarjeta navega, triple validación bloquea, envío válido cierra y queda en origen, recarga sin padre nuevo, cierres X/overlay/Escape, 390px sin scroll horizontal, 0 errores consola, 0 interactivos anidados); `npm run lint`, `npx tsc --noEmit` y `npm run build` pasan.

- `specs/04-agregar-nino-modal.md` = Aprobado → implementado en rama `spec-04-agregar-nino-modal` (2026-09-16): modal de agregar-nino.dc.html como overlay desde Agregar niño (`/kids`) y Editar (perfil), sin cambiar URL ni persistencia, con validación local en español (nombre, fecha dd/mm/aaaa existente no futura, sala). Verificado con Playwright sobre `npm run dev` (submit vacío/inválido/sala vacía bloquean con errores, Guardar válido cierra y queda en origen, recarga sin niño nuevo, cierres Cancelar/X/overlay/Escape sin errores persistentes, Soles/Lunas/Estrellas pasan, <768px sin scroll horizontal, 0 errores consola); `tsc --noEmit`, `npm run lint` y `npm run build` pasan.

- `specs/03-login-activate-account.md` = Aprobado → implementado en rama `spec-03-login-activate-account` (2026-09-15): /login y /activate-account idénticos a `login.dc.html` y `activar-cuenta.dc.html`, sin selector Personal/Familia, con validación local en español y sin backend. Verificado con Playwright sobre `npm run dev` (submit vacío/inválido bloquea con errores, login/activación válidos navegan a `/`, cross-links OK, panel oculto <768px sin scroll horizontal); `tsc --noEmit`, eslint en archivos nuevos y `npm run build` pasan.

- `specs/01-home-feed.md` = Implemented (2026-09-14): home (/) luz idéntico a `references/pantallas/feed.dc.html`, datos mock, sin auth ni DB.
- `specs/02-kids-perfil-nino.md` = Approved → implementado en rama `spec-02-kids-perfil-nino` (2026-09-14): /kids y /kids/[slug] idénticos a `ninos.dc.html` y `perfil-nino.dc.html`, mock en `lib/kids-mock.ts`, búsqueda funcional, Sidebar con `activeItem` y Avatar extendido.
- `lib/feed-mock.ts`: `PostType` (`ACHIEVEMENT`|`ACTIVITY`|`ANNOUNCEMENT`) + `POST_TYPE_LABELS` (UI en español), `FeedPost`, `currentUser`, `feedHeader`, 3 posts exactos del mockup.
- `lib/kids-mock.ts`: `ParentStatus` (`ACTIVE`|`PENDING`), `LinkedParent`, `Kid`, 8 niños exactos del mockup (Mateo con Lucía ACTIVA y Diego PENDIENTE), `getKidBySlug`.
- `app/components/shared/` (server, reutilizables): `Avatar.tsx` (props opcionales `background`/`foreground`), `TypeBadge.tsx`.
- `app/components/home/` (`Sidebar` con prop `activeItem: "feed"|"kids"` default `feed`, href Niños → `/kids`, `Nueva publicación` vía `CreatePostTrigger` sin cambio de URL; `FeedHeader`, `Composer` (tarjeta vía `CreatePostTrigger`), `PostCard` server (Editar vía `EditPostTrigger`, placeholder `/foto` intacto futuro) + `LikeButton`, `MobileNav` client con `useState` que propaga `activeItem`): likes locales toggle +1/-1 (3/5/8 iniciales, sin persistencia); drawer móvil <768px reutiliza `Sidebar` (cierre X/overlay/Escape).
- `app/components/home/` modales SPEC 07 (client con `useState`, portales a `document.body` con `createPortal`): `CreatePostModal` (overlay + tarjeta 580px, PARA múltiple + `Toda la sala` con chips/nombres/avatares de los 8 niños leídos de `kids-mock` por `shortName` normalizado, TIPO único 7 pills, textarea, FOTOS con picker `accept="image/*"` + drop + previews `objectURL` + validación al Publicar, apila `PhotoModal` en portal `z-[60]` al pulsar Agregar o en previews con fotos conservadas, Escape solo cierra el superior), `PhotoModal` (fullscreen oscuro, X/título+metadata/Descargar decorativo, zona dashed con ayuda en vacío y carrusel anterior/siguiente con fotos, drop central, caption), `CreatePostTrigger` (genérico `children`+`className`+`style`, botón sin navegación), `EditPostTrigger` (botón Editar idéntico, precarga PARA/TIPO/descripción desde `feed-mock` vía `mapFeedPostToInitial`, fotos vacío).
- `app/components/kids/` (server salvo `KidSearch`/`AddKidTrigger`/`EditKidTrigger`/`AddKidModal`/`LinkParentTrigger`/`LinkParentModal` client con `useState`): `KidCard` (contenedor + `Link` interno a `/kids/[slug]` + botón VINCULAR hermano vía `LinkParentTrigger`, regla MANÍ/LACTOSA/VINCULAR/chevron), `LinkParentTrigger` (portal del modal a `document.body` con `createPortal`, solo renderiza con `open` tras clic en cliente), `LinkParentModal` (overlay fullscreen `fixed inset-0` + tarjeta 480px, validación triple, código 5 chars + `Vence en 7 días`), `KidsGrid` (2 col, 1 en móvil), `KidSearch` (filtro por nombre + encabezado SALA SOLES + vacío en español), `ProfileHeader` (server, Editar vía `EditKidTrigger`), `AddKidModal` (overlay + tarjeta 520px del mockup, select SALA con vacío inicial, validación al submit, cierres Cancelar/X/overlay/Escape, foco inicial en nombre), `AddKidTrigger` (botón Agregar idéntico, abre modal vacío), `EditKidTrigger` (botón Editar idéntico, precarga nombre/fecha dd/mm/aaaa/sala/alergias/notas, título `Editar niño`), `AllergyNotes` (solo con notas), `KidFacts`, `LinkedParents` (badges ACTIVA/PENDIENTE).
- `app/kids/page.tsx` (columna 880px, header GESTIÓN/Niños/Agregar vía `AddKidTrigger` sin cambio de URL, server) y `app/kids/[slug]/page.tsx` (`generateStaticParams` 8 slugs, `notFound()` en slug inexistente; Editar vía trigger, Resumen → `/resumen-dia`, Vincular → `/vincular-padre` futuros).
- `lib/kid-form-validation.ts`: `Classroom` (`SOLES`|`LUNAS`|`ESTRELLAS`), `AddKidValues`, `KidFormErrors`, `CLASSROOM_LABELS`, `validateKidForm` puro (nombre no vacío, fecha dd/mm/aaaa existente no futura, sala elegida), errores en español.
- `lib/auth-validation.ts`: `LoginValues`, `ActivationValues`, `FormErrors`, `isValidEmail`, `validateLogin` (email formato + pass ≥6), `validateActivation` (+ código no vacío y `photoConsent` obligatorio), errores en español.
- `lib/post-form-validation.ts`: `PostAudience` (8 valores, uno por niño del mock), `PostKind` (7 valores), `CreatePostValues`, `CreatePostErrors`, `POST_AUDIENCE_LABELS`, `POST_KIND_LABELS`, `WHOLE_ROOM_LABEL`, `MAX_POST_PHOTOS = 4`, `validateCreatePost` puro (PARA vacío sin `wholeRoom`, TIPO vacío, descripción solo-espacios, fotos por `photoError`/conteo), errores en español.
- `app/components/auth/` (`BrandPanel` server con panel coral y footer exactos; `LoginForm`/`ActivateForm` client con `useState`, validación al submit y `router.push("/")` solo si válido; prefill activate 7K4P9 + lucia.fernandez@gmail.com, checkbox marcado editable) + `app/login/page.tsx` (grid 1.05fr/1fr, columna 392px, sin rol; ¿Olvidaste? → `/recuperar-password` futuro) y `app/activate-account/page.tsx` (centrado 440px, tarjeta Mateo · Sala Soles vía `invitePreview`).
- `app/layout.tsx`: `lang="es"`, Fredoka + Nunito vía `next/font/google` con variables (sin `<link>` manual).
- `app/globals.css`: tokens Tailwind v4 `@theme inline` (fondo `#F6ECDF`, superficie `#FFFDF9`, bordes `#ECE0D0`, acentos `#F2937A`/`#EE8164`/`#D9583C`, badges LOGRO/ACTIVIDAD/ANUNCIO, pasteles avatar sky/rose/mint/sand/lavender + `parent-blue`, badges alergia/vínculo/pendiente, `kid-hover-border`, `kid-chevron`, caja alergias, más `auth-*`: fondo `#FBF4EC`, borde input `#EADFD0`, error `#C5503A`, consentimiento `#FBF1D6`/`#8A7234`/`#5FB97E`, gradiente panel `#F6A98E`→`#F2937A`→`#EC7E62`, botón `#F4977E`→`#EE8164`, placeholder `#B6A99B`, más `post-kind-*` (bg/fg de las 7 pills TIPO) y `photo-viewer-*` (fondo `#1A1714`, zona, bordes/círculos/textos blancos translúcidos)), `color-scheme: light` forzado, dark comentado como estructura futura.

## Spec Driven Development - Skills

- /spec usaremos esta habilidad para crear las especificaciones. 
- /spec-impl usaremos estos skills para crear las implementaciones. 

## Reglas de codigo

- Usar código limpio, nombres, funciones y variables en inglés
- Textos visibles de UI en español. Un componente por archivo, PascalCase, export nombrado. Server components por defecto; `LikeButton`/`MobileNav`/`LoginForm`/`ActivateForm`/`LinkParentTrigger`/`LinkParentModal`/`CreatePostModal`/`PhotoModal`/`CreatePostTrigger`/`EditPostTrigger` son client (`useState`). Portales con `createPortal` a `document.body` solo tras interacción en cliente (sin `useEffect`/`mounted`); nunca interactivo dentro de interactivo ni `fixed` bajo ancestro con transform.
- Colores/radios/sombras vía tokens en `app/globals.css` (`@theme inline`), nunca hardcodeados. Fuentes solo vía `next/font/google`.
- Navegación interna siempre con `Link` de `next/link` (incluso a rutas futuras aún no creadas); nunca `<a href="/…">`.
- Estructura: `app/components/shared/` (reutilizables) + subcarpeta por página (`app/components/home/`); futuras páginas agregan su carpeta (`ninos`, `avisos`…).

## Meta-regla: mantener AGENTS.md siempre actualizado (obligatorio)

- Al terminar CUALQUIER cambio (código, spec, agente en `.opencode/agents/`, comando en `.opencode/commands/`, skill en `.agents/skills/`, MCP en `opencode.json`, dependencia en `package.json`, config de lint/ts/build, tokens/estructura en `app/` o `lib/`), actualizar este `AGENTS.md` en el MISMO trabajo, antes de dar por terminada la tarea.
- Qué actualizar: sección `Estado actual` (specs implementados + archivos creados/modificados), `Commands` (nuevos scripts o cambios de orden/flags), `Agents` (nuevo agente o cambios de permisos/fases/modelo), `MCPs` (nuevo servidor o cambio en `opencode.json`/permisos/ruta de artefactos), `Stack`/`Workflow`/`UI source of truth`/`Reglas de codigo` si cambian convenciones, dependencias o mockups.
- Cómo: editar solo las secciones afectadas, conciso y factual (rutas + comportamiento real verificado, no intenciones). No reescribir el archivo entero ni tocar el bloque `nextjs-agent-rules`.
- Verificación: releer el diff de `AGENTS.md` (`git diff AGENTS.md`) antes de commitear; si el cambio no se refleja aquí, la tarea NO está terminada. 