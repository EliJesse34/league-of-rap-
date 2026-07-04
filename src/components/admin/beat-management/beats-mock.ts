export type BeatStatus = "Published" | "Hidden" | "Archived";
export type BeatPriceType = "Free" | "Premium";

export interface BeatRecord {
  id: number;
  title: string;
  producer: string;
  description: string;
  genre: string;
  mood: string;
  bpm: number;
  key: string;
  duration: string;
  priceType: BeatPriceType;
  price: number;
  license: string;
  coverArt: string;
  streams: number;
  downloads: number;
  sales: number;
  revenue: number;
  featured: boolean;
  pinned: boolean;
  status: BeatStatus;
  uploadDate: string;
  tags: string[];
  previewUrl?: string;
}

const genres = ["Boom Bap", "Trap", "Plugg", "Lofi", "Afro", "Drill"];
const moods = ["Dark", "Confident", "Melancholic", "Chill", "Energetic"];
const keys = ["Am", "C#", "Em", "F", "G", "Dm"];
const licenses = ["Exclusive", "Basic", "Unlimited", "Stems Included"];
const producers = ["Mina Kade", "Zay Nova", "Rico Vale", "J. Blade", "Lennox", "Kairo Sly"];

const formatDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
};

export const beatsMock: BeatRecord[] = Array.from({ length: 16 }, (_, index) => {
  const id = index + 1;
  const premium = index % 3 !== 0;
  return {
    id,
    title: [`Midnight Echo`, `Golden Hour`, `Paper Crown`, `Neon Drift`, `After Hours`, `Cold Frame`][index % 6],
    producer: producers[index % producers.length],
    description: "Original instrumental designed for modern rap vocals and high-energy releases.",
    genre: genres[index % genres.length],
    mood: moods[index % moods.length],
    bpm: 90 + ((index * 7) % 40),
    key: keys[index % keys.length],
    duration: `${2 + (index % 4)}:${index % 6}0`,
    priceType: premium ? "Premium" : "Free",
    price: premium ? 24 + (index % 6) * 5 : 0,
    license: licenses[index % licenses.length],
    coverArt: `BH${id}`,
    streams: 3200 + index * 560,
    downloads: 240 + index * 45,
    sales: 14 + (index % 8),
    revenue: 320 + index * 72,
    featured: index % 4 === 0,
    pinned: index % 5 === 0,
    status: index % 5 === 0 ? "Hidden" : index % 7 === 0 ? "Archived" : "Published",
    uploadDate: formatDate(index * 4 + 2),
    tags: ["rap", "dark", "instrumental", "loop"],
    previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  };
});

export const beatAnalyticsSeries = [
  { label: "Mon", streams: 3200, downloads: 140, sales: 6, revenue: 180 },
  { label: "Tue", streams: 3460, downloads: 155, sales: 8, revenue: 190 },
  { label: "Wed", streams: 3820, downloads: 172, sales: 9, revenue: 212 },
  { label: "Thu", streams: 3990, downloads: 180, sales: 11, revenue: 230 },
  { label: "Fri", streams: 4260, downloads: 208, sales: 13, revenue: 255 },
  { label: "Sat", streams: 4610, downloads: 226, sales: 15, revenue: 277 },
  { label: "Sun", streams: 4900, downloads: 248, sales: 16, revenue: 305 },
];

export const geoListeners = [
  { country: "US", value: 42 },
  { country: "UK", value: 18 },
  { country: "CA", value: 14 },
  { country: "AU", value: 9 },
  { country: "DE", value: 7 },
  { country: "Other", value: 10 },
];
