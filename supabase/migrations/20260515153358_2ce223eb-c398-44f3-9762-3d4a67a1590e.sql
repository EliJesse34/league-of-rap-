
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_read_all" on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- Videos (curated YouTube)
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  youtube_id text not null unique,
  title text not null,
  creator text not null,
  category text not null default 'music',
  is_short boolean not null default false,
  is_featured boolean not null default false,
  duration text,
  views_count int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.videos enable row level security;
create policy "videos_read_all" on public.videos for select using (true);

-- Comments
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index on public.comments (video_id, created_at desc);
alter table public.comments enable row level security;
create policy "comments_read_all" on public.comments for select using (true);
create policy "comments_insert_auth" on public.comments for insert with check (auth.uid() = user_id);
create policy "comments_update_own" on public.comments for update using (auth.uid() = user_id);
create policy "comments_delete_own" on public.comments for delete using (auth.uid() = user_id);

-- Likes
create table public.likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, video_id)
);
alter table public.likes enable row level security;
create policy "likes_read_all" on public.likes for select using (true);
create policy "likes_insert_own" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_delete_own" on public.likes for delete using (auth.uid() = user_id);

-- Conversations
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);
alter table public.conversations enable row level security;

create table public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);
alter table public.conversation_participants enable row level security;

-- Security definer to avoid recursive RLS
create or replace function public.is_conversation_participant(_conv uuid, _user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.conversation_participants
    where conversation_id = _conv and user_id = _user
  )
$$;

create policy "conversations_select_participant" on public.conversations
  for select using (public.is_conversation_participant(id, auth.uid()));
create policy "conversations_insert_auth" on public.conversations
  for insert with check (auth.uid() is not null);

create policy "cp_select_self_or_member" on public.conversation_participants
  for select using (user_id = auth.uid() or public.is_conversation_participant(conversation_id, auth.uid()));
create policy "cp_insert_auth" on public.conversation_participants
  for insert with check (auth.uid() is not null);

-- Messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (length(content) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index on public.messages (conversation_id, created_at);
alter table public.messages enable row level security;
create policy "messages_select_participant" on public.messages
  for select using (public.is_conversation_participant(conversation_id, auth.uid()));
create policy "messages_insert_participant" on public.messages
  for insert with check (sender_id = auth.uid() and public.is_conversation_participant(conversation_id, auth.uid()));

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base text;
  candidate text;
  n int := 0;
begin
  base := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1), 'user'), '[^a-z0-9_]', '', 'g'));
  if base = '' or base is null then base := 'user'; end if;
  candidate := base;
  while exists(select 1 from public.profiles where username = candidate) loop
    n := n + 1;
    candidate := base || n::text;
  end loop;
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    candidate,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', candidate),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Realtime
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.conversations;
