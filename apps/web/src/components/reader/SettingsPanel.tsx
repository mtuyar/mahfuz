/**
 * Ayar paneli — sağdan açılır sheet.
 */

import { useMemo, useEffect, useRef } from "react";
import { useSettingsStore, type Theme, type TextStyle, type WbwDisplay } from "~/stores/settings.store";
import { useQuery } from "@tanstack/react-query";
import { recitersQueryOptions, translationSourcesQueryOptions } from "~/hooks/useQuranQuery";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { surahSlug } from "~/lib/surah-slugs";
import { useTranslation } from "~/hooks/useTranslation";
import { useLocaleStore } from "~/stores/locale.store";
import { getAllLocaleConfigs, type Locale } from "~/locales/registry";
import { SearchableSelect } from "~/components/SearchableSelect";

/** Dil kodu → görüntülenecek isim */
const LANG_LABELS: Record<string, string> = {
  tr: "Türkçe", en: "English", ar: "العربية", fr: "Français",
  es: "Español", de: "Deutsch", nl: "Nederlands", bn: "বাংলা",
  fa: "فارسی", id: "Bahasa", it: "Italiano", pt: "Português",
  ru: "Русский", sq: "Shqip", th: "ไทย", ur: "اردو",
  zh: "中文", ms: "Melayu", sw: "Kiswahili", vi: "Tiếng Việt",
};

const THEMES: { id: Theme; labelKey: "papyrus" | "sea" | "night"; ring: string; dot: string }[] = [
  { id: "papyrus", labelKey: "papyrus", ring: "#d4c9a8", dot: "#8b6914" },
  { id: "sea", labelKey: "sea", ring: "#b3ccc9", dot: "#0d7377" },
  { id: "night", labelKey: "night", ring: "#444", dot: "#7aad4a" },
];

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  context?: { surahId?: number; pageNumber?: number };
}

