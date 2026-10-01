# SPEC 09 — Tabla users

> **Status:** Approved
> **Depends on:** SPEC 08
> **Date:** 2026-10-01
> **Objective:** Crear los enums `user_role` y `user_status` y la tabla `public.users` con FK opcional a `daycares` en el proyecto Supabase remoto con una migración versionada en el repo y RLS que deja leer solo a `authenticated`.

## Scope

**In:**

- Crear con `supabase migration new create_users` un solo archivo `supabase/migrations/<timestamp>_create_users.sql` y aplicarlo con `supabase db push`.
- Crear los enums `user_role` (`staff`, `parent`, `admin`) y `user_status` (`pending`, `active`).
- Crear la tabla `public.users`: `id uuid` PK con default `gen_random_uuid()` y FK a `auth.users(id)` con `ON DELETE CASCADE`, `daycare_id uuid` nullable con FK a `public.daycares(id)` con `ON DELETE SET NULL`, `role user_role not null` sin default, `status user_status not null default 'active'`, `full_name text not null`, `avatar_url text` nullable, `notify_on_post boolean not null default true`, `daily_summary_enabled boolean not null default true`, `created_at` / `updated_at timestamptz not null default now()`.
- RLS con lectura autenticada y escritura cerrada: `enable row level security`, `revoke all` a `anon` y `authenticated`, `grant select` a `authenticated` y una sola policy `SELECT` para `authenticated`. Cero policies de `INSERT`, `UPDATE` o `DELETE`.
- Alta manual del usuario staff de pruebas `joel@google.com` (auth + fila `public.users` con `role staff` ligada a `Guardería Sala Soles`). Sin seed en la migración.

**Out of scope (for future specs):**

- Trigger `AFTER INSERT` en `auth.users` con función `SECURITY DEFINER` y `raw_user_meta_data`.
- `rooms`, `children`, `parent_children` y el resto del diccionario.
- Policies por dueño (`auth.uid() = id`), policies de escritura y filtro por guardería.
- Trigger de auto-update de `updated_at`, `UNIQUE` adicionales y cliente `@supabase/supabase-js`.
- Cambios en `app/` o `lib/`.

## Data model

```sql
create type user_role as enum ('staff', 'parent', 'admin');
create type user_status as enum ('pending', 'active');

create table public.users (
  id uuid primary key default gen_random_uuid()
    references auth.users(id) on delete cascade,
  daycare_id uuid references public.daycares(id) on delete set null,
  role user_role not null,
  status user_status not null default 'active',
  full_name text not null,
  avatar_url text,
  notify_on_post boolean not null default true,
  daily_summary_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

revoke all on table public.users from anon, authenticated;
grant select on table public.users to authenticated;

create policy users_select_authenticated
on public.users
for select
to authenticated
using (true);
```

Identificadores en inglés y en minúsculas. `daycare_id` nullable para respetar "un usuario puede tener un daycare". `role` sin default para exigirlo siempre. Sin `UNIQUE` extra. El `revoke` va en la misma migración, antes del `grant`. `service_role` sigue escribiendo porque ignora RLS. El staff de pruebas no va en la migración: su `auth.users` se crea por Dashboard/API y su fila `public.users` se inserta manual con `service_role` usando el UUID del `auth.users` y el `daycare_id` de `Guardería Sala Soles`. La password nunca se escribe en el repo.

## Implementation plan

1. Confirmar el CLI con `supabase --version` y el enlace con `supabase migration list` al project ref `qsmqaljvnhnbodiktriw`. No seguir si el remoto no responde.
2. `supabase migration new create_users` en la raíz. No inventar el timestamp.
3. Escribir el SQL de arriba en el archivo generado. No crear otros enums ni otras tablas.
4. `supabase db push` (antes `--dry-run` si `--help` lo muestra). El version remoto debe coincidir con el nombre del archivo.
5. Crear el `auth.users` del staff por Dashboard `Authentication > Add user` con email autoconfirmado. Password solo tecleada en local, nunca commiteada.
6. Insertar su fila `public.users` con `service_role` (SQL Editor o cliente con `service_role`): `id` igual al UUID del `auth.users`, `daycare_id` de `Guardería Sala Soles`, `role 'staff'`, `status 'active'`, `full_name 'Joel'`.
7. Verificar solo con MCP en lectura (`list_tables`, `execute_sql` SELECT, `get_advisors`) más login manual del staff.

