<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## MCPs

- Playwright (`opencode.json` → `mcp.playwright`: `npx -y @playwright/mcp@latest`, `enabled: true`): snapshot/screenshot/click/press_key/resize para verificación visual y de comportamiento. Screenshots, logs y snapshots van SOLO en `.playwright-mcp/` (gitignored vía `.gitignore` → `.playwright-mcp/*`, nunca commitear).
- Context7: obligatorio para código Next.js/React/Tailwind vigente (este repo es Next.js 16.3.5 + React 19 + Tailwind v4 con breaking changes). Flujo: `resolve-library-id` con `Next.js` → `query-docs` por concepto (una llamada por concepto: App Router, `next/font/google`, Server vs Client Components, Tailwind v4). Si hay conflicto entre criterio propio y doc vigente (o avisos en `node_modules/next/dist/docs/`), manda la doc vigente y se cita en el reporte.

## Stack

- Next.js 16.3.5 (App Router) + React 19 + Tailwind CSS v4 + strict TS. Spec 01 home-feed implementado; resto de pantallas aún como mockups en `references/`.
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

## Workflow

- Spec-driven skills live in `.agents/skills/` (`spec`, `spec-impl`); use them for large features.
- `/spec` (`spec` de `klerith/fernando-skills`, ver `skills-lock.json`): solo diseña el spec en `specs/NN-slug.md` (Status Draft por defecto, nunca Approved auto), nunca escribe código ni propone implementar. Lee `CLAUDE.md`/`AGENTS.md`, respeta numeración `NN` y convenciones de specs previos, configura `specs/.spec-config.yml` (`AutoCreateBranch: true` por defecto) solo si falta.
- `/spec-impl` (`spec-impl` de `klerith/fernando-skills`): solo implementa specs con Status = Approved (cualquier idioma); si es Draft/Implemented/otro, se detiene. Exige working tree limpio, crea/cambia a rama `spec-NN-slug` (según `AutoCreateBranch`), implementa paso a paso con pausas para revisar diff, nunca commitea solo.

## Estado actual (specs 01, 02 implementados y 03 implementado en rama, pendiente Status Implemented)

- `specs/03-login-activate-account.md` = Aprobado → implementado en rama `spec-03-login-activate-account` (2026-09-15): /login y /activate-account idénticos a `login.dc.html` y `activar-cuenta.dc.html`, sin selector Personal/Familia, con validación local en español y sin backend. Verificado con Playwright sobre `npm run dev` (submit vacío/inválido bloquea con errores, login/activación válidos navegan a `/`, cross-links OK, panel oculto <768px sin scroll horizontal); `tsc --noEmit`, eslint en archivos nuevos y `npm run build` pasan.

