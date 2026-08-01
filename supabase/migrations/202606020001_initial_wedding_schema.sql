create extension if not exists pgcrypto;

create type public.rsvp_status as enum ('pending', 'accepted', 'declined');
create type public.guest_age_group as enum ('adult', 'teen', 'child', 'infant');
create type public.announcement_tone as enum ('info', 'important', 'success');

create table public.weddings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  couple_names text not null,
  wedding_date date not null,
  ceremony_time time not null,
  reception_time time not null,
  ceremony_location text not null,
  reception_location text not null,
  hero_message text,
  rsvp_deadline date,
  contact_email text,
  contact_phone text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wedding_admins (
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (wedding_id, user_id)
);

create table public.households (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  invite_code text not null,
  contact_email text,
  contact_phone text,
  address text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (wedding_id, invite_code)
);

create table public.seating_tables (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  table_number integer not null,
  name text not null,
  capacity integer not null check (capacity > 0),
  description text,
  created_at timestamptz not null default now(),
  unique (wedding_id, table_number)
);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  household_id uuid references public.households(id) on delete set null,
  seating_table_id uuid references public.seating_tables(id) on delete set null,
  first_name text not null,
  last_name text not null,
  display_name text generated always as (trim(first_name || ' ' || last_name)) stored,
  age_group public.guest_age_group not null default 'adult',
  is_plus_one boolean not null default false,
  rsvp_status public.rsvp_status not null default 'pending',
  meal_preference text,
  dietary_notes text,
  song_request text,
  message_to_couple text,
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.schedule_items (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz,
  title text not null,
  location text,
  description text,
  sort_order integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  question text not null,
  answer text not null,
  category text,
  sort_order integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  title text not null,
  body text not null,
  tone public.announcement_tone not null default 'info',
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  author_name text not null,
  message text not null,
  photo_url text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index households_wedding_id_idx on public.households(wedding_id);
create index seating_tables_wedding_id_idx on public.seating_tables(wedding_id);
create index guests_wedding_id_idx on public.guests(wedding_id);
create index guests_household_id_idx on public.guests(household_id);
create index guests_seating_table_id_idx on public.guests(seating_table_id);
create index schedule_items_wedding_id_starts_at_idx on public.schedule_items(wedding_id, starts_at);
create index faq_items_wedding_id_sort_order_idx on public.faq_items(wedding_id, sort_order);
create index announcements_wedding_id_published_at_idx on public.announcements(wedding_id, published_at);
create index guestbook_entries_wedding_id_created_at_idx on public.guestbook_entries(wedding_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_weddings_updated_at
before update on public.weddings
for each row execute function public.set_updated_at();

create trigger set_households_updated_at
before update on public.households
for each row execute function public.set_updated_at();

create trigger set_guests_updated_at
before update on public.guests
for each row execute function public.set_updated_at();

create or replace function public.is_wedding_admin(target_wedding_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.wedding_admins wa
    where wa.wedding_id = target_wedding_id
      and wa.user_id = auth.uid()
  );
$$;

create or replace function public.is_wedding_published(target_wedding_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.weddings w
    where w.id = target_wedding_id
      and w.is_published = true
  );
$$;

alter table public.weddings enable row level security;
alter table public.wedding_admins enable row level security;
alter table public.households enable row level security;
alter table public.seating_tables enable row level security;
alter table public.guests enable row level security;
alter table public.schedule_items enable row level security;
alter table public.faq_items enable row level security;
alter table public.announcements enable row level security;
alter table public.guestbook_entries enable row level security;

create policy "Published weddings are readable"
on public.weddings for select
using (is_published = true or public.is_wedding_admin(id));

create policy "Wedding admins manage weddings"
on public.weddings for all
using (public.is_wedding_admin(id))
with check (public.is_wedding_admin(id));

create policy "Admins can read their admin memberships"
on public.wedding_admins for select
using (user_id = auth.uid() or public.is_wedding_admin(wedding_id));

create policy "Admins manage admin memberships"
on public.wedding_admins for all
using (public.is_wedding_admin(wedding_id))
with check (public.is_wedding_admin(wedding_id));

create policy "Admins manage households"
on public.households for all
using (public.is_wedding_admin(wedding_id))
with check (public.is_wedding_admin(wedding_id));

create policy "Admins manage seating tables"
on public.seating_tables for all
using (public.is_wedding_admin(wedding_id))
with check (public.is_wedding_admin(wedding_id));

create policy "Published seating tables are readable"
on public.seating_tables for select
using (public.is_wedding_published(wedding_id) or public.is_wedding_admin(wedding_id));

create policy "Admins manage guests"
on public.guests for all
using (public.is_wedding_admin(wedding_id))
with check (public.is_wedding_admin(wedding_id));

create policy "Published schedule is readable"
on public.schedule_items for select
using ((is_public and public.is_wedding_published(wedding_id)) or public.is_wedding_admin(wedding_id));

create policy "Admins manage schedule"
on public.schedule_items for all
using (public.is_wedding_admin(wedding_id))
with check (public.is_wedding_admin(wedding_id));

create policy "Published FAQ is readable"
on public.faq_items for select
using ((is_public and public.is_wedding_published(wedding_id)) or public.is_wedding_admin(wedding_id));

create policy "Admins manage FAQ"
on public.faq_items for all
using (public.is_wedding_admin(wedding_id))
with check (public.is_wedding_admin(wedding_id));

create policy "Published announcements are readable"
on public.announcements for select
using (
  public.is_wedding_published(wedding_id)
  and published_at is not null
  and published_at <= now()
  and (expires_at is null or expires_at > now())
);

create policy "Admins manage announcements"
on public.announcements for all
using (public.is_wedding_admin(wedding_id))
with check (public.is_wedding_admin(wedding_id));

create policy "Approved guestbook entries are readable"
on public.guestbook_entries for select
using ((is_approved and public.is_wedding_published(wedding_id)) or public.is_wedding_admin(wedding_id));

create policy "Anyone can add guestbook entries for published weddings"
on public.guestbook_entries for insert
with check (public.is_wedding_published(wedding_id) and is_approved = false);

create policy "Admins manage guestbook entries"
on public.guestbook_entries for all
using (public.is_wedding_admin(wedding_id))
with check (public.is_wedding_admin(wedding_id));
