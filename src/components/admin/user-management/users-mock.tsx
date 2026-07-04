export type UserStatus = "Active" | "Suspended" | "Banned";
export type UserRole = "Admin" | "Artist" | "User" | "Moderator";

export interface UserRecord {
  id: number;
  username: string;
  email: string;
  country: string;
  role: UserRole;
  joined: string;
  uploads: number;
  followers: number;
  verified: boolean;
  status: UserStatus;
  lastActive: string;
  bio: string;
  following: number;
  songsUploaded: number;
  beatsUploaded: number;
  videosUploaded: number;
  albums: number;
  recentActivity: Array<{ id: number; action: string; time: string }>;
  reports: number;
}

export interface ArtistRecord {
  id: number;
  stageName: string;
  realName: string;
  country: string;
  followers: number;
  monthlyListeners: number;
  songs: number;
  beats: number;
  videos: number;
  albums: number;
  verified: boolean;
  earnings: string;
  status: UserStatus;
  featured?: boolean;
}

const countries = ["US", "GB", "CA", "AU"];
const roles: UserRole[] = ["User", "Artist", "User", "Admin", "Moderator", "User"];
const formatDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
};

export const usersMock: UserRecord[] = Array.from({ length: 24 }, (_, i) => {
  const id = i + 1;
  const status: UserStatus = i % 11 === 0 ? "Banned" : i % 7 === 0 ? "Suspended" : "Active";
  const verified = i % 4 === 0;

  return {
    id,
    username: `user_${id}`,
    email: `user${id}@example.com`,
    country: countries[i % countries.length],
    role: roles[i % roles.length],
    joined: formatDate((i * 5) % 45),
    uploads: 12 + ((id * 7) % 41),
    followers: 250 + (id * 183) % 4200,
    verified,
    status,
    lastActive: `${(i * 8) % 72} hrs ago`,
    bio: "Emerging creator with a strong mix of rap storytelling, club-ready hooks, and community-first releases.",
    following: 140 + (id * 17) % 900,
    songsUploaded: 3 + (id % 9),
    beatsUploaded: 2 + (id % 6),
    videosUploaded: 1 + (id % 4),
    albums: (id % 4) + 1,
    recentActivity: [
      { id: 1, action: "Song uploaded", time: "2 hrs ago" },
      { id: 2, action: "Video uploaded", time: "1 day ago" },
    ],
    reports: (id + 2) % 5,
  };
});

export const artistsMock: ArtistRecord[] = usersMock
  .filter((_, index) => index % 3 === 0)
  .map((user, index) => ({
    id: user.id,
    stageName: `Stage ${user.username}`,
    realName: `Real ${user.username}`,
    country: user.country,
    followers: user.followers,
    monthlyListeners: 7200 + (index + 1) * 1850,
    songs: 8 + (index % 6),
    beats: 4 + (index % 5),
    videos: 2 + (index % 4),
    albums: 1 + (index % 3),
    verified: user.verified,
    earnings: `${(320 + index * 184).toFixed(2)}`,
    status: user.status,
    featured: index % 4 === 0,
  }));
