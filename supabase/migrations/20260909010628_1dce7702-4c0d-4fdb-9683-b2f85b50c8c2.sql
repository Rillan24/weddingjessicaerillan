-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "Users can read own roles"
on public.user_roles for select to authenticated
using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- First registered account becomes the couple's admin
create or replace function public.handle_new_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_role on auth.users;
create trigger on_auth_user_created_role
after insert on auth.users
for each row execute function public.handle_new_user_role();

-- RSVPS: admin-only read/update/delete
drop policy if exists "Authenticated can read rsvps" on public.rsvps;
drop policy if exists "Authenticated can update rsvps" on public.rsvps;
drop policy if exists "Authenticated can delete rsvps" on public.rsvps;

create policy "Admins can read rsvps"
on public.rsvps for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update rsvps"
on public.rsvps for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete rsvps"
on public.rsvps for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- GIFTS: admin-only management
drop policy if exists "Authenticated can insert gifts" on public.gifts;
drop policy if exists "Authenticated can update gifts" on public.gifts;
drop policy if exists "Authenticated can delete gifts" on public.gifts;

create policy "Admins can insert gifts"
on public.gifts for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update gifts"
on public.gifts for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete gifts"
on public.gifts for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Hide claimant identity from public visitors via column-level grants
revoke select on public.gifts from anon, authenticated;
grant select (id, title, description, price, image_url, sort_order, claimed_at, created_at)
  on public.gifts to anon, authenticated;
grant select (claimed_by) on public.gifts to service_role;

revoke update on public.gifts from anon;
grant update (claimed_by, claimed_at) on public.gifts to anon, authenticated;
grant insert, delete on public.gifts to authenticated;
grant all on public.gifts to service_role;
