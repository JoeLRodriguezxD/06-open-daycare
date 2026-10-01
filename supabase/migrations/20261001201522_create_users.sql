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
