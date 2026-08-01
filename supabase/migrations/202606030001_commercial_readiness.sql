create type public.commercial_plan_id as enum ('start', 'live', 'pro', 'concierge');
create type public.commercial_subscription_status as enum ('lead', 'pending_payment', 'active', 'expired', 'cancelled');
create type public.sales_lead_status as enum ('new', 'contacted', 'qualified', 'won', 'lost');

alter table public.weddings
  add column if not exists plan_id public.commercial_plan_id not null default 'live',
  add column if not exists owner_email text,
  add column if not exists public_url text,
  add column if not exists storage_limit_mb integer not null default 10240,
  add column if not exists video_limit_minutes integer not null default 30,
  add column if not exists expires_at timestamptz,
  add column if not exists privacy_level text not null default 'public'
    check (privacy_level in ('public', 'wedding_code', 'invite_only'));

create table if not exists public.commercial_plans (
  id public.commercial_plan_id primary key,
  name text not null,
  price_pln integer not null check (price_pln >= 0),
  storage_limit_mb integer not null check (storage_limit_mb >= 0),
  video_limit_minutes integer not null check (video_limit_minutes >= 0),
  wedding_months integer not null check (wedding_months > 0),
  features jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.wedding_subscriptions (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  plan_id public.commercial_plan_id not null references public.commercial_plans(id),
  status public.commercial_subscription_status not null default 'lead',
  amount_pln integer not null check (amount_pln >= 0),
  payment_provider text,
  payment_reference text,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales_leads (
  id uuid primary key default gen_random_uuid(),
  couple_names text not null,
  email text not null,
  phone text,
  wedding_date date,
  source text,
  preferred_plan_id public.commercial_plan_id not null default 'live',
  preferred_slug text,
  message text,
  status public.sales_lead_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wedding_usage_snapshots (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  storage_used_mb integer not null default 0,
  photos_count integer not null default 0,
  videos_count integer not null default 0,
  documents_count integer not null default 0,
  guests_count integer not null default 0,
  captured_at timestamptz not null default now()
);

create table if not exists public.wedding_onboarding_steps (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  step_key text not null,
  label text not null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (wedding_id, step_key)
);

create index if not exists wedding_subscriptions_wedding_id_idx on public.wedding_subscriptions(wedding_id);
create index if not exists sales_leads_status_created_at_idx on public.sales_leads(status, created_at desc);
create index if not exists wedding_usage_snapshots_wedding_id_idx on public.wedding_usage_snapshots(wedding_id, captured_at desc);
create index if not exists wedding_onboarding_steps_wedding_id_idx on public.wedding_onboarding_steps(wedding_id);

drop trigger if exists set_wedding_subscriptions_updated_at on public.wedding_subscriptions;
create trigger set_wedding_subscriptions_updated_at
before update on public.wedding_subscriptions
for each row execute function public.set_updated_at();

drop trigger if exists set_sales_leads_updated_at on public.sales_leads;
create trigger set_sales_leads_updated_at
before update on public.sales_leads
for each row execute function public.set_updated_at();

alter table public.commercial_plans enable row level security;
alter table public.wedding_subscriptions enable row level security;
alter table public.sales_leads enable row level security;
alter table public.wedding_usage_snapshots enable row level security;
alter table public.wedding_onboarding_steps enable row level security;

create policy "Commercial plans are public"
on public.commercial_plans
for select
using (is_active = true);

create policy "Wedding admins can read subscriptions"
on public.wedding_subscriptions
for select
using (public.is_wedding_admin(wedding_id));

create policy "Wedding admins can read usage"
on public.wedding_usage_snapshots
for select
using (public.is_wedding_admin(wedding_id));

create policy "Wedding admins can manage onboarding"
on public.wedding_onboarding_steps
for all
using (public.is_wedding_admin(wedding_id))
with check (public.is_wedding_admin(wedding_id));

create policy "Anyone can create sales leads"
on public.sales_leads
for insert
with check (true);

insert into public.commercial_plans (id, name, price_pln, storage_limit_mb, video_limit_minutes, wedding_months, features)
values
  ('start', 'Start', 199, 0, 0, 12, '["Strona weselna", "Harmonogram", "Lokalizacje", "FAQ", "RSVP", "Kod QR"]'::jsonb),
  ('live', 'Wesele Live', 349, 10240, 30, 12, '["Upload zdjec i wideo", "Galeria gosci", "Pokaz slajdow", "Ksiega gosci", "QR do druku"]'::jsonb),
  ('pro', 'Organizer Pro', 599, 25600, 90, 18, '["Plan stolow", "Mapa sali", "Planner organizacyjny", "Umowy", "Zaliczki", "Dokumenty"]'::jsonb),
  ('concierge', 'Concierge', 1200, 51200, 180, 24, '["Konfiguracja", "Import gosci", "Przygotowanie QR", "Priorytetowy support"]'::jsonb)
on conflict (id) do update set
  name = excluded.name,
  price_pln = excluded.price_pln,
  storage_limit_mb = excluded.storage_limit_mb,
  video_limit_minutes = excluded.video_limit_minutes,
  wedding_months = excluded.wedding_months,
  features = excluded.features;
