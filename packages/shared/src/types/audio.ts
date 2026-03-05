import type { AudioSegment, VerseKey } from "./quran";

/** Audio playback state */
export type PlaybackState = "idle" | "loading" | "playing" | "paused" | "ended";

/** Audio repeat mode */
export type RepeatMode = "none" | "verse" | "range" | "surah" | "page";

/** Audio playback speed options */
export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

/** Current audio state */
export interface AudioState {
  playbackState: PlaybackState;
  currentVerseKey: VerseKey | null;
  currentWordPosition: number | null;
  currentTime: number;
  duration: number;
  reciterId: number;
  speed: PlaybackSpeed;
  repeatMode: RepeatMode;
  repeatRange: VerseRange | null;
  repeatCount: number;
  volume: number;
  isMuted: boolean;
}

/** Verse range for repeat mode */
export interface VerseRange {
  from: VerseKey;
  to: VerseKey;
}

/** Audio file metadata for offline storage */
export interface AudioFileMetadata {
  reciterId: number;
  chapterId: number;
  verseKey: VerseKey | null; // null = full chapter
  url: string;
  sizeBytes: number;
  segments: AudioSegment[];
  downloadedAt: Date | null;
}

/** Download progress */
export interface DownloadProgress {
  reciterId: number;
  chapterId: number;
  bytesDownloaded: number;
  totalBytes: number;
  status: "pending" | "downloading" | "completed" | "error";
}
