
-- Extend conversations for groups
alter table public.conversations
  add column if not exists is_group boolean not null default false,
  add column if not exists name text,
  add column if not exists description text,
  add column if not exists owner_id uuid;

-- Helper: is user owner of a group conversation
create or replace function public.is_conversation_owner(_conv uuid, _user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.conversations
    where id = _conv and owner_id = _user and is_group = true
  )
$$;

-- Group join requests
create table if not exists public.group_join_requests (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  user_id uuid not null,
  status text not null default 'pending', -- pending | approved | rejected
  message text,
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid,
  unique (conversation_id, user_id)
);

alter table public.group_join_requests enable row level security;

-- Anyone authenticated can request to join
create policy "gjr_insert_self"
on public.group_join_requests for insert
to authenticated
with check (auth.uid() = user_id and status = 'pending');

-- Requester can see own requests; group owner can see all requests for their group
create policy "gjr_select_self_or_owner"
on public.group_join_requests for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_conversation_owner(conversation_id, auth.uid())
);

-- Owner can update (approve/reject); requester can cancel (delete via update? we'll allow update by owner only)
create policy "gjr_update_owner"
on public.group_join_requests for update
to authenticated
using (public.is_conversation_owner(conversation_id, auth.uid()));

create policy "gjr_delete_self_or_owner"
on public.group_join_requests for delete
to authenticated
using (user_id = auth.uid() or public.is_conversation_owner(conversation_id, auth.uid()));

-- Tighten participant insert policy
drop policy if exists cp_insert_auth on public.conversation_participants;

create policy "cp_insert_smart"
on public.conversation_participants for insert
to authenticated
with check (
  auth.uid() is not null
  and (
    -- DM (non-group): anyone authenticated can add participants when creating
    not exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.is_group = true
    )
    or
    -- Group: only owner can add members
    public.is_conversation_owner(conversation_id, auth.uid())
    or
    -- Group: user can add themselves only if they have an approved request
    (user_id = auth.uid() and exists (
      select 1 from public.group_join_requests r
      where r.conversation_id = conversation_id
        and r.user_id = auth.uid()
        and r.status = 'approved'
    ))
  )
);

-- Allow group members to leave
create policy "cp_delete_self_or_owner"
on public.conversation_participants for delete
to authenticated
using (
  user_id = auth.uid()
  or public.is_conversation_owner(conversation_id, auth.uid())
);

-- Allow conversations to be updated by owner (for group metadata)
create policy "conversations_update_owner"
on public.conversations for update
to authenticated
using (
  (is_group = true and owner_id = auth.uid())
  or (is_group = false and public.is_conversation_participant(id, auth.uid()))
);

-- Public discoverability for groups (so users can browse and request to join)
drop policy if exists conversations_select_participant on public.conversations;
create policy "conversations_select_member_or_group"
on public.conversations for select
to authenticated
using (
  is_group = true
  or public.is_conversation_participant(id, auth.uid())
);

-- Approve / reject helpers
create or replace function public.approve_group_request(_request_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  select * into r from public.group_join_requests where id = _request_id;
  if r is null then raise exception 'Request not found'; end if;
  if not public.is_conversation_owner(r.conversation_id, auth.uid()) then
    raise exception 'Not allowed';
  end if;
  update public.group_join_requests
    set status = 'approved', decided_at = now(), decided_by = auth.uid()
    where id = _request_id;
  insert into public.conversation_participants (conversation_id, user_id)
    values (r.conversation_id, r.user_id)
    on conflict do nothing;
end;
$$;

create or replace function public.reject_group_request(_request_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  select * into r from public.group_join_requests where id = _request_id;
  if r is null then raise exception 'Request not found'; end if;
  if not public.is_conversation_owner(r.conversation_id, auth.uid()) then
    raise exception 'Not allowed';
  end if;
  update public.group_join_requests
    set status = 'rejected', decided_at = now(), decided_by = auth.uid()
    where id = _request_id;
end;
$$;

-- Realtime
alter publication supabase_realtime add table public.group_join_requests;
