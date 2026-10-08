# SPEC 11 — Rooms, children y alta de niños conectada a Supabase

> **Status:** Approved
> **Depends on:** SPEC 02, SPEC 04, SPEC 08, SPEC 09, SPEC 10
> **Date:** 2026-10-08
> **Objective:** Crear las tablas `rooms` y `children` con seed de tres salas en Supabase y conectar el alta de niños y la lista de `/kids` a la base de datos.

## Scope

**In:**

- Crear con `supabase migration new create_rooms` un archivo `supabase/migrations/<timestamp>_create_rooms.sql` con la tabla `public.rooms` más el seed de `Soles`, `Lunas` y `Estrellas` ligadas a `Guardería Sala Soles`, y aplicarlo con `supabase db push`.
- Crear con `supabase migration new create_children` un archivo `supabase/migrations/<timestamp>_create_children.sql` con el enum `child_status` (`active`, `archived`) y la tabla `public.children` con FK `room_id` a `public.rooms`, y aplicarlo con `supabase db push`.
- RLS con el patrón de SPEC 08/09 (`revoke all` a `anon` y `authenticated` en la misma migración antes del `grant`): `rooms` con solo `SELECT` para `authenticated`; `children` con `SELECT` + `INSERT` para `authenticated` y cero policies de `UPDATE` o `DELETE`.
- Server Action `createChild` en `app/kids/actions.ts` que inserta en `public.children` con el cliente de `@/lib/supabase/server` (un cliente nuevo por request) y mapea el form al esquema inglés.
- Selector SALA de `AddKidModal` alimentado desde `public.rooms` (`id` + `name`, ordenado por nombre) con estados de cargando y error en español.
- Guardar válido inserta en `children`, cierra el modal, refresca `/kids` y muestra el niño nuevo; el error de Supabase se muestra en español bajo el form sin cerrar ni navegar.
- Página `/kids` (server) que lee `children` con join a `rooms` para el nombre de sala y reemplaza `kids-mock` en la lista; `KidSearch` filtra en cliente, `KidCard` y VINCULAR quedan intactos, y la lista vacía muestra un estado vacío en español.
- Textos visibles en español, código y persistencia en inglés, colores vía tokens en `app/globals.css`, sin hardcodear.

**Out of scope (for future specs):**

- Perfil real del niño (la ruta `/kids/[slug]` sigue con `getKidBySlug` del mock).
- Editar niño real (`EditKidTrigger` sigue precargando del mock sin escribir en DB).
- Vincular padre real (`parent_children`, `invitations`, códigos).
- Trigger `AFTER INSERT` en `auth.users`, trigger de `updated_at` y policies por dueño o por guardería.
- Reemplazo de `feed-mock`, Storage de fotos, realtime y resto del diccionario.

## Data model

```sql
create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  daycare_id uuid not null references public.daycares(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (daycare_id, name)
);

create type child_status as enum ('active', 'archived');

create table public.children (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete restrict,
  full_name text not null,
  birth_date date not null,
  enrolled_at date not null default current_date,
  medical_notes text,
  allergy_tags text[],
  photo_consent boolean not null default true,
  status child_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.rooms enable row level security;
alter table public.children enable row level security;

revoke all on table public.rooms from anon, authenticated;
grant select on table public.rooms to authenticated;

create policy rooms_select_authenticated
on public.rooms
for select
to authenticated
using (true);

revoke all on table public.children from anon, authenticated;
grant select, insert on table public.children to authenticated;

create policy children_select_authenticated
on public.children
for select
to authenticated
using (true);

create policy children_insert_authenticated
on public.children
for insert
to authenticated
with check (true);
```

```sql
-- Seed dentro de la migración create_rooms, idempotente por unique (daycare_id, name)
insert into public.rooms (daycare_id, name)
select d.id, s.name
from (select id from public.daycares where name = 'Guardería Sala Soles') as d
cross join (values ('Soles'), ('Lunas'), ('Estrellas')) as s(name)
on conflict (daycare_id, name) do nothing;
```

```ts
// app/kids/actions.ts
type CreateChildInput = {
  fullName: string;
  birthDate: string; // dd/mm/aaaa del form
  roomId: string; // uuid de public.rooms
  allergies: string; // texto libre "Maní, Lactosa"
  medicalNotes: string;
};
type CreateChildResult = { error?: string };
async function createChild(input: CreateChildInput): Promise<CreateChildResult>;

// Lectura de /kids (server, join para el nombre de sala)
type KidRow = {
  id: string;
  full_name: string;
  birth_date: string;
  room_id: string;
  room_name: string;
  allergy_tags: string[] | null;
  medical_notes: string | null;
  status: "active" | "archived";
};
```

Convenciones:

