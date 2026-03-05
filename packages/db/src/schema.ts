import Dexie, { type EntityTable } from "dexie";

/** Generic cache entry stored in IndexedDB */
export interface CacheEntry {
  key: string;
  data: string;
  cachedAt: number;
}

/** Dexie database for Mahfuz offline cache */
export class MahfuzDB extends Dexie {
  cache!: EntityTable<CacheEntry, "key">;

  constructor() {
    super("mahfuz-cache");

    this.version(1).stores({
      cache: "key",
    });
  }
}

export const db = new MahfuzDB();
