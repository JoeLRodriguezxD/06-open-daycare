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

alter table public.children enable row level security;

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
