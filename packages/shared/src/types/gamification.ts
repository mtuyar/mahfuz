/** XP event types and their values */
export type XPEventType =
  | "verse_read"
  | "page_read"
  | "surah_complete"
  | "verse_memorized"
  | "hatim_complete"
  | "daily_login"
  | "review_session";

export const XP_VALUES: Record<XPEventType, number> = {
  verse_read: 1,
  page_read: 10,
  surah_complete: 50,
  verse_memorized: 20,
  hatim_complete: 500,
  daily_login: 5,
  review_session: 15,
} as const;

/** User gamification state */
export interface UserGamification {
  userId: string;
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // ISO date
  hatimCount: number;
  versesRead: number;
  totalReadingTimeSeconds: number;
  achievements: UserAchievement[];
  updatedAt: Date;
}

/** Achievement definition */
export interface Achievement {
  id: string;
  name: string;
  nameAr: string;
  nameTr: string;
  description: string;
  descriptionTr: string;
  icon: string;
  category: AchievementCategory;
  requirement: AchievementRequirement;
}

export type AchievementCategory =
  | "reading"
  | "memorization"
  | "streak"
  | "milestone"
  | "special";

export interface AchievementRequirement {
  type: "verses_read" | "surah_complete" | "streak_days" | "hatim_count" | "cards_mastered";
  value: number;
  surahId?: number; // For specific surah achievements
}

/** User's unlocked achievement */
export interface UserAchievement {
  achievementId: string;
  unlockedAt: Date;
}

/** Level calculation: 100 * 1.5^(level-1) */
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

/** Get level from total XP */
export function levelFromXP(totalXP: number): { level: number; xpInLevel: number; xpToNext: number } {
  let level = 1;
  let remainingXP = totalXP;

  while (remainingXP >= xpForLevel(level)) {
    remainingXP -= xpForLevel(level);
    level++;
  }

  return {
    level,
    xpInLevel: remainingXP,
    xpToNext: xpForLevel(level) - remainingXP,
  };
}
