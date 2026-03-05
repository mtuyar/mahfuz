import type { VerseKey } from "./quran";

/** User preferences */
export interface UserPreferences {
  id: string;
  userId: string;
  theme: Theme;
  fontSize: FontSize;
  arabicFontSize: ArabicFontSize;
  defaultReciterId: number;
  defaultTranslationIds: number[];
  defaultTafsirId: number | null;
  showTranslation: boolean;
  showTransliteration: boolean;
  showWordByWord: boolean;
  readingMode: ReadingMode;
  mushafType: MushafType;
  language: AppLanguage;
  updatedAt: Date;
}

export type Theme = "light" | "dark" | "sepia" | "system";
export type FontSize = "sm" | "md" | "lg" | "xl";
export type ArabicFontSize = "sm" | "md" | "lg" | "xl" | "2xl";
export type ReadingMode = "translation" | "reading" | "wordByWord";
export type MushafType = "uthmani" | "imlaei";
export type AppLanguage = "tr" | "en" | "ar";

/** Bookmark */
export interface Bookmark {
  id: string;
  userId: string;
  verseKey: VerseKey;
  folderId: string | null;
  note: string | null;
  createdAt: Date;
  deletedAt: Date | null; // soft delete for sync
}

/** Bookmark folder */
export interface BookmarkFolder {
  id: string;
  userId: string;
  name: string;
  color: string | null;
  createdAt: Date;
  deletedAt: Date | null;
}

/** Last read position */
export interface LastReadPosition {
  id: string;
  userId: string;
  verseKey: VerseKey;
  scrollPosition: number;
  readingMode: ReadingMode;
  updatedAt: Date;
}

/** Reading session */
export interface ReadingSession {
  id: string;
  userId: string;
  startVerseKey: VerseKey;
  endVerseKey: VerseKey;
  type: SessionType;
  durationSeconds: number;
  versesRead: number;
  pagesRead: number;
  startedAt: Date;
  endedAt: Date;
}

export type SessionType = "reading" | "listening" | "memorizing";