- `specs/01-home-feed.md` = Implemented (2026-09-14): home (/) luz idéntico a `references/pantallas/feed.dc.html`, datos mock, sin auth ni DB.
- `specs/02-kids-perfil-nino.md` = Approved → implementado en rama `spec-02-kids-perfil-nino` (2026-09-14): /kids y /kids/[slug] idénticos a `ninos.dc.html` y `perfil-nino.dc.html`, mock en `lib/kids-mock.ts`, búsqueda funcional, Sidebar con `activeItem` y Avatar extendido.
- `lib/feed-mock.ts`: `PostType` (`ACHIEVEMENT`|`ACTIVITY`|`ANNOUNCEMENT`) + `POST_TYPE_LABELS` (UI en español), `FeedPost`, `currentUser`, `feedHeader`, 3 posts exactos del mockup.
- `lib/kids-mock.ts`: `ParentStatus` (`ACTIVE`|`PENDING`), `LinkedParent`, `Kid`, 8 niños exactos del mockup (Mateo con Lucía ACTIVA y Diego PENDIENTE), `getKidBySlug`.
- `app/components/shared/` (server, reutilizables): `Avatar.tsx` (props opcionales `background`/`foreground`), `TypeBadge.tsx`.
- `app/components/home/` (`Sidebar` con prop `activeItem: "feed"|"kids"` default `feed`, href Niños → `/kids`; `FeedHeader`, `Composer`, `PostCard` server + `LikeButton`, `MobileNav` client con `useState` que propaga `activeItem`): likes locales toggle +1/-1 (3/5/8 iniciales, sin persistencia); drawer móvil <768px reutiliza `Sidebar` (cierre X/overlay/Escape).
- `app/components/kids/` (server salvo `KidSearch` client con `useState`): `KidCard` (regla MANÍ/LACTOSA/VINCULAR/chevron, link a `/kids/[slug]`), `KidsGrid` (2 col, 1 en móvil), `KidSearch` (filtro por nombre + encabezado SALA SOLES + vacío en español), `ProfileHeader`, `AllergyNotes` (solo con notas), `KidFacts`, `LinkedParents` (badges ACTIVA/PENDIENTE).
- `app/kids/page.tsx` (columna 880px, header GESTIÓN/Niños/Agregar niño → `/agregar-nino` futuro) y `app/kids/[slug]/page.tsx` (`generateStaticParams` 8 slugs, `notFound()` en slug inexistente; Editar → `/agregar-nino`, Resumen → `/resumen-dia`, Vincular → `/vincular-padre` futuros).
- `lib/auth-validation.ts`: `LoginValues`, `ActivationValues`, `FormErrors`, `isValidEmail`, `validateLogin` (email formato + pass ≥6), `validateActivation` (+ código no vacío y `photoConsent` obligatorio), errores en español.
- `app/components/auth/` (`BrandPanel` server con panel coral y footer exactos; `LoginForm`/`ActivateForm` client con `useState`, validación al submit y `router.push("/")` solo si válido; prefill activate 7K4P9 + lucia.fernandez@gmail.com, checkbox marcado editable) + `app/login/page.tsx` (grid 1.05fr/1fr, columna 392px, sin rol; ¿Olvidaste? → `/recuperar-password` futuro) y `app/activate-account/page.tsx` (centrado 440px, tarjeta Mateo · Sala Soles vía `invitePreview`).
- `app/layout.tsx`: `lang="es"`, Fredoka + Nunito vía `next/font/google` con variables (sin `<link>` manual).
- `app/globals.css`: tokens Tailwind v4 `@theme inline` (fondo `#F6ECDF`, superficie `#FFFDF9`, bordes `#ECE0D0`, acentos `#F2937A`/`#EE8164`/`#D9583C`, badges LOGRO/ACTIVIDAD/ANUNCIO, pasteles avatar sky/rose/mint/sand/lavender + `parent-blue`, badges alergia/vínculo/pendiente, `kid-hover-border`, `kid-chevron`, caja alergias, más `auth-*`: fondo `#FBF4EC`, borde input `#EADFD0`, error `#C5503A`, consentimiento `#FBF1D6`/`#8A7234`/`#5FB97E`, gradiente panel `#F6A98E`→`#F2937A`→`#EC7E62`, botón `#F4977E`→`#EE8164`, placeholder `#B6A99B`), `color-scheme: light` forzado, dark comentado como estructura futura.

## Spec Driven Development - Skills

- /spec usaremos esta habilidad para crear las especificaciones. 
- /spec-impl usaremos estos skills para crear las implementaciones. 

## Reglas de codigo

- Usar código limpio, nombres, funciones y variables en inglés
- Textos visibles de UI en español. Un componente por archivo, PascalCase, export nombrado. Server components por defecto; `LikeButton`/`MobileNav`/`LoginForm`/`ActivateForm` son client (`useState`).
- Colores/radios/sombras vía tokens en `app/globals.css` (`@theme inline`), nunca hardcodeados. Fuentes solo vía `next/font/google`.
- Navegación interna siempre con `Link` de `next/link` (incluso a rutas futuras aún no creadas); nunca `<a href="/…">`.
- Estructura: `app/components/shared/` (reutilizables) + subcarpeta por página (`app/components/home/`); futuras páginas agregan su carpeta (`ninos`, `avisos`…).

## Meta-regla: mantener AGENTS.md siempre actualizado (obligatorio)

- Al terminar CUALQUIER cambio (código, spec, agente en `.opencode/agents/`, comando en `.opencode/commands/`, skill en `.agents/skills/`, MCP en `opencode.json`, dependencia en `package.json`, config de lint/ts/build, tokens/estructura en `app/` o `lib/`), actualizar este `AGENTS.md` en el MISMO trabajo, antes de dar por terminada la tarea.
- Qué actualizar: sección `Estado actual` (specs implementados + archivos creados/modificados), `Commands` (nuevos scripts o cambios de orden/flags), `Agents` (nuevo agente o cambios de permisos/fases/modelo), `MCPs` (nuevo servidor o cambio en `opencode.json`/permisos/ruta de artefactos), `Stack`/`Workflow`/`UI source of truth`/`Reglas de codigo` si cambian convenciones, dependencias o mockups.
- Cómo: editar solo las secciones afectadas, conciso y factual (rutas + comportamiento real verificado, no intenciones). No reescribir el archivo entero ni tocar el bloque `nextjs-agent-rules`.
- Verificación: releer el diff de `AGENTS.md` (`git diff AGENTS.md`) antes de commitear; si el cambio no se refleja aquí, la tarea NO está terminada. 