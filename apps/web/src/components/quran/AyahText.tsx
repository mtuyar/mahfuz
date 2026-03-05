import { useState, useEffect } from "react";
import type { Verse } from "@mahfuz/shared/types";
import { WordByWord } from "./WordByWord";
import { usePreferencesStore, getActiveColors } from "~/stores/usePreferencesStore";
import type { ViewMode } from "~/stores/usePreferencesStore";
import { useAudioStore } from "~/stores/useAudioStore";

interface AyahTextProps {
  verse: Verse;
  viewMode?: ViewMode;
  showTranslation?: boolean;
  onPlayFromVerse?: (verseKey: string) => void;
}

export function AyahText({
  verse,
  viewMode: viewModeProp,
  showTranslation = true,
  onPlayFromVerse,
}: AyahTextProps) {
  const storeViewMode = usePreferencesStore((s) => s.viewMode);
  const colorizeWords = usePreferencesStore((s) => s.colorizeWords);
  const colorPaletteId = usePreferencesStore((s) => s.colorPaletteId);
  const colors = getActiveColors({ colorPaletteId });
  const viewMode = viewModeProp ?? storeViewMode;

  const currentVerseKey = useAudioStore((s) => s.currentVerseKey);
  const currentWordPosition = useAudioStore((s) => s.currentWordPosition);
  const playbackState = useAudioStore((s) => s.playbackState);

  const isCurrentVerse = currentVerseKey === verse.verse_key;
  const isAudioPlaying = playbackState === "playing" || playbackState === "paused";
  const activeWordPos =
    isCurrentVerse && playbackState === "playing" ? currentWordPosition : null;

  // Tap-to-reveal: local state for temporarily showing translation
  const [revealed, setRevealed] = useState(false);

  // Reset revealed when showTranslation becomes true
  useEffect(() => {
    if (showTranslation) setRevealed(false);
  }, [showTranslation]);

  const effectiveShowTranslation = showTranslation || revealed;

  return (
    <div
      id={`verse-${verse.verse_key}`}
      className={`animate-fade-in group px-4 py-7 transition-colors sm:px-6 ${
        isCurrentVerse && isAudioPlaying
          ? "bg-primary-50/40"
          : "hover:bg-[var(--theme-hover-bg)]"
      } ${!showTranslation && !revealed ? "cursor-pointer" : ""}`}
      onClick={
        !showTranslation && !revealed
          ? () => setRevealed(true)
          : undefined
      }
    >
      {/* Verse number + Arabic text */}
      <div className="mb-4 flex items-start gap-4">
        <div className="relative mt-2 flex-shrink-0">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--theme-verse-number-bg)] text-[11px] font-semibold tabular-nums text-[var(--theme-text-secondary)]">
            {verse.verse_number}
          </span>
          {/* Play-from-verse button on hover */}
          {onPlayFromVerse && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayFromVerse(verse.verse_key);
              }}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-primary-600 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label={`Ayet ${verse.verse_number}'den dinle`}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            </button>
          )}
        </div>
        <div className="min-w-0 flex-1" dir="rtl">
          {viewMode === "wordByWord" && verse.words ? (
            <WordByWord
              words={verse.words}
              colorizeWords={colorizeWords}
              colors={colors}
              activeWordPosition={activeWordPos}
            />
          ) : (
            <p className="arabic-text text-[1.65rem] leading-[2.6] text-[var(--theme-text)]">
              {verse.words
                ? verse.words
                    .filter((w) => w.char_type_name === "word")
                    .map((w, i) => {
                      const isActiveWord =
                        activeWordPos !== null && w.position === activeWordPos;
                      return (
                        <span
                          key={w.id}
                          className={`word-highlight ${isActiveWord ? "active" : ""}`}
                          style={
                            colorizeWords && colors.length > 0
                              ? { color: isActiveWord ? undefined : colors[i % colors.length] }
                              : undefined
                          }
                        >
                          {w.text_uthmani}{" "}
                        </span>
                      );
                    })
                : verse.text_uthmani}
            </p>
          )}
        </div>
      </div>

      {/* Translation */}
      {effectiveShowTranslation && verse.translations && verse.translations.length > 0 && (
        <div
          className={`border-l-2 border-[var(--theme-translation-accent)] py-1 pl-4 sm:ml-[44px] ${
            revealed && !showTranslation ? "animate-reveal" : ""
          }`}
        >
          {verse.translations.map((t) => (
            <div key={t.id}>
              <p
                className="translation-text text-[15px] leading-[1.8] text-[var(--theme-text-secondary)]"
                dangerouslySetInnerHTML={{ __html: t.text }}
              />
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-[var(--theme-text-quaternary)]">
                {t.resource_name}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
