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
