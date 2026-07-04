-- Seed sample beats for testing the marketplace
-- These beats are linked to demo producer accounts

-- Use the first authenticated user as a sample producer. If no auth users exist, no sample beats are inserted.
-- Insert sample beats using the first authenticated user as the producer.
-- If no auth user exists, this seed will insert zero rows instead of failing.
with sample_producer as (
  select id from auth.users limit 1
), beats as (
  insert into public.beats (
    id, producer_id, title, description, cover_url, preview_url,
    bpm, music_key, genre, mood, tags, base_price, status,
    plays_count, likes_count, purchases_count
  )
  select
    '650e8400-e29b-41d4-a716-446655440002'::uuid,
    p.id,
    'Midnight Vibes',
    'Smooth lo-fi hip-hop beat with jazz chords and a laid-back groove.',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    90,
    'F major',
    'lo-fi',
    'chill',
    ARRAY['lofi', 'jazz', 'smooth'],
    14.99,
    'published',
    856,
    143,
    8
  from sample_producer p
  union all select
    '650e8400-e29b-41d4-a716-446655440003'::uuid,
    p.id,
    'Drill Flow',
    'Dark and menacing drill beat with rapid hi-hats and deep 808s.',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    160,
    'A minor',
    'drill',
    'dark',
    ARRAY['drill', 'dark', 'urban'],
    24.99,
    'published',
    2103,
    267,
    34
  from sample_producer p
  union all select
    '650e8400-e29b-41d4-a716-446655440004'::uuid,
    p.id,
    'Boom Bap Classic',
    'Classic boom-bap beat with vinyl crackle, dusty drums, and soulful samples.',
    'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    95,
    'G major',
    'boom-bap',
    'soulful',
    ARRAY['boombap', 'soul', 'vinyl'],
    17.99,
    'published',
    1534,
    198,
    21
  from sample_producer p
  union all select
    '650e8400-e29b-41d4-a716-446655440005'::uuid,
    p.id,
    'Afrobeats Anthem',
    'Infectious afrobeats production with percussive elements and groovy bassline.',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    108,
    'E major',
    'afrobeats',
    'energetic',
    ARRAY['afrobeats', 'percussion', 'groove'],
    22.99,
    'published',
    945,
    156,
    15
  from sample_producer p
  on conflict (id) do nothing
  returning id, title
)
insert into public.beat_licenses (beat_id, license_type, name, price, terms, is_exclusive)
select b.id, 'mp3_lease', 'MP3 Lease', 14.99, 'Non-exclusive, up to 5000 streams', false from beats b where b.title = 'Midnight Vibes'
union all
select b.id, 'wav_lease', 'WAV Lease', 39.99, 'Non-exclusive, unlimited streams, WAV quality', false from beats b where b.title = 'Midnight Vibes'
union all
select b.id, 'mp3_lease', 'MP3 Lease', 24.99, 'Non-exclusive, up to 5000 streams', false from beats b where b.title = 'Drill Flow'
union all
select b.id, 'wav_lease', 'WAV Lease', 59.99, 'Non-exclusive, unlimited streams, WAV quality', false from beats b where b.title = 'Drill Flow'
union all
select b.id, 'trackout', 'Trackout', 79.99, 'Separated stems for remixing', false from beats b where b.title = 'Drill Flow'
union all
select b.id, 'mp3_lease', 'MP3 Lease', 17.99, 'Non-exclusive, up to 5000 streams', false from beats b where b.title = 'Boom Bap Classic'
union all
select b.id, 'wav_lease', 'WAV Lease', 44.99, 'Non-exclusive, unlimited streams, WAV quality', false from beats b where b.title = 'Boom Bap Classic'
union all
select b.id, 'mp3_lease', 'MP3 Lease', 22.99, 'Non-exclusive, up to 5000 streams', false from beats b where b.title = 'Afrobeats Anthem'
union all
select b.id, 'wav_lease', 'WAV Lease', 54.99, 'Non-exclusive, unlimited streams, WAV quality', false from beats b where b.title = 'Afrobeats Anthem'
union all
select b.id, 'exclusive', 'Exclusive', 249.99, 'Exclusive rights, all platforms', true from beats b where b.title = 'Afrobeats Anthem'
on conflict do nothing;

