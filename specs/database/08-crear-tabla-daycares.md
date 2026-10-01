# SPEC 08 — Tabla daycares

> **Status:** Implemented
> **Depends on:** ninguna
> **Date:** 2026-09-28
> **Objective:** Crear la tabla `public.daycares` con dirección y cuatro filas en el proyecto Supabase remoto con una migración versionada en el repo y RLS que deja leer solo a `authenticated`.

## Scope

**In:**

- Inicializar `supabase/` en el repo (`supabase init`) y enlazar el proyecto `qsmqaljvnhnbodiktriw`.
- Marcar como reverted el historial remoto `20260928080507` y `20260928080713`. No reejecuta SQL.
- Crear el archivo con `supabase migration new create_daycares` y aplicar ese mismo archivo con `supabase db push`.
- Tabla `public.daycares`: `id uuid` PK `gen_random_uuid()`, `name text not null`, `address text not null`, `created_at timestamptz not null default now()`.
- RLS con lectura autenticada y escritura cerrada: `enable row level security`, `revoke all` a `anon` y `authenticated`, `grant select` a `authenticated` y una sola policy `SELECT` para `authenticated`. Cero policies de `INSERT`, `UPDATE` o `DELETE`.
- Seed de cuatro filas con `Guardería Sala Soles` incluida.

**Out of scope (for future specs):**

- `users`, `rooms`, `children` y el resto del diccionario.
- Filtro por guardería. Requiere `users` y aún no existe.
- `updated_at`, `UNIQUE` en `name`, cliente `@supabase/supabase-js` y cambios en `app/` o `lib/`.
- Copiar al repo el SQL de la prueba. Stack local de Docker.

## Data model

```sql
create table public.daycares (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  created_at timestamptz not null default now()
);

alter table public.daycares enable row level security;

revoke all on table public.daycares from anon, authenticated;
grant select on table public.daycares to authenticated;

create policy daycares_select_authenticated
on public.daycares
for select
to authenticated
using (true);

insert into public.daycares (name, address) values
  ('Guardería Sala Soles', 'Calle Los Pinos 120'),
  ('Guardería Arcoíris', 'Av. Central 45'),
  ('Guardería Pequeños Pasos', 'Calle Jardín 8'),
  ('Guardería Nube', 'Boulevard Norte 22');
```

Identificadores en inglés y en minúsculas. Sin `UNIQUE` en `name`. El `insert` corre como `postgres` en la migración y no depende de las policies. `service_role` sigue escribiendo porque ignora RLS.

## Implementation plan

1. Confirmar el CLI con `supabase --version`. Si no está en el PATH, instalarlo fuera de `package.json` y leer flags con `--help`.
2. `supabase init` en la raíz. No commitear `.env` ni `supabase/.temp`.
3. `supabase link` al project ref `qsmqaljvnhnbodiktriw`, password desde `.env` local. `migration list` debe mostrar las dos versiones de prueba solo en remoto.
4. `supabase migration repair --status reverted` sobre `20260928080507` y `20260928080713`. `list_tables` de `public` sigue vacío.
5. `supabase migration new create_daycares` y escribir el SQL de arriba en el archivo generado. No inventar el timestamp.
6. `supabase db push` (antes `--dry-run` si `--help` lo muestra). El version remoto debe coincidir con el nombre del archivo.

## Acceptance criteria

- [x] Existe un solo archivo nuevo `supabase/migrations/<timestamp>_create_daycares.sql` creado por `migration new`.
- [x] El SQL crea solo `public.daycares` con `id`, `name`, `address` y `created_at`, habilita RLS, revoca `all` a `anon` y `authenticated`, otorga `select` a `authenticated` e inserta las cuatro filas.
- [x] El historial remoto no contiene `create_prueba_test_table` ni `drop_prueba_test_table`.
- [x] El historial remoto tiene una migración `create_daycares` cuyo version es el timestamp del archivo local.
- [x] `public` solo tiene `daycares`, con RLS activo, una sola policy `SELECT` para `authenticated`, cero policies de escritura y `anon` sin `SELECT`.
- [x] `daycares` tiene exactamente cuatro filas con esos nombres y direcciones, incluida `Guardería Sala Soles`.
- [x] No hay cambios en `app/`, `lib/` ni `@supabase/supabase-js` en `package.json`. `.env` no se commitea.

## Decisions

- **Sí:** migraciones imperativas (`migration new` + `db push`) para que git y el historial remoto compartan version.
- **No:** `apply_migration` del MCP como vía de escritura. Genera un version distinto al archivo local.
- **Sí:** limpiar el historial de la prueba con `repair --status reverted`.
- **No:** reconstruir esos SQL en el repo.
- **Sí:** lectura autenticada y escritura cerrada. `SELECT` solo para `authenticated` en todas las filas; sin policies de escritura para `anon` ni `authenticated`.
- **No:** lectura y escritura autenticadas. Cualquier logueado escribiendo todas las guarderías no es restringido.
- **No:** API cerrada con policies que niegan todo. Igual de cerrado que cero policies, pero con más SQL.
- **Sí:** `address text not null` en la tabla y en las cuatro filas.
- **Sí:** `Guardería Sala Soles` en singular, igual que `BrandPanel`, login y el diccionario.
- **No:** `Salas Soles`, distinto de la UI.
- **Sí:** esas cuatro direcciones: Calle Los Pinos 120, Av. Central 45, Calle Jardín 8, Boulevard Norte 22.
- **No:** `updated_at`, `UNIQUE` en `name`, UUIDv7, filtro por guardería ni stack local.
- **Sí:** definición con preguntas. No hubo atajo.

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| El CLI no está instalado o `link` pide login | Instalar el CLI y usar la password de `.env`. No seguir si `migration list` no muestra el remoto. |
| `db push` falla por historial desfasado | No pushear hasta que `repair` haya quitado las dos versiones de prueba. |
| Los defaults de `public` otorgan `ALL` a `anon` y `authenticated` | El `revoke all` va en la misma migración, antes del `grant select`. |
| El seed falla por RLS | No aplica. El `insert` corre como `postgres` dentro de la migración. |

## What is **not** in this spec

- El resto de tablas del diccionario.
- Filtro por guardería, policies de escritura y el cliente de la app.
- Conservar en git las migraciones de prueba.

Cada uno de esos, si llega, va en su propio spec.
