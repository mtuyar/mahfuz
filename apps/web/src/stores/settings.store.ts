import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "papyrus" | "sea" | "night";
export type TextStyle = "uthmani" | "basic";
export type WbwDisplay = "off" | "hover" | "on";

interface SettingsState {
  theme: Theme;
  textStyle: TextStyle;
  translationSlugs: string[];
  showTranslation: boolean;
  showWbw: boolean;
  wbwTranslation: WbwDisplay;
  wbwTranslit: WbwDisplay;
  showTajweed: boolean;
  readingMode: "page" | "list";
  reciterSlug: string;
  arabicFontSize: number; // rem
  translationFontSize: number; // rem
}

interface SettingsActions {
  setTheme: (theme: Theme) => void;
  /** Bir meal ekle/çıkar (toggle) */
  toggleTranslationSlug: (slug: string) => void;
  /** Seçili meali bir adım yukarı/aşağı taşı */
  moveTranslationSlug: (slug: string, direction: "up" | "down") => void;
  /** Eski tek-meal setter (geriye uyumluluk — listeyi [slug] yapar) */
  setTranslation: (slug: string) => void;
  toggleTranslation: () => void;
  toggleWbw: () => void;
  setWbwTranslation: (mode: WbwDisplay) => void;
  setWbwTranslit: (mode: WbwDisplay) => void;
  toggleTajweed: () => void;
  setReadingMode: (mode: "page" | "list") => void;
  setReciter: (slug: string) => void;
  setTextStyle: (style: TextStyle) => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  resetToDefaults: () => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      // Defaults
      theme: "papyrus" as Theme,
      translationSlugs: ["omer-celik"],
      showTranslation: true,
      showWbw: false,
      wbwTranslation: "on" as WbwDisplay,
      wbwTranslit: "off" as WbwDisplay,
      showTajweed: false,
      textStyle: "uthmani" as TextStyle,
      readingMode: "page",
      reciterSlug: "mishary-rashid-alafasy",
      arabicFontSize: 1.8,
      translationFontSize: 0.95,

      // Actions
      setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },
      toggleTranslationSlug: (slug) =>
        set((s) => {
          const has = s.translationSlugs.includes(slug);
          if (has && s.translationSlugs.length === 1) return s; // en az 1 meal kalmalı
          return {
            translationSlugs: has
              ? s.translationSlugs.filter((s2) => s2 !== slug)
              : [...s.translationSlugs, slug],
          };
        }),
      moveTranslationSlug: (slug, direction) =>
        set((s) => {
          const arr = [...s.translationSlugs];
          const idx = arr.indexOf(slug);
          if (idx < 0) return s;
          const target = direction === "up" ? idx - 1 : idx + 1;
          if (target < 0 || target >= arr.length) return s;
          [arr[idx], arr[target]] = [arr[target], arr[idx]];
          return { translationSlugs: arr };
        }),
      setTranslation: (slug) => set({ translationSlugs: [slug] }),
      toggleTranslation: () => set((s) => ({ showTranslation: !s.showTranslation })),
      toggleWbw: () => set((s) => ({ showWbw: !s.showWbw })),
      setWbwTranslation: (mode) => set({ wbwTranslation: mode }),
      setWbwTranslit: (mode) => set({ wbwTranslit: mode }),
      toggleTajweed: () => set((s) => ({ showTajweed: !s.showTajweed })),
      setReadingMode: (mode) => set({ readingMode: mode }),
      setReciter: (slug) => set({ reciterSlug: slug }),
      setTextStyle: (style) => set({ textStyle: style }),
      setArabicFontSize: (size) => set({ arabicFontSize: Math.max(1.2, Math.min(5.0, size)) }),
      setTranslationFontSize: (size) => set({ translationFontSize: Math.max(0.75, Math.min(2.0, size)) }),
      resetToDefaults: () => {
        document.documentElement.setAttribute("data-theme", "papyrus");
        set({
          theme: "papyrus",
          translationSlugs: ["omer-celik"],
          showTranslation: true,
          showWbw: false,
          wbwTranslation: "on",
          wbwTranslit: "off",
          showTajweed: false,
          textStyle: "uthmani",
          readingMode: "page",
          reciterSlug: "mishary-rashid-alafasy",
          arabicFontSize: 1.8,
          translationFontSize: 0.95,
        });
      },
    }),
    {
      name: "mahfuz-core-settings",
      version: 1,
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as object),
      }),
      migrate: (persisted: any, version: number) => {
        if (version === 0) {
          // v0 → v1: translationSlug (string) → translationSlugs (string[])
          const old = persisted as any;
          if (old.translationSlug && !old.translationSlugs) {
            old.translationSlugs = [old.translationSlug];
            delete old.translationSlug;
          }
        }
        return persisted as any;
      },
    },
  ),
);
