import { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from "react";

export type PlayingBeat = {
  id: string;
  title: string;
  producer: string;
  coverUrl?: string | null;
  previewUrl: string;
};

type Ctx = {
  current: PlayingBeat | null;
  isPlaying: boolean;
  progress: number; // 0-1
  duration: number;
  play: (beat: PlayingBeat) => void;
  toggle: () => void;
  stop: () => void;
  seek: (ratio: number) => void;
};

const AudioCtx = createContext<Ctx | null>(null);

export function BeatPlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<PlayingBeat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioRef.current && typeof window !== "undefined") {
    audioRef.current = new Audio();
    audioRef.current.preload = "metadata";
  }

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      setProgress(a.duration ? a.currentTime / a.duration : 0);
    };
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => setIsPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const play = useCallback((beat: PlayingBeat) => {
    const a = audioRef.current;
    if (!a) return;
    if (current?.id !== beat.id) {
      a.src = beat.previewUrl;
      setCurrent(beat);
    }
    a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [current]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a || !current) return;
    if (a.paused) {
      a.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      a.pause();
      setIsPlaying(false);
    }
  }, [current]);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setIsPlaying(false);
    setCurrent(null);
  }, []);

  const seek = useCallback((ratio: number) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    a.currentTime = ratio * a.duration;
  }, []);

  return (
    <AudioCtx.Provider value={{ current, isPlaying, progress, duration, play, toggle, stop, seek }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useBeatPlayer() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useBeatPlayer must be used inside BeatPlayerProvider");
  return ctx;
}