export function SettingsPanel({ open, onClose, context }: SettingsPanelProps) {
  const {
    showTranslation, toggleTranslation,
    showWbw, toggleWbw,
    wbwTranslation, setWbwTranslation,
    wbwTranslit, setWbwTranslit,
    showTajweed, toggleTajweed,
    readingMode, setReadingMode,
    translationSlug, setTranslation,
    arabicFontSize, setArabicFontSize,
    translationFontSize, setTranslationFontSize,
    reciterSlug, setReciter,
    textStyle, setTextStyle,
    theme, setTheme,
    resetToDefaults,
  } = useSettingsStore();

  const { t } = useTranslation();
  const { locale, setLocale } = useLocaleStore();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const { data: reciterList } = useQuery({ ...recitersQueryOptions(), enabled: open });
  const { data: translationList } = useQuery({ ...translationSourcesQueryOptions(), enabled: open });

  const LANG_ORDER = ["tr", "en", "es", "fr", "ar", "de", "nl"];

  const translationOptions = useMemo(() => {
    if (!translationList || translationList.length === 0) return [];
    const order = [locale, ...LANG_ORDER.filter((l) => l !== locale)];
    const langRank = (lang: string) => { const idx = order.indexOf(lang); return idx >= 0 ? idx : order.length; };
    const sorted = [...translationList].sort((a, b) => langRank(a.language) - langRank(b.language));
    return sorted.map((src) => {
      const lang = LANG_LABELS[src.language] || src.language;
      return { value: src.slug, label: `${lang} / ${src.name}`, searchText: [lang, src.author, src.name].join(" ") };
    });
  }, [translationList, locale]);

  const reciterOptions = useMemo(() => {
    if (!reciterList || reciterList.length === 0) return [];
    return reciterList.map((r) => ({
      value: r.slug,
      label: r.nameArabic ? `${r.name} — ${r.nameArabic}` : r.name,
      searchText: [r.name, r.nameArabic, r.slug].filter(Boolean).join(" "),
    }));
  }, [reciterList]);

  const prevLocaleRef = useRef(locale);
  useEffect(() => {
    if (prevLocaleRef.current === locale) return;
    prevLocaleRef.current = locale;
    if (!translationList || translationList.length === 0) return;
    const current = translationList.find((s) => s.slug === translationSlug);
    if (current?.language === locale) return;
    const match = translationList.find((s) => s.language === locale);
    if (match) setTranslation(match.slug);
  }, [locale, translationList, translationSlug, setTranslation]);

  if (!open) return null;

  const handleModeChange = (mode: "page" | "list") => {
    setReadingMode(mode);
    const isOnPage = currentPath.startsWith("/page/");
    const isOnSurah = currentPath.startsWith("/surah/");
    if (mode === "list" && isOnPage && context?.surahId) {
      onClose();
      navigate({ to: "/surah/$surahSlug", params: { surahSlug: surahSlug(context.surahId) }, search: { ayah: undefined } });
    } else if (mode === "page" && isOnSurah && context?.pageNumber) {
      onClose();
      navigate({ to: "/page/$pageNumber", params: { pageNumber: String(context.pageNumber) }, search: { ayah: undefined } });
    }
  };

  const arabicMin = 1.2, arabicMax = 5.0;
  const mealMin = 0.75, mealMax = 2.0;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      <div className="fixed right-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] bg-[var(--color-bg)] border-l border-[var(--color-border)] shadow-xl overflow-y-auto">
        <div className="p-4">
          {/* Başlık */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium">{t.settings.title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
              aria-label={t.settings.close}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M5 5L13 13M13 5L5 13" />
              </svg>
            </button>
          </div>

          {/* ── Dil + Tema — tek satır ── */}
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[var(--color-border)]">
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
            >
              {getAllLocaleConfigs().map(({ code, config }) => (
                <option key={code} value={code}>{config.displayName}</option>
              ))}
            </select>
            <div className="flex gap-1.5 shrink-0">
              {THEMES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id)}
                  className="relative w-8 h-8 rounded-full transition-all flex items-center justify-center"
                  style={{
                    border: theme === item.id ? `2px solid ${item.dot}` : `2px solid ${item.ring}`,
                  }}
                  aria-label={t.settings.themes[item.labelKey]}
                  title={t.settings.themes[item.labelKey]}
                >
                  <span className="w-4 h-4 rounded-full" style={{ background: item.dot }} />
                </button>
              ))}
            </div>
          </div>

          {/* ── Okuma Modu ── */}
          <div className="mb-3 pb-3 border-b border-[var(--color-border)]">
            <label className="text-[11px] font-medium text-[var(--color-text-secondary)] mb-1.5 block">
              {t.settings.readingMode}
            </label>
            <SegmentedControl
              options={[
                { value: "page", label: t.settings.mushafPage },
                { value: "list", label: t.settings.verseList },
              ]}
              value={readingMode}
              onChange={(v) => handleModeChange(v as "page" | "list")}
            />
          </div>

          {/* ── Meal + WBW ── */}
          <div className="mb-3 pb-3 border-b border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                {t.settings.translation}
              </label>
              <Toggle checked={showTranslation} onChange={toggleTranslation} />
            </div>
            {showTranslation && (
              <>
                <SearchableSelect
                  options={translationOptions}
                  value={translationSlug}
                  onChange={setTranslation}
                  placeholder={t.settings.select}
                  searchPlaceholder={t.settings.searchTranslation}
                  noResultsText={t.common.noResults}
                />
                <div className="flex items-center justify-between mt-2">
                  <label className="text-[11px] text-[var(--color-text-secondary)]">
                    {t.settings.wordByWord}
                  </label>
                  <Toggle checked={showWbw} onChange={toggleWbw} />
                </div>
                {showWbw && (
                  <div className="mt-2 space-y-1.5 pl-1">
                    <WbwDisplayControl label={t.settings.wbwTranslation} value={wbwTranslation} onChange={setWbwTranslation} t={t} />
                    <WbwDisplayControl label={t.settings.wbwTransliteration} value={wbwTranslit} onChange={setWbwTranslit} t={t} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Metin Stili + Tecvid ── */}
          <div className="mb-3 pb-3 border-b border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                {t.settings.textStyle}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--color-text-secondary)]">{t.settings.tajweed}</span>
                <Toggle checked={showTajweed} onChange={toggleTajweed} disabled={textStyle === "basic"} />
              </div>
            </div>
            <SegmentedControl
              options={[
                { value: "uthmani", label: "Uthmani" },
                { value: "basic", label: "Basic" },
              ]}
              value={textStyle}
              onChange={(v) => setTextStyle(v as TextStyle)}
            />
          </div>

          {/* ── Yazı Boyutu ── */}
          <div className="mb-3 pb-3 border-b border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                {t.settings.fontSize}
              </label>
              <button
                onClick={() => { setArabicFontSize(1.8); setTranslationFontSize(0.95); }}
                className="text-[11px] text-[var(--color-accent)] hover:underline"
              >
                {t.settings.fontDefault}
              </button>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--color-text-secondary)] w-12 shrink-0">{t.settings.arabic}</span>
                <input type="range" min={arabicMin} max={arabicMax} step={0.1} value={arabicFontSize}
                  onChange={(e) => setArabicFontSize(parseFloat(e.target.value))} className="settings-range flex-1" />
                <span className="text-[11px] tabular-nums text-[var(--color-text-secondary)] w-7 text-right">{arabicFontSize.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--color-text-secondary)] w-12 shrink-0">{t.settings.translation}</span>
                <input type="range" min={mealMin} max={mealMax} step={0.05} value={translationFontSize}
                  onChange={(e) => setTranslationFontSize(parseFloat(e.target.value))} className="settings-range flex-1" />
                <span className="text-[11px] tabular-nums text-[var(--color-text-secondary)] w-7 text-right">{translationFontSize.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* ── Kari ── */}
          {reciterOptions.length > 0 && (
            <div className="mb-3 pb-3 border-b border-[var(--color-border)]">
              <label className="text-[11px] font-medium text-[var(--color-text-secondary)] mb-1.5 block">
                {t.settings.reciter}
              </label>
              <SearchableSelect
                options={reciterOptions}
                value={reciterSlug}
                onChange={setReciter}
                placeholder={t.settings.select}
                searchPlaceholder={t.settings.searchReciter}
                noResultsText={t.common.noResults}
              />
            </div>
          )}

          {/* ── Sıfırla ── */}
          <button
            onClick={resetToDefaults}
            className="w-full py-2 rounded-lg border border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors"
          >
            {t.settings.resetAll}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Segmented Control ────────────────────────────────────

