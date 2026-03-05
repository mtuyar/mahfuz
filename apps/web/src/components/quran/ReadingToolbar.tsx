import { useState, useRef, useEffect, useCallback } from "react";
import { usePreferencesStore, getArabicFontSizeForMode, getTranslationFontSizeForMode } from "~/stores/usePreferencesStore";
import type { Theme, ViewMode } from "~/stores/usePreferencesStore";

const VIEW_MODE_LABELS: Record<ViewMode, string> = {
  normal: "Normal",
  wordByWord: "Kelime",
  mushaf: "Mushaf",
};

const THEMES: { value: Theme; label: string; color: string; border: string }[] = [
  { value: "light", label: "Açık", color: "#ffffff", border: "#d2d2d7" },
  { value: "sepia", label: "Sepia", color: "#f5ead6", border: "#d4b882" },
  { value: "dark", label: "Koyu", color: "#1a1a1a", border: "#444" },
];

export function ReadingToolbar() {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const viewMode = usePreferencesStore((s) => s.viewMode);
  const normalArabicFontSize = usePreferencesStore((s) => s.normalArabicFontSize);
  const normalTranslationFontSize = usePreferencesStore((s) => s.normalTranslationFontSize);
  const wbwArabicFontSize = usePreferencesStore((s) => s.wbwArabicFontSize);
  const mushafArabicFontSize = usePreferencesStore((s) => s.mushafArabicFontSize);
  const showTranslation = usePreferencesStore((s) => s.showTranslation);
  const theme = usePreferencesStore((s) => s.theme);
  const setNormalArabicFontSize = usePreferencesStore((s) => s.setNormalArabicFontSize);
  const setNormalTranslationFontSize = usePreferencesStore((s) => s.setNormalTranslationFontSize);
  const setWbwArabicFontSize = usePreferencesStore((s) => s.setWbwArabicFontSize);
  const setMushafArabicFontSize = usePreferencesStore((s) => s.setMushafArabicFontSize);
  const setShowTranslation = usePreferencesStore((s) => s.setShowTranslation);
  const setTheme = usePreferencesStore((s) => s.setTheme);

  // Derive current mode's sizes
  const arabicFontSize = getArabicFontSizeForMode({ viewMode, normalArabicFontSize, wbwArabicFontSize, mushafArabicFontSize });
  const translationFontSize = getTranslationFontSizeForMode({ viewMode, normalTranslationFontSize });
  const setArabicFontSize = (size: number) => {
    switch (viewMode) {
      case "wordByWord": return setWbwArabicFontSize(size);
      case "mushaf": return setMushafArabicFontSize(size);
      default: return setNormalArabicFontSize(size);
    }
  };
  const setTranslationFontSize = setNormalTranslationFontSize;

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    },
    [],
  );

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, handleClickOutside, handleEscape]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-8 items-center gap-1 rounded-full px-3 text-[13px] font-medium transition-colors ${
          open
            ? "bg-primary-600 text-white"
            : "bg-[var(--theme-pill-bg)] text-[var(--theme-text)] hover:bg-[var(--theme-hover-bg)]"
        }`}
        aria-label="Okuma ayarları"
        aria-expanded={open}
      >
        <span className="text-[14px] font-semibold">A</span>
        <span className="arabic-text text-[14px] font-semibold leading-none">ع</span>
      </button>

      {open && (
        <div
          ref={popoverRef}
          className="animate-toolbar-in absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-elevated)] p-4 shadow-[var(--shadow-float)]"
          style={{ backdropFilter: "saturate(180%) blur(20px)" }}
        >
          {/* Mode badge */}
          <div className="mb-3 flex items-center gap-1.5">
            <span className="rounded-md bg-primary-600/10 px-2 py-0.5 text-[11px] font-semibold text-primary-700">
              {VIEW_MODE_LABELS[viewMode]}
            </span>
            <span className="text-[11px] text-[var(--theme-text-quaternary)]">
              moduna ait ayarlar
            </span>
          </div>

          {/* Arabic font size */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12px] font-medium text-[var(--theme-text-tertiary)]">
                Arapça Boyutu
              </span>
              <span className="text-[11px] tabular-nums text-[var(--theme-text-quaternary)]">
                %{Math.round(arabicFontSize * 100)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="arabic-text text-sm text-[var(--theme-text-tertiary)]">ع</span>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={arabicFontSize}
                onChange={(e) => setArabicFontSize(Number(e.target.value))}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[var(--theme-border)] accent-primary-600"
              />
              <span className="arabic-text text-xl text-[var(--theme-text-tertiary)]">ع</span>
            </div>
          </div>

          {/* Translation font size */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12px] font-medium text-[var(--theme-text-tertiary)]">
                Çeviri Boyutu
              </span>
              <span className="text-[11px] tabular-nums text-[var(--theme-text-quaternary)]">
                %{Math.round(translationFontSize * 100)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--theme-text-tertiary)]">A</span>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={translationFontSize}
                onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[var(--theme-border)] accent-primary-600"
              />
              <span className="text-lg text-[var(--theme-text-tertiary)]">A</span>
            </div>
          </div>

          {/* Divider */}
          <div className="my-3 border-t border-[var(--theme-divider)]" />

          {/* Translation toggle */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[13px] font-medium text-[var(--theme-text)]">
              Çeviri Göster
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={showTranslation}
              onClick={() => setShowTranslation(!showTranslation)}
              className={`relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors ${
                showTranslation ? "bg-primary-600" : "bg-[var(--theme-divider)]"
              }`}
            >
              <span
                className={`absolute top-[2px] left-[2px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform ${
                  showTranslation ? "translate-x-[18px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Divider */}
          <div className="my-3 border-t border-[var(--theme-divider)]" />

          {/* Theme selector */}
          <div>
            <span className="mb-2 block text-[12px] font-medium text-[var(--theme-text-tertiary)]">
              Tema
            </span>
            <div className="flex items-center justify-center gap-4">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className="flex flex-col items-center gap-1.5"
                  aria-label={t.label}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                      theme === t.value
                        ? "border-primary-600 ring-2 ring-primary-600/30"
                        : "border-[var(--theme-divider)]"
                    }`}
                    style={{ backgroundColor: t.color }}
                  >
                    {theme === t.value && (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke={t.value === "dark" ? "#e5e5e5" : "#059669"}
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="text-[11px] text-[var(--theme-text-tertiary)]">
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
