import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ReadingHistory {
  lastSurahId: number | null;
  lastSurahName: string | null;
  lastPageNumber: number | null;
  lastJuzNumber: number | null;
  _syncUpdatedAt: number;
  visitSurah: (id: number, name: string) => void;
  visitPage: (page: number) => void;
  visitJuz: (juz: number) => void;
  _setSyncUpdatedAt: (v: number) => void;
  _setAll: (data: {
    lastSurahId: number | null;
    lastSurahName: string | null;
    lastPageNumber: number | null;
    lastJuzNumber: number | null;
  }, syncUpdatedAt: number) => void;
}

export const useReadingHistory = create<ReadingHistory>()(
  persist(
    (set) => ({
      lastSurahId: null,
      lastSurahName: null,
      lastPageNumber: null,
      lastJuzNumber: null,
      _syncUpdatedAt: 0,
      visitSurah: (id, name) => set({ lastSurahId: id, lastSurahName: name, _syncUpdatedAt: Date.now() }),
      visitPage: (page) => set({ lastPageNumber: page, _syncUpdatedAt: Date.now() }),
      visitJuz: (juz) => set({ lastJuzNumber: juz, _syncUpdatedAt: Date.now() }),
      _setSyncUpdatedAt: (v) => set({ _syncUpdatedAt: v }),
      _setAll: (data, syncUpdatedAt) => set({ ...data, _syncUpdatedAt: syncUpdatedAt }),
    }),
    { name: "mahfuz-reading-history" },
  ),
);
