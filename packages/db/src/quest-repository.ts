import { db } from "./schema";
import type { QuestProgressEntry, SyncQueueRecord } from "./schema";

export class QuestRepository {
  async getQuestProgress(
    userId: string,
    questId: string,
  ): Promise<QuestProgressEntry | undefined> {
    return db.quest_progress
      .where("[userId+questId]")
      .equals([userId, questId])
      .first();
  }

  async getAllQuestProgress(userId: string): Promise<QuestProgressEntry[]> {
    return db.quest_progress.where("userId").equals(userId).toArray();
  }

  async upsertQuestProgress(entry: QuestProgressEntry): Promise<void> {
    const record = {
      ...entry,
      id: `${entry.userId}-${entry.questId}`,
      updatedAt: Date.now(),
    };
    await db.transaction("rw", db.quest_progress, db.sync_queue, async () => {
      await db.quest_progress.put(record);
      await this.enqueueSync("quest_progress", record.id, "upsert", record);
    });
  }

  async recordSessionResult(
    userId: string,
    questId: string,
    correctWordIds: string[],
    score: number,
  ): Promise<QuestProgressEntry> {
    const existing = await this.getQuestProgress(userId, questId);
    const now = Date.now();

    const entry: QuestProgressEntry = existing || {
      id: `${userId}-${questId}`,
      userId,
      questId,
      wordsCorrect: [],
      totalAttempts: 0,
      totalCorrect: 0,
      sessionsCompleted: 0,
      bestSessionScore: 0,
      lastPlayedAt: 0,
      updatedAt: 0,
    };

    // Merge new correct words (deduplicated)
    const correctSet = new Set(entry.wordsCorrect);
    for (const wid of correctWordIds) {
      correctSet.add(wid);
    }
    entry.wordsCorrect = Array.from(correctSet);

    entry.totalAttempts += 10; // exercisesPerSession
    entry.totalCorrect += correctWordIds.length;
    entry.sessionsCompleted += 1;
    entry.bestSessionScore = Math.max(entry.bestSessionScore, score);
    entry.lastPlayedAt = now;

    await this.upsertQuestProgress(entry);
    return entry;
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

export const questRepository = new QuestRepository();
