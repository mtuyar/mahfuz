import { db } from "./schema";
import type { LessonProgressEntry, LearnConceptEntry, SyncQueueRecord } from "./schema";
import { MASTERY_INTERVALS } from "@mahfuz/shared/types";

export class LearnRepository {
  // Lesson Progress
  async getLessonProgress(
    userId: string,
    lessonId: string,
  ): Promise<LessonProgressEntry | undefined> {
    return db.lesson_progress
      .where("id")
      .equals(`${userId}-${lessonId}`)
      .first();
  }

  async getAllProgressForStage(
    userId: string,
    stageId: number,
  ): Promise<LessonProgressEntry[]> {
    return db.lesson_progress
      .where("[userId+stageId]")
      .equals([userId, stageId])
      .toArray();
  }

  async getCompletedLessons(userId: string): Promise<LessonProgressEntry[]> {
    return db.lesson_progress
      .where("[userId+status]")
      .equals([userId, "completed"])
      .toArray();
  }

  async upsertLessonProgress(entry: LessonProgressEntry): Promise<void> {
    const record = {
      ...entry,
      id: `${entry.userId}-${entry.lessonId}`,
      updatedAt: Date.now(),
    };
    await db.transaction("rw", db.lesson_progress, db.sync_queue, async () => {
      await db.lesson_progress.put(record);
      await this.enqueueSync("lesson_progress", record.id, "upsert", record);
    });
  }

  async getStageCompletionMap(
    userId: string,
  ): Promise<Map<number, { total: number; completed: number }>> {
    const all = await db.lesson_progress
      .where("userId")
      .equals(userId)
      .toArray();

    // Manually handle since userId isn't a direct index
    // Actually we filter from the compound index
    const map = new Map<number, { total: number; completed: number }>();

    for (const entry of all) {
      const existing = map.get(entry.stageId) || { total: 0, completed: 0 };
      existing.total++;
      if (entry.status === "completed") existing.completed++;
      map.set(entry.stageId, existing);
    }

    return map;
  }

  async getTotalSevapPointEarned(userId: string): Promise<number> {
    const completed = await this.getCompletedLessons(userId);
    return completed.reduce((sum, e) => sum + e.sevapPointEarned, 0);
  }

  // Concept Mastery (Simplified SRS)
  async getConcept(
    userId: string,
    conceptId: string,
  ): Promise<LearnConceptEntry | undefined> {
    return db.learn_concepts
      .where("[userId+conceptId]")
      .equals([userId, conceptId])
      .first();
  }

  async getConceptsDueForReview(
    userId: string,
    now: number = Date.now(),
    limit: number = 20,
  ): Promise<LearnConceptEntry[]> {
    return db.learn_concepts
      .where("[userId+nextReviewAt]")
      .between([userId, 0], [userId, now])
      .limit(limit)
      .toArray();
  }

  async upsertConceptMastery(entry: LearnConceptEntry): Promise<void> {
    const record = {
      ...entry,
      id: `${entry.userId}-${entry.conceptId}`,
      updatedAt: Date.now(),
    };
    await db.transaction("rw", db.learn_concepts, db.sync_queue, async () => {
      await db.learn_concepts.put(record);
      await this.enqueueSync("learn_concepts", record.id, "upsert", record);
    });
  }

  async recordConceptResult(
    userId: string,
    conceptId: string,
    isCorrect: boolean,
  ): Promise<LearnConceptEntry> {
    const existing = await this.getConcept(userId, conceptId);
    const now = Date.now();

    const entry: LearnConceptEntry = existing || {
      id: `${userId}-${conceptId}`,
      userId,
      conceptId,
      correctCount: 0,
      incorrectCount: 0,
      masteryLevel: 0,
      nextReviewAt: 0,
      updatedAt: 0,
    };

    if (isCorrect) {
      entry.correctCount++;
      // Level up if enough correct answers at current level
      const thresholds = [2, 3, 4]; // correct answers needed for each level
      if (
        entry.masteryLevel < 3 &&
        entry.correctCount >= thresholds[entry.masteryLevel]
      ) {
        entry.masteryLevel = Math.min(3, entry.masteryLevel + 1) as 0 | 1 | 2 | 3;
      }
    } else {
      entry.incorrectCount++;
      // Level down on incorrect
      if (entry.masteryLevel > 0) {
        entry.masteryLevel = Math.max(0, entry.masteryLevel - 1) as 0 | 1 | 2 | 3;
      }
    }

    // Schedule next review
    const interval = MASTERY_INTERVALS[entry.masteryLevel];
    entry.nextReviewAt = interval === Infinity ? Number.MAX_SAFE_INTEGER : now + interval;

    await this.upsertConceptMastery(entry);
    return entry;
  }

  async getAllConcepts(userId: string): Promise<LearnConceptEntry[]> {
    return db.learn_concepts.where("userId").equals(userId).toArray();
  }

  private async enqueueSync(
    table: SyncQueueRecord["table"],
    recordId: string,
    action: SyncQueueRecord["action"],
    data: unknown,
  ): Promise<void> {
    const record: SyncQueueRecord = {
      id: crypto.randomUUID(),
      table,
      recordId,
      action,
      data: JSON.stringify(data),
      synced: 0,
      createdAt: Date.now(),
    };
    await db.sync_queue.add(record);
  }
}

export const learnRepository = new LearnRepository();