function SegmentedControl({ options, value, onChange }: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-[var(--color-border)]">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-1.5 text-[11px] font-medium transition-colors ${
            value === opt.value
              ? "bg-[var(--color-accent)] text-white"
              : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Toggle ───────────────────────────────────────────────

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={`relative w-9 h-5 rounded-full transition-colors ${
        disabled
          ? "bg-[var(--color-border)] opacity-40 cursor-not-allowed"
          : checked
            ? "bg-[var(--color-accent)]"
            : "bg-[var(--color-border)]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : ""
        }`}
      />
    </button>
  );
}

// ── WBW 3-state kontrol ──────────────────────────────────

const WBW_OPTIONS: WbwDisplay[] = ["off", "hover", "on"];

function WbwDisplayControl({ label, value, onChange, t }: {
  label: string;
  value: WbwDisplay;
  onChange: (v: WbwDisplay) => void;
  t: any;
}) {
  const labels: Record<WbwDisplay, string> = {
    off: t.settings.wbwOff,
    hover: t.settings.wbwHover,
    on: t.settings.wbwOn,
  };
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] text-[var(--color-text-secondary)] shrink-0">{label}</span>
      <div className="flex rounded-lg overflow-hidden border border-[var(--color-border)]">
        {WBW_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
              value === opt
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
            }`}
          >
            {labels[opt]}
          </button>
        ))}
      </div>
    </div>
  );
}
