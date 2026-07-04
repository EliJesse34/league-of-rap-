-- Seed a demo auth user, producer profile, beats, and licenses for local/dev
-- This migration is safe to run multiple times (uses ON CONFLICT DO NOTHING)

-- 1) Insert a demo auth user if none with email 'demo@local' exists.
insert into auth.users (id, aud, role, email, email_confirmed_at, raw_user_meta_data, created_at)
select
  '11111111-1111-1111-1111-111111111111'::uuid,
  'authenticated',
  'authenticated',
  'demo@local',
  now(),
  jsonb_build_object('display_name', 'Demo Producer'),
  now()
where not exists (select 1 from auth.users where email = 'demo@local');

-- 2) Ensure a producer_profiles row exists for that user (or use first auth user as fallback)
with demo_user as (
  (
    select id from auth.users where email = 'demo@local' limit 1
  )
  union
  (
    select id from auth.users limit 1
  )
)
insert into public.producer_profiles (id, display_name, bio, is_verified)
select id, 'Demo Producer', 'A demo producer for local testing', true from demo_user d
on conflict (id) do update set display_name = excluded.display_name, is_verified = true;

-- 3) Insert demo beats using the demo_user (or first user) as producer
with p as (
  (
    select id from auth.users where email = 'demo@local' limit 1
  )
  union
  (
    select id from auth.users limit 1
  )
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
    ARRAY['lofi','jazz','smooth'],
    14.99,
    'published',
    856,
    143,
    8
  from p
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
    ARRAY['drill','dark','urban'],
    24.99,
    'published',
    2103,
    267,
    34
  from p
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
    ARRAY['boombap','soul','vinyl'],
    17.99,
    'published',
    1534,
    198,
    21
  from p
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
    ARRAY['afrobeats','percussion','groove'],
    22.99,
    'published',
    945,
    156,
    15
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440006'::uuid,
    p.id,
    'Urban Sunrise',
    'Bright hip-hop instrumental with warm keys and a driving groove.',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    95,
    'D minor',
    'hip-hop',
    'uplifting',
    ARRAY['hiphop','sunrise','melodic'],
    19.99,
    'published',
    720,
    90,
    12
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440007'::uuid,
    p.id,
    'Golden Era',
    'Vintage boom bap drums with soulful piano and vinyl crackle.',
    'https://images.unsplash.com/photo-1517511620798-cec17d428bc0?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    88,
    'A minor',
    'boom-bap',
    'nostalgic',
    ARRAY['boom-bap','soul','classic'],
    16.99,
    'published',
    1320,
    204,
    19
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440008'::uuid,
    p.id,
    'Space Trap',
    'Hard-hitting trap beat with atmospheric synths and booming 808s.',
    'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    140,
    'C minor',
    'trap',
    'moody',
    ARRAY['trap','808','space'],
    21.99,
    'published',
    1800,
    276,
    31
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440009'::uuid,
    p.id,
    'Soulful Keys',
    'Moody R&B beat with lush chords and smooth bass.',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    72,
    'B flat major',
    'r&b',
    'smooth',
    ARRAY['r&b','soul','chill'],
    18.99,
    'published',
    980,
    172,
    14
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440010'::uuid,
    p.id,
    'Night Shift',
    'Dark east coast beat with eerie strings and hard drums.',
    'https://images.unsplash.com/photo-1522083165193-5df2c6f5b3ae?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    92,
    'G minor',
    'hip-hop',
    'gritty',
    ARRAY['eastcoast','drums','dark'],
    15.99,
    'published',
    1140,
    162,
    18
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440011'::uuid,
    p.id,
    'Retro Bounce',
    'Funky boom bap groove with bright horns and punchy drums.',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    99,
    'C major',
    'boom-bap',
    'funky',
    ARRAY['boom-bap','funk','groove'],
    17.49,
    'published',
    1060,
    189,
    22
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440012'::uuid,
    p.id,
    'City Lights',
    'Modern trap beat with melodic guitar and emotional chord progressions.',
    'https://images.unsplash.com/photo-1494891848038-7b4c3a5d5b04?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    130,
    'B minor',
    'trap',
    'emotional',
    ARRAY['trap','melodic','guitar'],
    23.99,
    'published',
    1325,
    245,
    29
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440013'::uuid,
    p.id,
    'Hustle Mode',
    'Energetic hip-hop beat designed for punchy verses and bold hooks.',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    128,
    'D minor',
    'hip-hop',
    'motivational',
    ARRAY['hustle','drill','energy'],
    19.49,
    'published',
    1650,
    325,
    27
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440014'::uuid,
    p.id,
    'Moonlit Rhymes',
    'Late-night beat with mellow keys and a hypnotic bassline.',
    'https://images.unsplash.com/photo-1517511620798-cec17d428bc0?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    84,
    'E minor',
    'lo-fi',
    'mellow',
    ARRAY['lofi','midnight','groove'],
    16.49,
    'published',
    1120,
    181,
    20
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440015'::uuid,
    p.id,
    '808 Anthem',
    'Hard trap anthem with deep 808s and aggressive percussion.',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    142,
    'F minor',
    'trap',
    'hard',
    ARRAY['trap','808','anthem'],
    25.99,
    'published',
    2210,
    365,
    39
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440016'::uuid,
    p.id,
    'Neon Drive',
    'Synthwave-inspired hip-hop beat with a polished melodic touch.',
    'https://images.unsplash.com/photo-1557728240-3d2019539566?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    120,
    'A minor',
    'hip-hop',
    'vibrant',
    ARRAY['synth','neon','melodic'],
    20.49,
    'published',
    1350,
    240,
    26
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440017'::uuid,
    p.id,
    'Gated Soul',
    'Soulful R&B beat with plucked guitar and gated percussion.',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    78,
    'D major',
    'r&b',
    'smooth',
    ARRAY['r&b','guitar','soul'],
    18.49,
    'published',
    920,
    130,
    13
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440018'::uuid,
    p.id,
    'Street Sermon',
    'Raw hip-hop beat with a punchy kick and sermon-style vocal chops.',
    'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    85,
    'F minor',
    'hip-hop',
    'raw',
    ARRAY['street','raw','boom-bap'],
    16.99,
    'published',
    1475,
    188,
    25
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440019'::uuid,
    p.id,
    'Sleepy Loops',
    'Dreamy lo-fi melody with a warm vinyl texture.',
    'https://images.unsplash.com/photo-1522083165193-5df2c6f5b3ae?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    76,
    'C major',
    'lo-fi',
    'dreamy',
    ARRAY['lofi','warm','vinyl'],
    15.49,
    'published',
    1010,
    155,
    17
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440020'::uuid,
    p.id,
    'Championship',
    'High-energy trap beat with stadium-style synths and booming drums.',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    138,
    'B minor',
    'trap',
    'anthemic',
    ARRAY['stadium','trap','anthem'],
    26.99,
    'published',
    1900,
    310,
    34
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440021'::uuid,
    p.id,
    'Cinematic Hustle',
    'Orchestral hip-hop beat with dramatic strings and hard percussion.',
    'https://images.unsplash.com/photo-1494891848038-7b4c3a5d5b04?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    115,
    'E minor',
    'hip-hop',
    'cinematic',
    ARRAY['cinematic','strings','drama'],
    21.99,
    'published',
    1320,
    220,
    28
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440022'::uuid,
    p.id,
    'Rainy Day',
    'Wet piano loops over dusty drums for late-night storytelling.',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    80,
    'G minor',
    'lo-fi',
    'moody',
    ARRAY['rain','piano','dark'],
    15.99,
    'published',
    1125,
    175,
    16
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440023'::uuid,
    p.id,
    'Diamond Cut',
    'Polished trap beat with crisp hi-hats and glimmering synth stabs.',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    128,
    'C minor',
    'trap',
    'clean',
    ARRAY['trap','clean','hi-hats'],
    22.49,
    'published',
    1480,
    228,
    29
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440024'::uuid,
    p.id,
    'Downtown',
    'Punchy hip-hop beat with a city rhythm and tight percussion.',
    'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    98,
    'D minor',
    'hip-hop',
    'urban',
    ARRAY['city','rhythm','percussion'],
    18.99,
    'published',
    1225,
    190,
    24
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440025'::uuid,
    p.id,
    'Vintage Vibe',
    'Retro jazz-rap beat with mellow bass and dusty vinyl textures.',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    94,
    'F major',
    'boom-bap',
    'vintage',
    ARRAY['jazz','vintage','smooth'],
    17.49,
    'published',
    1155,
    175,
    18
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440026'::uuid,
    p.id,
    'After Hours',
    'Late-night R&B beat with silky keys and a gentle groove.',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    82,
    'A major',
    'r&b',
    'smooth',
    ARRAY['r&b','late-night','silky'],
    18.99,
    'published',
    1080,
    159,
    14
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440027'::uuid,
    p.id,
    'Pixelated Dreams',
    'Futuristic melodic beat built for creative rap flows.',
    'https://images.unsplash.com/photo-1557728240-3d2019539566?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    122,
    'F minor',
    'hip-hop',
    'dreamy',
    ARRAY['future','melodic','creative'],
    20.99,
    'published',
    1405,
    215,
    26
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440028'::uuid,
    p.id,
    'Grime City',
    'Dirty UK grime-inspired beat with off-kilter percussion.',
    'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    145,
    'G minor',
    'drill',
    'gritty',
    ARRAY['grime','drill','urban'],
    23.49,
    'published',
    1700,
    295,
    33
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440029'::uuid,
    p.id,
    'Quiet Storm',
    'Soft R&B ballad with emotive piano and ambient atmosphere.',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    70,
    'E major',
    'r&b',
    'emotional',
    ARRAY['piano','ambient','serene'],
    19.49,
    'published',
    900,
    125,
    12
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440030'::uuid,
    p.id,
    'Break the Silence',
    'Bold hip-hop beat with wide chords and a breakbeat rhythm.',
    'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    108,
    'A minor',
    'hip-hop',
    'bold',
    ARRAY['breakbeat','hiphop','bold'],
    19.49,
    'published',
    1300,
    210,
    25
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440031'::uuid,
    p.id,
    'Neon Nights',
    'Electro-tinged trap beat with bright synth arps and tight drums.',
    'https://images.unsplash.com/photo-1557728240-3d2019539566?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    125,
    'B minor',
    'trap',
    'electric',
    ARRAY['synth','trap','electric'],
    22.99,
    'published',
    1500,
    260,
    31
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440032'::uuid,
    p.id,
    'Mind Maze',
    'Head-nodding beat with dusty jazz loops and cinematic tension.',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    90,
    'D minor',
    'hip-hop',
    'mysterious',
    ARRAY['jazz','cinematic','dusty'],
    18.49,
    'published',
    1180,
    178,
    21
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440033'::uuid,
    p.id,
    'Gold Dust',
    'Rich boom bap beat with crisp cymbals and soulful horns.',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    97,
    'Bb major',
    'boom-bap',
    'soulful',
    ARRAY['horns','soul','classic'],
    18.99,
    'published',
    1380,
    205,
    24
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440034'::uuid,
    p.id,
    'Lucid Flow',
    'Vaporwave-inspired beat with floating synths and mellow drums.',
    'https://images.unsplash.com/photo-1557728240-3d2019539566?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    82,
    'E minor',
    'hip-hop',
    'airy',
    ARRAY['vaporwave','synth','chill'],
    17.99,
    'published',
    1280,
    190,
    22
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440035'::uuid,
    p.id,
    'Rain City',
    'Brooding beat with wet pads and atmospheric rain textures.',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    86,
    'G minor',
    'lo-fi',
    'ambient',
    ARRAY['rain','ambient','mist'],
    15.99,
    'published',
    980,
    145,
    16
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440036'::uuid,
    p.id,
    'Champ Street',
    'Underground street beat with piercing hi-hats and a deep bassline.',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    108,
    'F minor',
    'hip-hop',
    'street',
    ARRAY['street','bass','hard'],
    19.99,
    'published',
    1510,
    237,
    29
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440037'::uuid,
    p.id,
    'Ocean Pulse',
    'Flowing trap beat with oceanic pads and snappy percussion.',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    118,
    'A minor',
    'trap',
    'fluid',
    ARRAY['ocean','trap','pads'],
    21.49,
    'published',
    1390,
    255,
    27
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440038'::uuid,
    p.id,
    'Echo Chamber',
    'Dark atmospheric beat with reverb-soaked keys and punchy kicks.',
    'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    92,
    'D minor',
    'hip-hop',
    'atmospheric',
    ARRAY['echo','dark','mood'],
    18.99,
    'published',
    1185,
    175,
    21
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440039'::uuid,
    p.id,
    'Streetlight Serenade',
    'Soulful night-time beat with soft piano and bass.',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    84,
    'C minor',
    'r&b',
    'smooth',
    ARRAY['piano','serenade','night'],
    17.49,
    'published',
    980,
    155,
    14
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440040'::uuid,
    p.id,
    'West Coast Chill',
    'Laid-back west coast beat with warm chords and mellow drums.',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    96,
    'Bb major',
    'hip-hop',
    'chill',
    ARRAY['westcoast','smooth','laidback'],
    18.99,
    'published',
    1200,
    186,
    20
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440041'::uuid,
    p.id,
    'Lavender Haze',
    'Dreamy beat with lush keys and sweeping synth pads.',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    110,
    'F major',
    'hip-hop',
    'dreamy',
    ARRAY['synth','dreamy','lush'],
    21.49,
    'published',
    1350,
    232,
    28
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440042'::uuid,
    p.id,
    'Golden Hours',
    'Uplifting hip-hop loop with bright guitar and soulful brass.',
    'https://images.unsplash.com/photo-1517511620798-cec17d428bc0?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    104,
    'E major',
    'hip-hop',
    'uplifting',
    ARRAY['guitar','brass','uplift'],
    20.99,
    'published',
    1230,
    210,
    25
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440043'::uuid,
    p.id,
    'Thunder Beats',
    'Powerful trap beat with cinematic hits and low-end energy.',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    132,
    'F minor',
    'trap',
    'powerful',
    ARRAY['cinematic','trap','power'],
    24.99,
    'published',
    1820,
    300,
    36
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440044'::uuid,
    p.id,
    'Velvet Waves',
    'Smooth R&B beat with lush chords and a floating groove.',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    76,
    'A major',
    'r&b',
    'silky',
    ARRAY['velvet','smooth','groove'],
    19.99,
    'published',
    1050,
    168,
    15
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440045'::uuid,
    p.id,
    'Outrun',
    'Retro synth beat with fast drums and neon energy.',
    'https://images.unsplash.com/photo-1557728240-3d2019539566?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    128,
    'E minor',
    'hip-hop',
    'retrowave',
    ARRAY['retro','synth','fast'],
    22.49,
    'published',
    1580,
    240,
    30
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440046'::uuid,
    p.id,
    'Smoky Lounge',
    'A moody beat with smoky sax and vintage ambiance.',
    'https://images.unsplash.com/photo-1517511620798-cec17d428bc0?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    86,
    'D minor',
    'r&b',
    'moody',
    ARRAY['sax','vintage','smoky'],
    17.99,
    'published',
    960,
    150,
    14
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440047'::uuid,
    p.id,
    'City Shadows',
    'Minimal urban beat with a dark bass groove and subtle piano.',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    101,
    'C minor',
    'hip-hop',
    'shadowy',
    ARRAY['minimal','bass','dark'],
    18.49,
    'published',
    1420,
    198,
    22
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440048'::uuid,
    p.id,
    'Glow',
    'Soft trap beat with glowing synths and a mellow pulse.',
    'https://images.unsplash.com/photo-1557728240-3d2019539566?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    120,
    'B major',
    'trap',
    'glowing',
    ARRAY['glow','synth','mellow'],
    21.49,
    'published',
    1540,
    242,
    28
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440049'::uuid,
    p.id,
    'Soul Haze',
    'Warm R&B beat with mellow keys and soulful textures.',
    'https://images.unsplash.com/photo-1517511620798-cec17d428bc0?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    74,
    'E major',
    'r&b',
    'warm',
    ARRAY['soul','warm','keys'],
    18.49,
    'published',
    990,
    155,
    15
  from p
  union all select
    '650e8400-e29b-41d4-a716-446655440050'::uuid,
    p.id,
    'Thunder Rush',
    'Aggressive trap beat with thunderous percussion and bold synths.',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=500&fit=crop',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    136,
    'G minor',
    'trap',
    'aggressive',
    ARRAY['thunder','trap','bold'],
    25.49,
    'published',
    1770,
    310,
    35
  from p
  on conflict (id) do nothing
  returning id, title, base_price
)
-- 4) Add licenses for the seeded beats
insert into public.beat_licenses (beat_id, license_type, name, price, terms, is_exclusive)
select b.id, 'mp3_lease', 'MP3 Lease', b.base_price, 'Non-exclusive, unlimited streams', false from beats b
on conflict do nothing;
