# SPEC 10 — Login real con email y protección de rutas con Supabase

> **Status:** Implemented
> **Depends on:** SPEC 03, SPEC 09
> **Date:** 2026-10-02
> **Objective:** Conectar /login a Supabase Auth con email y contraseña y proteger todas las rutas salvo /login y /activate-account mediante proxy.ts con getClaims().

## Scope

**In:**

- Server Actions en `app/login/actions.ts`: `login` con `signInWithPassword` + `revalidatePath` + `redirect('/')`, y `signOut` con `signOut` + `redirect('/login')`, vía `@/lib/supabase/server`.
- `LoginForm` mantiene la validación local `validateLogin` y llama a `login`; el error del servidor se muestra en español bajo el form sin navegar.
- Lectura de `public.users` tras el login con server client; si falta la fila o `status` es `pending`, se hace `signOut` y se muestra un error en español.
- `lib/supabase/proxy.ts` con `getClaims()`: sin sesión y ruta fuera de `/login` y `/activate-account` redirige a `/login`; con sesión en `/login` o `/activate-account` redirige a `/`.
- Ítem Cerrar sesión al final de `Sidebar` y `MobileNav` que llama a `signOut`.
- Textos visibles en español, código en inglés, colores vía tokens en `app/globals.css`, sin hardcodear.

**Out of scope (for future specs):**

- Activación real con código de invitación y `signUp`.
- Recuperar contraseña funcional.
- Roles por `role` con vistas distintas y policies por dueño.
- Lectura de `public.users` en páginas (nombre/rol) y reemplazo de mocks.
- Trigger en `auth.users` y cambios DDL/RLS (cero migraciones en este spec).

## Data model

Esta feature no crea tablas ni enums. Reusa `auth.users` y lectura de `public.users` de SPEC 09:

```ts
// app/login/actions.ts
type LoginResult = { error?: string };
async function login(formData: FormData): Promise<never>;
async function signOut(): Promise<never>;

// public.users leído tras el login
type PublicUserCheck = { id: string; role: string; status: "pending" | "active" };
```

Convenciones:

- El servidor verifica con `getClaims()`, nunca con `getSession()` ni `getUser()` en el proxy.
- Un cliente nuevo por request desde `@/lib/supabase/server`; nunca global ni `createClient` inline.
- Errores de UI en español bajo el campo (credenciales inválidas, email sin confirmar, cuenta pendiente, perfil no encontrado).

## Implementation plan

1. Crear `app/login/actions.ts` con `login` y `signOut` como Server Actions (`'use server'`) con `createClient` de `@/lib/supabase/server`. Manual test: importar la action y confirmar que sin credenciales devuelve error sin romper el build.
2. Conectar `LoginForm` a `login` manteniendo `validateLogin` local; el error del servidor se muestra bajo el form en español y el éxito redirige vía la action. Manual test: submit vacío no llama a Supabase, login inválido muestra error sin navegar.
3. Agregar la lectura de `public.users` tras el login en la action; si falta la fila o es `pending`, hacer `signOut` y devolver error en español. Manual test: `joel@google.com` (active) pasa, usuario pending bloquea.
4. Extender `lib/supabase/proxy.ts` con los redirects según sesión (`getClaims()`), manteniendo `proxy.ts` raíz y su matcher. Manual test: sin sesión `/` redirige a `/login`, con sesión `/login` redirige a `/`.
5. Agregar el ítem Cerrar sesión a `Sidebar` y `MobileNav` vía `signOut`. Manual test: salir termina en `/login` sin sesión.
6. Verificar con Playwright (MCP `playwright`, artefactos SOLO en `.playwright-mcp/` gitignored) sobre `npm run dev`: login válido/inválido, guards de rutas con y sin sesión, logout desde Sidebar y móvil, `/activate-account` pública intacta; más `npm run lint`, `npx tsc --noEmit` y `npm run build`.

## Acceptance criteria

- [x] El login válido con `joel@google.com` navega a `/` con sesión Supabase activa.
- [x] Email o contraseña inválidos muestran un error en español bajo el form y no navegan.
- [x] El submit vacío muestra los errores locales en español y no llama a Supabase.
- [x] El usuario con `status` pending o sin fila en `public.users` ve un error en español y queda sin sesión.
- [x] Sin sesión, `/`, `/kids` y `/kids/[slug]` redirigen a `/login`.
- [x] Con sesión, `/login` y `/activate-account` redirigen a `/`.
- [x] `/activate-account` sigue visible sin sesión con su mock intacto.
- [x] Cerrar sesión desde el Sidebar y desde el MobileNav termina en `/login` sin sesión.
- [x] `npm run lint` pasa sin errores.
- [x] `npx tsc --noEmit` pasa sin errores.
- [x] `npm run build` pasa sin errores.

## Decisions

- **Sí:** Server Action con `signInWithPassword` + `revalidatePath` + `redirect`. Patrón oficial Supabase vía Context7 (`/supabase/supabase`).
- **No:** `createBrowserClient` directo en el form. Pierde el refresh del servidor y complica las cookies.
- **Sí:** `getClaims()` en `proxy.ts` con redirects. Patrón oficial; `getSession()` está prohibido en servidor.
- **No:** protección por página sin proxy. Duplica lógica y deja huecos.
- **Sí:** solo `/login` y `/activate-account` públicas. Lo pedido explícito; el resto queda privado.
- **No:** parámetro `next` tras el login en este spec. Solo `/` para mantenerlo mínimo.
- **Sí:** verificar `public.users` (falta o `pending` bloquea con `signOut`). Da un error útil sin meter roles.
- **No:** bloquear por `role` ni policies nuevas. Va en un spec futuro.
- **Sí:** mocks intactos tras el login. No mezcla auth con datos.
- **Sí:** `proxy.ts` raíz con matcher existente (Next.js 16, no `middleware.ts`). Convención vigente vía Context7 (`/vercel/next.js`).
- **Sí:** definición con preguntas en dos bloques. Sin atajo.

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| `getClaims()` sin `await` o cliente global rompe la sesión | Un cliente por request y `await getClaims()` como en la guía canónica. |
| Loop de redirects `/login` ↔ `/` | Excluir exacto `/login` y `/activate-account` del guard sin sesión y forzar lo inverso con sesión. |
| Mensaje crudo de Supabase en inglés | Mapear a español en la action antes de mostrarlo. |

## What is **not** in this spec

- Activación real y `signUp`.
- Recuperar contraseña funcional.
- Roles con vistas distintas y policies por dueño.
- Lectura de `public.users` en páginas y reemplazo de mocks.
- Migraciones DDL/RLS y trigger en `auth.users`.

Cada uno de esos, si llega, va en su propio spec.
