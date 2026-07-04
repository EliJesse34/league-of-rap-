#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const key = process.env.YT_API_KEY || process.argv[2];
if (!key) {
  console.error('Usage: set YT_API_KEY env var or pass API key as first arg');
  process.exit(1);
}

function sqlEscape(s) {
  return String(s).replace(/'/g, "''");
}

function isoDurationToReadable(d) {
  // simple ISO 8601 parser to mm:ss or H:MM:SS
  // examples: PT3M33S, PT1H2M3S
  const match = d.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const h = parseInt(match[1] || 0, 10);
  const m = parseInt(match[2] || 0, 10);
  const s = parseInt(match[3] || 0, 10);
  if (h) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

async function main() {
  console.log('Fetching top hip-hop videos from YouTube...');
  const q = encodeURIComponent('hip hop');
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=${q}&maxResults=50&key=${key}`;
  const searchData = await fetchJson(searchUrl);
  const items = searchData.items || [];
  if (items.length === 0) {
    console.error('No videos found from search');
    process.exit(1);
  }

  const ids = items.map((it) => it.id.videoId).filter(Boolean);
  const idsParam = ids.join(',');
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${idsParam}&key=${key}`;
  const videosData = await fetchJson(videosUrl);
  const vidMap = new Map((videosData.items || []).map((v) => [v.id, v]));

  const rows = items.map((it) => {
    const id = it.id.videoId;
    const snippet = it.snippet || {};
    const v = vidMap.get(id) || {};
    const duration = v.contentDetails ? isoDurationToReadable(v.contentDetails.duration) : null;
    const views = v.statistics ? Number(v.statistics.viewCount || 0) : 0;
    return {
      youtube_id: id,
      title: snippet.title || 'Untitled',
      creator: snippet.channelTitle || 'Unknown',
      duration,
      views_count: views,
      created_at: snippet.publishedAt || new Date().toISOString(),
    };
  });

  const fileName = '20260601050000_seed_50_real_hiphop_videos.sql';
  const outPath = path.join(process.cwd(), 'supabase', 'migrations', fileName);
  const values = rows.map((r) => {
    return `  ('${sqlEscape(r.youtube_id)}', '${sqlEscape(r.title)}', '${sqlEscape(r.creator)}', 'hiphop', false, ${r.duration ? `'${sqlEscape(r.duration)}'` : 'null'}, ${Number(r.views_count || 0)}, '${r.created_at}')`;
  }).join(',\n');

  const sql = `-- Auto-generated seed of 50 hip-hop videos\ninsert into public.videos (youtube_id, title, creator, category, is_short, duration, views_count, created_at) values\n${values}\non conflict (youtube_id) do nothing;\n`;

  fs.writeFileSync(outPath, sql, 'utf8');
  console.log('Wrote SQL migration to', outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
