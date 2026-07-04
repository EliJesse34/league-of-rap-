
create table public.livestreams (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null,
  title text not null,
  category text not null default 'music',
  youtube_id text,
  thumbnail_url text,
  viewer_count integer not null default 0,
  is_live boolean not null default true,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

alter table public.livestreams enable row level security;

create policy "livestreams_read_all" on public.livestreams
  for select using (true);

create policy "livestreams_insert_own" on public.livestreams
  for insert with check (auth.uid() = host_id);

create policy "livestreams_update_own" on public.livestreams
  for update using (auth.uid() = host_id);

create policy "livestreams_delete_own" on public.livestreams
  for delete using (auth.uid() = host_id);

create index livestreams_is_live_idx on public.livestreams (is_live, started_at desc);

alter publication supabase_realtime add table public.livestreams;
