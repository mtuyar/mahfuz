/** Sync operation types */
export type SyncOperation = "create" | "update" | "delete";

/** Sync queue entry */
export interface SyncQueueEntry {
  id: string;
  table: SyncTable;
  recordId: string;
  operation: SyncOperation;
  payload: Record<string, unknown>;
  createdAt: Date;
  retryCount: number;
  lastError: string | null;
}

export type SyncTable =
  | "bookmarks"
  | "bookmark_folders"
  | "memorization_cards"
  | "review_entries"
  | "user_preferences"
  | "user_gamification"
  | "reading_sessions"
  | "last_read_position";

/** Sync state */
export interface SyncState {
  status: "idle" | "syncing" | "error" | "offline";
  lastSyncAt: Date | null;
  pendingChanges: number;
  lastError: string | null;
}

/** Conflict resolution strategy */
export type ConflictStrategy = "local-wins" | "remote-wins" | "latest-wins";
