create table if not exists public.wedding_admin_snapshots (
  wedding_id uuid primary key references public.weddings(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.wedding_media_uploads (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  author_name text,
  caption text,
  file_path text not null,
  file_name text not null,
  file_type text not null,
  file_size_bytes bigint not null check (file_size_bytes > 0),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.song_requests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  title text not null,
  votes integer not null default 0 check (votes >= 0),
  created_at timestamptz not null default now()
);

create index if not exists wedding_media_uploads_wedding_id_created_at_idx
on public.wedding_media_uploads(wedding_id, created_at desc);

create index if not exists song_requests_wedding_id_created_at_idx
on public.song_requests(wedding_id, created_at desc);

alter table public.wedding_admin_snapshots enable row level security;
alter table public.wedding_media_uploads enable row level security;
alter table public.song_requests enable row level security;

create policy "Admins manage admin snapshots"
on public.wedding_admin_snapshots
for all
using (public.is_wedding_admin(wedding_id) or public.is_app_superadmin())
with check (public.is_wedding_admin(wedding_id) or public.is_app_superadmin());

create policy "Admins manage media uploads"
on public.wedding_media_uploads
for all
using (public.is_wedding_admin(wedding_id) or public.is_app_superadmin())
with check (public.is_wedding_admin(wedding_id) or public.is_app_superadmin());

create policy "Approved media uploads are readable"
on public.wedding_media_uploads
for select
using ((status = 'approved' and public.is_wedding_published(wedding_id)) or public.is_wedding_admin(wedding_id) or public.is_app_superadmin());

create policy "Anyone can add media for published weddings"
on public.wedding_media_uploads
for insert
with check (public.is_wedding_published(wedding_id) and status = 'pending');

create policy "Song requests are readable for published weddings"
on public.song_requests
for select
using (public.is_wedding_published(wedding_id) or public.is_wedding_admin(wedding_id) or public.is_app_superadmin());

create policy "Anyone can add song requests for published weddings"
on public.song_requests
for insert
with check (public.is_wedding_published(wedding_id));

create policy "Admins manage song requests"
on public.song_requests
for all
using (public.is_wedding_admin(wedding_id) or public.is_app_superadmin())
with check (public.is_wedding_admin(wedding_id) or public.is_app_superadmin());
