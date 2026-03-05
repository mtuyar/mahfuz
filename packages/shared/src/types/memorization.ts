import type { VerseKey } from "./quran";

/** SM-2 quality grade (0-5) */
export type QualityGrade = 0 | 1 | 2 | 3 | 4 | 5;

/** Confidence level derived from SM-2 metrics */
export type ConfidenceLevel =
  | "struggling"
  | "learning"
  | "familiar"
  | "confident"
  | "mastered";

/** Memorization card (one per verse) */
export interface MemorizationCard {
  id: string;
  userId: string;
  verseKey: VerseKey;
  /** SM-2: easiness factor (minimum 1.3) */
  easeFactor: number;
  /** SM-2: repetition count */
  repetition: number;
  /** SM-2: interval in days */
  interval: number;
  /** Next review date */
  nextReviewDate: Date;
  /** Derived confidence level */
  confidence: ConfidenceLevel;
  /** Total review count */
  totalReviews: number;
  /** Correct reviews (grade >= 3) */
  correctReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Review entry (history of each review) */
export interface ReviewEntry {
  id: string;
  userId: string;
  cardId: string;
  verseKey: VerseKey;
  grade: QualityGrade;
  previousEaseFactor: number;
  newEaseFactor: number;
  previousInterval: number;
  newInterval: number;
  reviewedAt: Date;
}

/** Daily memorization goals */
export interface MemorizationGoals {
  userId: string;
  newCardsPerDay: number;
  reviewCardsPerDay: number;
}

/** Memorization session stats */
export interface MemorizationStats {
  totalCards: number;
  dueToday: number;
  newToday: number;
  reviewedToday: number;
  byConfidence: Record<ConfidenceLevel, number>;
  averageAccuracy: number;
  currentStreak: number;
}

/** Progressive reveal mode state */
export interface ProgressiveRevealState {
  verseKey: VerseKey;
  revealedWordCount: number;
  totalWordCount: number;
  isFullyRevealed: boolean;
}
