import { db } from "./schema";

export class CacheRepository {
  /** Get cached data if it exists and hasn't expired */
  async get<T>(key: string, ttl: number): Promise<T | null> {
    const entry = await db.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.cachedAt;
    if (age > ttl) {
      await db.cache.delete(key);
      return null;
    }

    return JSON.parse(entry.data) as T;
  }

  /** Store data in cache */
  async set<T>(key: string, data: T): Promise<void> {
    await db.cache.put({
      key,
      data: JSON.stringify(data),
      cachedAt: Date.now(),
    });
  }

  /** Clear a specific key or all cache entries */
  async clear(key?: string): Promise<void> {
    if (key) {
      await db.cache.delete(key);
    } else {
      await db.cache.clear();
    }
  }
}

export const cacheRepository = new CacheRepository();
