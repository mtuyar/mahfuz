import { useEffect } from "react";
import { useAudioStore } from "~/stores/useAudioStore";

export function useAutoScrollToVerse() {
  const currentVerseKey = useAudioStore((s) => s.currentVerseKey);
  const playbackState = useAudioStore((s) => s.playbackState);

  useEffect(() => {
    if (!currentVerseKey || playbackState !== "playing") return;

    const el = document.getElementById(`verse-${currentVerseKey}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentVerseKey, playbackState]);
}