- Mapeo al guardar: `fullName` → `full_name`, `birthDate` dd/mm/aaaa → `birth_date` yyyy-mm-dd, sala → `room_id`, `medicalNotes` vacío → `NULL` → `medical_notes`, alergias texto → `allergy_tags` en inglés minúsculas (`maní`→`peanut`, `lactosa`→`lactose`, `gluten`→`gluten`, `huevo`→`egg`, `soja`→`soy`, resto slug en minúsculas; vacío → `NULL`), `enrolled_at` hoy por default, `status active` por default, `photo_consent true` por default.
- El servidor verifica con `getClaims()`, nunca con `getSession()`.
- Un cliente nuevo por request desde `@/lib/supabase/server`; nunca global ni `createClient` inline.
- `service_role` sigue escribiendo porque ignora RLS; la app solo usa el cliente `authenticated`.
- Identificadores en inglés y en minúsculas; la UI traduce a español (`Soles`, `MANÍ`, `Elegí una sala`).

## Implementation plan

1. Crear la migración `supabase migration new create_rooms` y escribir en el archivo generado la tabla `public.rooms` con su RLS `SELECT` y el seed idempotente de `Soles`, `Lunas` y `Estrellas`. Manual test: el archivo existe y el SQL nombra solo `rooms`.
2. Aplicar con `supabase db push` y verificar solo en lectura (MCP `list_tables` y `execute_sql` SELECT) que `rooms` tiene las 3 filas ligadas a `Guardería Sala Soles`. Manual test: `select name from rooms` devuelve las tres.
3. Crear la migración `supabase migration new create_children` con el enum `child_status` y la tabla `public.children` con su RLS `SELECT` + `INSERT`, y aplicarla con `supabase db push`. Manual test: el historial remoto muestra ambas migraciones en orden rooms → children.
4. Crear `app/kids/actions.ts` con `createChild` como Server Action (`'use server'`) que valida con `validateKidForm`, convierte la fecha y las alergias, e inserta con el server client devolviendo `{ error }` en español. Manual test: input inválido devuelve error sin tocar Supabase.
5. Pasar las salas (`id`, `name`) de `public.rooms` como props de servidor a `AddKidModal` y renderizar el select SALA desde la DB con estado `Cargando salas…` y error en español si falla la lectura. Manual test: el select lista Soles, Lunas y Estrellas desde la DB, sin `CLASSROOM_LABELS` hardcodeado como fuente.
6. Conectar Guardar a `createChild`: el error del servidor se muestra bajo el form sin cerrar; el éxito cierra y refresca `/kids` con el niño nuevo. Manual test: alta válida aparece en la lista, alta inválida o con DB caída no cierra.
7. Cambiar `app/kids/page.tsx` a server async que lee `children` con join a `rooms`, mantiene `KidSearch` en cliente y el estado vacío en español, con `KidCard` y VINCULAR intactos. Manual test: con tabla vacía se ve el vacío, con un alta se ve el niño con su sala.
8. Verificar con Playwright (artefactos SOLO en `.playwright-mcp/` gitignored) sobre `npm run dev` con sesión `fernando@google.com`: selector desde DB, alta válida, errores, lista real y perfil mock intacto; más `npm run lint`, `npx tsc --noEmit` y `npm run build`.

## Acceptance criteria

- [ ] Existe `supabase/migrations/<timestamp>_create_rooms.sql` creado por `migration new` con solo la tabla `public.rooms` y el seed de `Soles`, `Lunas` y `Estrellas`.
- [ ] Existe `supabase/migrations/<timestamp>_create_children.sql` creado por `migration new` con solo el enum `child_status` (`active`, `archived`) y la tabla `public.children`.
- [ ] `rooms.daycare_id` es `NOT NULL` con FK a `daycares(id)` y `ON DELETE CASCADE`, y existe `UNIQUE (daycare_id, name)`.
- [ ] `children.room_id` es `NOT NULL` con FK a `rooms(id)`; `status` tiene default `active`, `enrolled_at` default `current_date` y `photo_consent` default `true`.
- [ ] `rooms` tiene RLS activo, una sola policy `SELECT` para `authenticated` y cero policies de escritura.
- [ ] `children` tiene RLS activo, policies `SELECT` e `INSERT` para `authenticated` y cero policies de `UPDATE` o `DELETE`.
- [ ] El historial remoto tiene ambas migraciones en orden rooms → children con el version igual al timestamp de cada archivo.
- [ ] El select SALA del modal lista las salas desde `public.rooms` y muestra `Cargando salas…` mientras carga.
- [ ] Guardar con datos válidos inserta la fila en `children` con el mapeo completo, cierra el modal y la lista muestra el niño nuevo con su sala.
- [ ] Guardar con error de Supabase muestra el error en español bajo el form sin cerrar ni navegar.
- [ ] La validación local (`validateKidForm`) sigue bloqueando el submit vacío o inválido sin llamar a Supabase.
- [ ] `/kids` con tabla vacía muestra el estado vacío en español y con altas muestra los niños reales con join a sala.
- [ ] `/kids/[slug]` sigue leyendo del mock (`getKidBySlug`, `notFound()` en slug inexistente) sin cambios.
- [ ] No hay passwords ni secretos en `specs/`, migraciones o git; `.env` no se commitea.
- [ ] `npm run lint` pasa sin errores.
- [ ] `npx tsc --noEmit` pasa sin errores.
- [ ] `npm run build` pasa sin errores.

