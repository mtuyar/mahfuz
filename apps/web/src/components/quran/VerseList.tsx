import type { Verse } from "@mahfuz/shared/types";
import { AyahText } from "./AyahText";
import { MushafView } from "./MushafView";
import { usePreferencesStore } from "~/stores/usePreferencesStore";

interface VerseListProps {
  verses: Verse[];
  showTranslation?: boolean;
  onPlayFromVerse?: (verseKey: string) => void;
}

export function VerseList({
  verses,
  showTranslation = true,
  onPlayFromVerse,
}: VerseListProps) {
  const viewMode = usePreferencesStore((s) => s.viewMode);

  if (viewMode === "mushaf") {
    return <MushafView verses={verses} />;
  }

  return (
    <div className="divide-y divide-[var(--theme-divider)]/40">
      {verses.map((verse) => (
        <AyahText
          key={verse.id}
          verse={verse}
          showTranslation={showTranslation}
          onPlayFromVerse={onPlayFromVerse}
        />
      ))}
    </div>
  );
}
