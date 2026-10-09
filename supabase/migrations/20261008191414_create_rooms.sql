create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  daycare_id uuid not null references public.daycares(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (daycare_id, name)
);

alter table public.rooms enable row level security;

revoke all on table public.rooms from anon, authenticated;
grant select on table public.rooms to authenticated;

create policy rooms_select_authenticated
on public.rooms
for select
to authenticated
using (true);

insert into public.rooms (daycare_id, name)
select d.id, s.name
from (select id from public.daycares where name = 'Guardería Sala Soles') as d
cross join (values ('Soles'), ('Lunas'), ('Estrellas')) as s(name)
on conflict (daycare_id, name) do nothing;