## Decisions

- **Sí:** un solo spec 11 con rooms + children + UI. La FK `children` → `rooms` lo exige secuencial y cabe en un plan.
- **No:** dividir en spec 11 rooms y spec 12 children + UI. Dos ramas e implementaciones para algo que se verifica junto.
- **Sí:** seed `Soles`, `Lunas` y `Estrellas` ligadas a `Guardería Sala Soles`. Coincide con el enum `Classroom` y los 8 niños del mock.
- **No:** seed sin filas ni con otros nombres. Deja el selector vacío y rompe la correspondencia con el form actual.
- **Sí:** seed dentro de la migración `create_rooms` con lookup por nombre de guardería y `on conflict do nothing`. Respeta la regla dura DB (todo vía migraciones) y es reejecutable.
- **Sí:** mapeo completo al guardar (`enrolled_at` hoy, `status active`, `photo_consent true`, alergias ES→EN en minúsculas). El form no pide esos campos y la tabla los requiere o los espera con default.
- **Sí:** diccionario mínimo ES→EN de alergias con fallback a slug en minúsculas y vacío → `NULL`. Cubre `MANÍ`/`LACTOSA` del mock sin inventar una tabla `allergies`.
- **No:** tabla `allergies` + `child_allergies` normalizada. La nota del diccionario la deja como opcional futura.
- **Sí:** `rooms` con `SELECT` para `authenticated` y `children` con `SELECT` + `INSERT` para `authenticated`, con `revoke all` previo como SPEC 08/09. El alta desde la app la hace un usuario logueado.
- **No:** mantener solo `SELECT` en ambas. Bloquearía el Guardar desde la app.
- **No:** policies por dueño o por guardería en este spec. Van en un spec futuro como en SPEC 09.
- **Sí:** `/kids` reemplaza el mock por query real con join a `rooms`; `KidSearch` filtra en cliente y `KidCard`/VINCULAR quedan intactos. Es lo pedido explícito.
- **No:** fallback al mock cuando la tabla está vacía. Oculta el estado real y el vacío en español ya cubre ese caso.
- **Sí:** perfil `/kids/[slug]` sigue con el mock. La DB usa uuid sin slug y el perfil real merece su propio spec.
- **Sí:** dos migraciones en orden (rooms con seed, luego children con FK). Cada paso deja el sistema funcional y el historial refleja la dependencia.
- **No:** una sola migración con todo. Mezcla dos tablas y el seed en un paso no commiteable por partes.
- **Sí:** `createChild` como Server Action con el server client por request y `getClaims()`. Patrón de SPEC 10 vía Context7.
- **Sí:** definición con preguntas en dos bloques. Sin atajo.
- **Nota de fecha:** el contexto de sesión traía la fecha vacía, así que se usa la fecha del sistema (2026-10-08) para el header.

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| El seed no encuentra `Guardería Sala Soles` por nombre distinto | El insert la busca por nombre exacto y `on conflict do nothing` lo hace reejecutable; verificar con SELECT tras el push. |
| `room_id` huérfano si se borra una sala | FK con `ON DELETE RESTRICT` bloquea el borrado de salas con niños. |
| Insert desde la app falla por RLS | La policy `INSERT` para `authenticated` va en la misma migración; probar el alta con sesión `fernando@google.com`. |
| Mapeo de alergias con pérdida (texto libre → tags) | Diccionario mínimo documentado más fallback en minúsculas; el texto original no se conserva, queda registrado aquí. |
| Selector vacío si `rooms` no tiene filas | Estado de error en español en el modal; el push de rooms con seed es paso previo obligatorio. |
| Conflicto entre `CLASSROOM_LABELS` y salas de DB | La fuente de verdad del select pasa a ser `public.rooms`; el enum local solo queda para validación hasta un spec futuro. |

## What is **not** in this spec

- Perfil real del niño por id.
- Editar niño con escritura en DB.
- Vínculo padre-hijo real (`parent_children`, `invitations`).
- Trigger en `auth.users`, trigger de `updated_at` y policies por dueño o por guardería.
- Reemplazo de `feed-mock`, Storage de fotos y realtime.
- Resto de tablas del diccionario.

Cada uno de esos, si llega, va en su propio spec.
