import { BarChart3, BellDot, Music2, RadioTower, Sparkles, Users2, Video, Wallet, FileCheck2, ShieldAlert, CirclePlay, TrendingUp, DatabaseZap, HardDrive, CloudUpload, CreditCard } from "lucide-react";

export const summaryStats = [
  { title: "Total Users", value: "184.2k", change: "+12.4%", trend: "up", icon: Users2 },
  { title: "Total Artists", value: "8.4k", change: "+8.1%", trend: "up", icon: Sparkles },
  { title: "Total Songs", value: "32.7k", change: "+5.9%", trend: "up", icon: Music2 },
  { title: "Total Beats", value: "19.1k", change: "+14.2%", trend: "up", icon: RadioTower },
  { title: "Total Videos", value: "11.2k", change: "+3.7%", trend: "up", icon: Video },
  { title: "Albums", value: "2.3k", change: "+1.6%", trend: "up", icon: CirclePlay },
  { title: "Total Streams", value: "1.8M", change: "+19.4%", trend: "up", icon: BarChart3 },
  { title: "Downloads", value: "564k", change: "+9.8%", trend: "up", icon: CloudUpload },
  { title: "Revenue", value: "$482k", change: "+11.2%", trend: "up", icon: Wallet },
  { title: "Pending Verifications", value: "84", change: "-4.2%", trend: "down", icon: FileCheck2 },
  { title: "Pending Reports", value: "27", change: "+2.1%", trend: "up", icon: ShieldAlert },
  { title: "Active Users Today", value: "41.6k", change: "+6.9%", trend: "up", icon: BellDot },
];

export const quickActions = [
  { title: "Upload Beat", description: "Add new beats for review and publishing.", href: "/admin/content/beats", icon: RadioTower },
  { title: "Upload Video", description: "Publish new content and sync metadata.", href: "/admin/content/videos", icon: Video },
  { title: "Verify Content", description: "Review pending submissions in one queue.", href: "/admin/moderation/verification", icon: FileCheck2 },
  { title: "Manage Users", description: "Moderate creators, fans, and roles.", href: "/admin/community/users", icon: Users2 },
  { title: "Create Announcement", description: "Push a new platform update to the audience.", href: "/admin/content-management/announcements", icon: BellDot },
  { title: "View Reports", description: "Inspect flagged content and moderation cases.", href: "/admin/moderation/reports", icon: ShieldAlert },
];

export const streamsData = [
  { day: "Mon", streams: 3600 },
  { day: "Tue", streams: 4020 },
  { day: "Wed", streams: 3880 },
  { day: "Thu", streams: 4540 },
  { day: "Fri", streams: 5120 },
  { day: "Sat", streams: 5780 },
  { day: "Sun", streams: 6090 },
];

export const growthData = [
  { month: "Jan", users: 12800 },
  { month: "Feb", users: 14100 },
  { month: "Mar", users: 15300 },
  { month: "Apr", users: 16600 },
  { month: "May", users: 18100 },
  { month: "Jun", users: 19800 },
];

export const revenueData = [
  { month: "Jan", revenue: 18200 },
  { month: "Feb", revenue: 21400 },
  { month: "Mar", revenue: 23800 },
  { month: "Apr", revenue: 26100 },
  { month: "May", revenue: 29200 },
  { month: "Jun", revenue: 32600 },
];

export const uploadsData = [
  { month: "Jan", songs: 320, beats: 180, videos: 92 },
  { month: "Feb", songs: 340, beats: 194, videos: 101 },
  { month: "Mar", songs: 366, beats: 210, videos: 112 },
  { month: "Apr", songs: 392, beats: 224, videos: 121 },
  { month: "May", songs: 410, beats: 242, videos: 136 },
  { month: "Jun", songs: 438, beats: 256, videos: 149 },
];

export const recentActivity = [
  { id: 1, title: "Song uploaded", actor: "Maya West", time: "8 min ago", status: "Approved", accent: "bg-[#D4AF37]" },
  { id: 2, title: "Beat uploaded", actor: "Nico Faye", time: "23 min ago", status: "Review", accent: "bg-emerald-500" },
  { id: 3, title: "Video uploaded", actor: "Kairo Lane", time: "1 hr ago", status: "Pending", accent: "bg-sky-500" },
  { id: 4, title: "Artist verified", actor: "Sage Bell", time: "3 hrs ago", status: "Approved", accent: "bg-violet-500" },
  { id: 5, title: "User registered", actor: "J. Alvarez", time: "5 hrs ago", status: "New", accent: "bg-rose-500" },
  { id: 6, title: "Report submitted", actor: "Ava Stone", time: "6 hrs ago", status: "Flagged", accent: "bg-amber-500" },
];

export const verificationItems = [
  { type: "songs", title: "Midnight Echo", artist: "Luca Voss", uploaded: "2 hrs ago", status: "Pending Review", thumbnail: "ME" },
  { type: "songs", title: "Neon Skyline", artist: "Jules Rook", uploaded: "5 hrs ago", status: "Needs Edit", thumbnail: "NS" },
  { type: "beats", title: "Golden Hour Loop", artist: "Mina Kade", uploaded: "1 hr ago", status: "Pending Review", thumbnail: "GH" },
  { type: "beats", title: "Paper Crown", artist: "Dre Sol", uploaded: "4 hrs ago", status: "Queued", thumbnail: "PC" },
  { type: "videos", title: "Backstage Live", artist: "Talia Rho", uploaded: "3 hrs ago", status: "Pending Review", thumbnail: "BL" },
  { type: "videos", title: "Street Lights", artist: "Kendrick Vale", uploaded: "6 hrs ago", status: "Needs Edit", thumbnail: "SL" },
];

export const trendingSongs = [
  { title: "Afterglow", artist: "Sage Bell", streams: "182k", downloads: "14.2k" },
  { title: "Northside Prayer", artist: "Maya West", streams: "171k", downloads: "12.8k" },
  { title: "Velvet Static", artist: "Nico Faye", streams: "167k", downloads: "11.3k" },
];

export const trendingBeats = [
  { title: "Paper Crown", artist: "Dre Sol", streams: "98k", downloads: "7.8k" },
  { title: "Golden Hour Loop", artist: "Mina Kade", streams: "94k", downloads: "7.2k" },
  { title: "Neon Skyline", artist: "Jules Rook", streams: "91k", downloads: "6.9k" },
];

export const healthStatus = [
  { name: "API", status: "Healthy", responseTime: "82ms", progress: 92, tone: "text-emerald-400" },
  { name: "Database", status: "Stable", responseTime: "112ms", progress: 88, tone: "text-[#D4AF37]" },
  { name: "Storage", status: "Healthy", responseTime: "64ms", progress: 95, tone: "text-emerald-400" },
  { name: "Upload Service", status: "Watch", responseTime: "181ms", progress: 74, tone: "text-amber-400" },
  { name: "Payment Service", status: "Healthy", responseTime: "98ms", progress: 90, tone: "text-emerald-400" },
];
