-- =========================
-- CONTACT SETTINGS
-- =========================
create table public.contact_settings (
  id uuid primary key default gen_random_uuid(),
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  contact_description text,
  contact_image_url text,
  location text,
  google_maps_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Only one contact settings record should exist
create unique index on public.contact_settings ((1));

alter table public.contact_settings enable row level security;

create policy "contact_settings_read_all" on public.contact_settings for select using (true);
create policy "contact_settings_update_admin" on public.contact_settings for update using (
  -- In a real app, check if user is admin. For now, restrict updates to admin role
  auth.jwt() ->> 'role' = 'authenticated' and auth.uid() in (
    select id from auth.users where email in (select unnest(string_to_array(current_setting('app.admin_emails', true), ',')) as email)
  )
);

-- =========================
-- CONTACT SOCIAL LINKS
-- =========================
create table public.contact_social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null, -- facebook, instagram, twitter, tiktok, youtube, linkedin, whatsapp
  url text not null,
  is_enabled boolean not null default true,
  display_order integer not null default 0,
  icon_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(platform)
);

create index on public.contact_social_links(platform);
create index on public.contact_social_links(display_order);

alter table public.contact_social_links enable row level security;

create policy "contact_social_links_read_all" on public.contact_social_links for select using (true);
create policy "contact_social_links_update_admin" on public.contact_social_links for update using (
  auth.jwt() ->> 'role' = 'authenticated' and auth.uid() in (
    select id from auth.users where email in (select unnest(string_to_array(current_setting('app.admin_emails', true), ',')) as email)
  )
);
create policy "contact_social_links_insert_admin" on public.contact_social_links for insert with check (
  auth.jwt() ->> 'role' = 'authenticated' and auth.uid() in (
    select id from auth.users where email in (select unnest(string_to_array(current_setting('app.admin_emails', true), ',')) as email)
  )
);
create policy "contact_social_links_delete_admin" on public.contact_social_links for delete using (
  auth.jwt() ->> 'role' = 'authenticated' and auth.uid() in (
    select id from auth.users where email in (select unnest(string_to_array(current_setting('app.admin_emails', true), ',')) as email)
  )
);

-- Trigger to populate `icon_name` from `platform` since DEFAULT cannot reference other columns
create function public.contact_social_links_set_icon() returns trigger as $$
begin
  if new.icon_name is null or new.icon_name = '' then
    new.icon_name := lower(new.platform);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger contact_social_links_set_icon_trg
  before insert or update on public.contact_social_links
  for each row
  execute function public.contact_social_links_set_icon();

-- =========================
-- CONTACT SUBMISSIONS
-- =========================
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  is_read boolean not null default false,
  is_spam boolean not null default false,
  replied_at timestamptz,
  reply_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on public.contact_submissions(email);
create index on public.contact_submissions(created_at desc);
create index on public.contact_submissions(is_read);
create index on public.contact_submissions(is_spam);

alter table public.contact_submissions enable row level security;

create policy "contact_submissions_read_all" on public.contact_submissions for select using (
  -- Allow admins to read, and users to read their own submissions
  auth.jwt() ->> 'role' = 'authenticated' and auth.uid() in (
    select id from auth.users where email in (select unnest(string_to_array(current_setting('app.admin_emails', true), ',')) as email)
  )
);
create policy "contact_submissions_insert_any" on public.contact_submissions for insert with check (true);
create policy "contact_submissions_update_admin" on public.contact_submissions for update using (
  auth.jwt() ->> 'role' = 'authenticated' and auth.uid() in (
    select id from auth.users where email in (select unnest(string_to_array(current_setting('app.admin_emails', true), ',')) as email)
  )
);
create policy "contact_submissions_delete_admin" on public.contact_submissions for delete using (
  auth.jwt() ->> 'role' = 'authenticated' and auth.uid() in (
    select id from auth.users where email in (select unnest(string_to_array(current_setting('app.admin_emails', true), ',')) as email)
  )
);

-- Insert default social links
insert into public.contact_social_links (platform, url, is_enabled, display_order, icon_name) values
  ('facebook', 'https://web.facebook.com/LeagueofRapofficial?_rdc=1&_rdr#', true, 1, 'facebook'),
  ('instagram', 'https://www.instagram.com/leagueofrap.com_official?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr', true, 2, 'instagram'),
  ('twitter', '', true, 3, 'twitter'),
  ('tiktok', '', true, 4, 'tiktok'),
  ('youtube', '', true, 5, 'youtube'),
  ('linkedin', '', true, 6, 'linkedin'),
  ('whatsapp', '', true, 7, 'whatsapp')
on conflict (platform) do nothing;