## Acceptance criteria

- [ ] Existe un solo archivo nuevo `supabase/migrations/<timestamp>_create_users.sql` creado por `migration new`.
- [ ] El SQL crea solo los tipos `user_role` con `staff`, `parent`, `admin` y `user_status` con `pending`, `active`.
- [ ] El SQL crea solo `public.users` con `id`, `daycare_id`, `role`, `status`, `full_name`, `avatar_url`, `notify_on_post`, `daily_summary_enabled`, `created_at` y `updated_at`.
- [ ] `role` es `NOT NULL` sin default y `status` tiene default `active`.
- [ ] `daycare_id` es nullable con FK a `public.daycares(id)` y `ON DELETE SET NULL`.
- [ ] `id` tiene default `gen_random_uuid()` y FK a `auth.users(id)` con `ON DELETE CASCADE`.
- [ ] `public.users` tiene RLS activo, una sola policy `SELECT` para `authenticated`, cero policies de escritura y `anon` sin `SELECT`.
- [ ] La migración deja `public.users` con cero filas; el staff llega por alta manual posterior, no por seed.
- [ ] El staff `joel@google.com` existe en `auth.users` y tiene fila en `public.users` con `role staff`, `status active` y `daycare` Sala Soles.
- [ ] El historial remoto tiene una migración `create_users` cuyo version es el timestamp del archivo local.
- [ ] No hay passwords ni secretos en `specs/`, migraciones o git.
- [ ] No hay cambios en `app/`, `lib/` ni `@supabase/supabase-js` en `package.json`. `.env` no se commitea.

## Decisions

- **Sí:** solo `user_role` y `user_status`. Son los únicos que usa `users`.
- **No:** crear los 6 enums del diccionario. El resto va en el spec de su tabla.
- **Sí:** `daycare_id` nullable con `ON DELETE SET NULL`. Respeta "puede tener" y no bloquea inserts sin guardería.
- **No:** `NOT NULL` con `CASCADE` o `RESTRICT`. Uno borra usuarios al borrar la guardería y el otro bloquea el borrado.
- **No:** trigger `auth.users` en este spec. Decisión explícita; el alta del staff es manual con `service_role`.
- **Sí:** `id` con default `gen_random_uuid()`. Permite inserts manuales mientras no hay trigger.
- **No:** trigger de `updated_at`. Solo default `now()` para no añadir funciones en este paso.
- **Sí:** RLS cerrado como SPEC 08. Solo `SELECT` para `authenticated`, sin escrituras.
- **No:** policies por dueño. Más real pero más SQL; va en futuro spec.
- **Sí:** staff ligado a `Guardería Sala Soles` con `full_name Joel`, `role staff`, `status active`.
- **Sí:** password fuera del repo. Solo se teclea en local/Dashboard.
- **Sí:** definición con preguntas. No hubo atajo.

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| La FK a `auth.users(id)` falla en el remoto | No pushear si el esquema `auth` no es visible; existe en todo proyecto Supabase. |
| Reejecutar la migración duplica los enums | Los `create type` van una sola vez en esta migración; no copiar a otra. |
| Los defaults de `public` otorgan `ALL` a `anon` y `authenticated` | El `revoke all` va en la misma migración, antes del `grant select`. |
| Sin trigger, recrear el `auth.users` deja la fila huérfana o duplicada | Repetir el paso manual completo; la FK `CASCADE` borra la fila `public` al borrar el `auth.users`. |
| Escribir `public.users` con cliente `authenticated` falla | Esperado: no hay policies de escritura; el alta manual usa `service_role`. |

## What is **not** in this spec

- El trigger de `auth.users` y la función `SECURITY DEFINER`.
- El resto de tablas del diccionario.
- Policies por dueño, policies de escritura y filtro por guardería.
- Seed en la migración y cliente de la app.

Cada uno de esos, si llega, va en su propio spec.
