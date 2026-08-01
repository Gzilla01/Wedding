create table if not exists public.app_superadmins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_app_superadmin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.app_superadmins admin
    where admin.user_id = auth.uid()
  );
$$;

create policy "Superadmins can read sales leads"
on public.sales_leads
for select
using (public.is_app_superadmin());

create policy "Superadmins can update sales leads"
on public.sales_leads
for update
using (public.is_app_superadmin())
with check (public.is_app_superadmin());

create policy "Superadmins can read all subscriptions"
on public.wedding_subscriptions
for select
using (public.is_app_superadmin());

create policy "Superadmins can read all usage"
on public.wedding_usage_snapshots
for select
using (public.is_app_superadmin());

create policy "Superadmins can manage commercial plans"
on public.commercial_plans
for all
using (public.is_app_superadmin())
with check (public.is_app_superadmin());
