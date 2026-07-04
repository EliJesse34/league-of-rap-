
-- =========================
-- PRODUCER PROFILES
-- =========================
create table public.producer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  bio text,
  banner_url text,
  payout_email text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.producer_profiles enable row level security;

create policy "producer_profiles_read_all" on public.producer_profiles for select using (true);
create policy "producer_profiles_insert_own" on public.producer_profiles for insert with check (auth.uid() = id);
create policy "producer_profiles_update_own" on public.producer_profiles for update using (auth.uid() = id);

-- =========================
-- PRODUCER SUBSCRIPTIONS
-- =========================
create table public.producer_subscriptions (
  id uuid primary key default gen_random_uuid(),
  producer_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'producer_pro',
  status text not null default 'active', -- active | canceled | past_due
  current_period_end timestamptz,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.producer_subscriptions(producer_id);
alter table public.producer_subscriptions enable row level security;

create policy "ps_read_own" on public.producer_subscriptions for select using (auth.uid() = producer_id);
create policy "ps_insert_own" on public.producer_subscriptions for insert with check (auth.uid() = producer_id);
create policy "ps_update_own" on public.producer_subscriptions for update using (auth.uid() = producer_id);

-- Helper: has active producer subscription
create or replace function public.has_active_producer_sub(_user uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.producer_subscriptions
    where producer_id = _user
      and status = 'active'
      and (current_period_end is null or current_period_end > now())
  )
$$;

-- =========================
-- BEATS
-- =========================
create table public.beats (
  id uuid primary key default gen_random_uuid(),
  producer_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  cover_url text,
  preview_url text, -- public watermarked preview (mp3)
  audio_path text,  -- private path in beat-audio bucket
  bpm integer,
  music_key text,
  genre text not null default 'hip-hop',
  mood text,
  tags text[] not null default '{}',
  base_price numeric(10,2) not null default 19.99,
  status text not null default 'published', -- draft | published | removed
  plays_count integer not null default 0,
  likes_count integer not null default 0,
  purchases_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.beats(producer_id);
create index on public.beats(genre);
create index on public.beats(created_at desc);
alter table public.beats enable row level security;

create policy "beats_read_published_or_own"
  on public.beats for select
  using (status = 'published' or auth.uid() = producer_id);
create policy "beats_insert_subscribed_producer"
  on public.beats for insert
  with check (auth.uid() = producer_id and public.has_active_producer_sub(auth.uid()));
create policy "beats_update_own" on public.beats for update using (auth.uid() = producer_id);
create policy "beats_delete_own" on public.beats for delete using (auth.uid() = producer_id);

-- =========================
-- BEAT LICENSES
-- =========================
create table public.beat_licenses (
  id uuid primary key default gen_random_uuid(),
  beat_id uuid not null references public.beats(id) on delete cascade,
  license_type text not null, -- mp3_lease | wav_lease | trackout | exclusive
  name text not null,
  price numeric(10,2) not null,
  terms text,
  is_exclusive boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.beat_licenses(beat_id);
alter table public.beat_licenses enable row level security;

create policy "bl_read_all" on public.beat_licenses for select using (true);
create policy "bl_insert_producer"
  on public.beat_licenses for insert
  with check (exists (select 1 from public.beats b where b.id = beat_id and b.producer_id = auth.uid()));
create policy "bl_update_producer"
  on public.beat_licenses for update
  using (exists (select 1 from public.beats b where b.id = beat_id and b.producer_id = auth.uid()));
create policy "bl_delete_producer"
  on public.beat_licenses for delete
  using (exists (select 1 from public.beats b where b.id = beat_id and b.producer_id = auth.uid()));

-- =========================
-- BEAT PURCHASES
-- =========================
create table public.beat_purchases (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users(id) on delete cascade,
  beat_id uuid not null references public.beats(id) on delete cascade,
  license_id uuid references public.beat_licenses(id) on delete set null,
  license_type text not null,
  amount numeric(10,2) not null,
  currency text not null default 'usd',
  stripe_session_id text,
  status text not null default 'pending', -- pending | completed | refunded
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index on public.beat_purchases(buyer_id);
create index on public.beat_purchases(beat_id);
alter table public.beat_purchases enable row level security;

create policy "bp_read_own_or_producer" on public.beat_purchases for select
  using (
    auth.uid() = buyer_id
    or exists (select 1 from public.beats b where b.id = beat_id and b.producer_id = auth.uid())
  );
create policy "bp_insert_own" on public.beat_purchases for insert with check (auth.uid() = buyer_id);
create policy "bp_update_own" on public.beat_purchases for update using (auth.uid() = buyer_id);

-- Helper: has user purchased beat (any completed)
create or replace function public.has_purchased_beat(_user uuid, _beat uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.beat_purchases
    where buyer_id = _user and beat_id = _beat and status = 'completed'
  )
$$;

-- =========================
-- LIKES & PLAYS
-- =========================
create table public.beat_likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  beat_id uuid not null references public.beats(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, beat_id)
);
alter table public.beat_likes enable row level security;
create policy "blk_read_all" on public.beat_likes for select using (true);
create policy "blk_insert_own" on public.beat_likes for insert with check (auth.uid() = user_id);
create policy "blk_delete_own" on public.beat_likes for delete using (auth.uid() = user_id);

create table public.beat_plays (
  id uuid primary key default gen_random_uuid(),
  beat_id uuid not null references public.beats(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index on public.beat_plays(beat_id);
alter table public.beat_plays enable row level security;
create policy "bpl_read_own_or_producer" on public.beat_plays for select using (
  auth.uid() = user_id
  or exists (select 1 from public.beats b where b.id = beat_id and b.producer_id = auth.uid())
);
create policy "bpl_insert_any" on public.beat_plays for insert with check (true);

-- =========================
-- PLAYLISTS (beats + videos)
-- =========================
create table public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  is_public boolean not null default false,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.playlists(user_id);
alter table public.playlists enable row level security;
create policy "pl_read_own_or_public" on public.playlists for select using (auth.uid() = user_id or is_public = true);
create policy "pl_insert_own" on public.playlists for insert with check (auth.uid() = user_id);
create policy "pl_update_own" on public.playlists for update using (auth.uid() = user_id);
create policy "pl_delete_own" on public.playlists for delete using (auth.uid() = user_id);

create table public.playlist_items (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  item_type text not null, -- 'beat' | 'video'
  beat_id uuid references public.beats(id) on delete cascade,
  video_id uuid references public.videos(id) on delete cascade,
  position integer not null default 0,
  added_at timestamptz not null default now()
);
create index on public.playlist_items(playlist_id);
alter table public.playlist_items enable row level security;
create policy "pli_read_via_playlist" on public.playlist_items for select using (
  exists (select 1 from public.playlists p where p.id = playlist_id and (p.user_id = auth.uid() or p.is_public = true))
);
create policy "pli_insert_own" on public.playlist_items for insert with check (
  exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid())
);
create policy "pli_delete_own" on public.playlist_items for delete using (
  exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid())
);

-- =========================
-- WATCH LATER & RECENTLY PLAYED
-- =========================
create table public.watch_later (
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (user_id, video_id)
);
alter table public.watch_later enable row level security;
create policy "wl_read_own" on public.watch_later for select using (auth.uid() = user_id);
create policy "wl_insert_own" on public.watch_later for insert with check (auth.uid() = user_id);
create policy "wl_delete_own" on public.watch_later for delete using (auth.uid() = user_id);

create table public.recently_played (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null,
  beat_id uuid references public.beats(id) on delete cascade,
  video_id uuid references public.videos(id) on delete cascade,
  played_at timestamptz not null default now()
);
create index on public.recently_played(user_id, played_at desc);
alter table public.recently_played enable row level security;
create policy "rp_read_own" on public.recently_played for select using (auth.uid() = user_id);
create policy "rp_insert_own" on public.recently_played for insert with check (auth.uid() = user_id);
create policy "rp_delete_own" on public.recently_played for delete using (auth.uid() = user_id);

-- =========================
-- STORAGE BUCKETS
-- =========================
insert into storage.buckets (id, name, public) values
  ('beat-covers', 'beat-covers', true),
  ('beat-previews', 'beat-previews', true),
  ('beat-audio', 'beat-audio', false)
on conflict (id) do nothing;

-- Public read for covers & previews
create policy "beat_covers_public_read" on storage.objects for select using (bucket_id = 'beat-covers');
create policy "beat_previews_public_read" on storage.objects for select using (bucket_id = 'beat-previews');

-- Producers upload to their own folder
create policy "beat_covers_producer_upload" on storage.objects for insert with check (
  bucket_id = 'beat-covers' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "beat_previews_producer_upload" on storage.objects for insert with check (
  bucket_id = 'beat-previews' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "beat_audio_producer_upload" on storage.objects for insert with check (
  bucket_id = 'beat-audio' and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "beat_covers_producer_update" on storage.objects for update using (
  bucket_id = 'beat-covers' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "beat_previews_producer_update" on storage.objects for update using (
  bucket_id = 'beat-previews' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "beat_audio_producer_update" on storage.objects for update using (
  bucket_id = 'beat-audio' and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "beat_covers_producer_delete" on storage.objects for delete using (
  bucket_id = 'beat-covers' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "beat_audio_producer_delete" on storage.objects for delete using (
  bucket_id = 'beat-audio' and auth.uid()::text = (storage.foldername(name))[1]
);

-- beat-audio download: signed URLs only via server fn; no direct SELECT policy for clients
-- (only producer & buyer can read via server fn using service role)

-- timestamps trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger touch_producer_profiles before update on public.producer_profiles for each row execute function public.touch_updated_at();
create trigger touch_beats before update on public.beats for each row execute function public.touch_updated_at();
create trigger touch_playlists before update on public.playlists for each row execute function public.touch_updated_at();
create trigger touch_producer_subs before update on public.producer_subscriptions for each row execute function public.touch_updated_at();
