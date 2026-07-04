-- Seed some example videos (YouTube) for development
insert into public.videos (youtube_id, title, creator, duration, views_count, created_at, is_short, is_featured)
values
  ('dQw4w9WgXcQ', 'League of Rap — Promo Mix', 'League of Rap', '3:33', 123456, '2026-05-01T12:00:00Z', false, true),
  ('3JZ_D3ELwOQ', 'Top Battle Rap Moments', 'League of Rap', '5:12', 54321, '2026-04-15T12:00:00Z', false, false),
  ('kXYiU_JCYtU', 'Producer Spotlight — Beat Tour', 'League of Rap', '4:02', 87654, '2026-03-20T12:00:00Z', false, false)
on conflict (youtube_id) do nothing;

-- Note: these are development seeds only. Remove or adapt for production.
