import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { chapterQueryOptions } from "~/hooks/useChapters";
import { versesByChapterQueryOptions } from "~/hooks/useVerses";
import { verseAudioQueryOptions } from "~/hooks/useAudio";
import { SurahHeader, Bismillah, VerseList, Pagination, ReadingToolbar } from "~/components/quran";
import { Loading } from "~/components/ui/Loading";
import { SegmentedControl } from "~/components/ui/SegmentedControl";
import { TOTAL_CHAPTERS } from "@mahfuz/shared/constants";
import { usePreferencesStore } from "~/stores/usePreferencesStore";
import type { ViewMode } from "~/stores/usePreferencesStore";
import { useAudioStore } from "~/stores/useAudioStore";
import { useAutoScrollToVerse } from "~/hooks/useAutoScrollToVerse";
import type { VerseAudioData } from "@mahfuz/audio-engine";

export const Route = createFileRoute("/_app/surah/$surahId")({
  loader: ({ context, params }) => {
    const chapterId = Number(params.surahId);
    return Promise.all([
      context.queryClient.ensureQueryData(chapterQueryOptions(chapterId)),
      context.queryClient.ensureQueryData(
        versesByChapterQueryOptions(chapterId, 1)
      ),
    ]);
  },
  pendingComponent: () => <Loading text="Sure yükleniyor..." />,
  head: ({ loaderData }) => {
    const chapter = loaderData?.[0];
    if (!chapter) return {};
    return {
      meta: [
        {
          title: `${chapter.translated_name.name} (${chapter.name_simple}) | Mahfuz`,
        },
      ],
    };
  },
  component: SurahView,
});

const VIEW_MODE_OPTIONS: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
  {
    value: "normal",
    label: "Normal",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 4h10M3 8h7M3 12h10" />
      </svg>
    ),
  },
  {
    value: "wordByWord",
    label: "Kelime",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="1.5" y="3" width="4" height="4.5" rx="1" />
        <rect x="7.5" y="3" width="4" height="4.5" rx="1" />
        <rect x="1.5" y="9.5" width="4" height="4.5" rx="1" />
        <rect x="7.5" y="9.5" width="4" height="4.5" rx="1" />
      </svg>
    ),
  },
  {
    value: "mushaf",
    label: "Mushaf",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 2.5h4.5a1.5 1.5 0 0 1 1.5 1.5v10S6.5 13 4.25 13 2 14 2 14V2.5z" />
        <path d="M14 2.5H9.5A1.5 1.5 0 0 0 8 4v10s1.5-1 3.75-1S14 14 14 14V2.5z" />
      </svg>
    ),
  },
];

function SurahView() {
  const { surahId } = Route.useParams();
  const chapterId = Number(surahId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const viewMode = usePreferencesStore((s) => s.viewMode);
  const setViewMode = usePreferencesStore((s) => s.setViewMode);
  const showTranslation = usePreferencesStore((s) => s.showTranslation);

  const reciterId = useAudioStore((s) => s.reciterId);
  const playSurah = useAudioStore((s) => s.playSurah);
  const playVerse = useAudioStore((s) => s.playVerse);
  const playbackState = useAudioStore((s) => s.playbackState);
  const audioChapterId = useAudioStore((s) => s.chapterId);
  const togglePlayPause = useAudioStore((s) => s.togglePlayPause);

  const { data: chapter } = useSuspenseQuery(chapterQueryOptions(chapterId));
  const { data: versesData } = useSuspenseQuery(
    versesByChapterQueryOptions(chapterId, page)
  );

  useAutoScrollToVerse();

  const isPlayingThisSurah =
    audioChapterId === chapterId &&
    (playbackState === "playing" || playbackState === "loading");

  const fetchAudioData = useCallback(async (): Promise<VerseAudioData[]> => {
    const audioFiles = await queryClient.fetchQuery(
      verseAudioQueryOptions(reciterId, chapterId),
    );
    return audioFiles.map((f) => ({
      verseKey: f.verse_key,
      url: f.url,
      segments: f.segments,
    }));
  }, [queryClient, reciterId, chapterId]);

  const handlePlaySurah = useCallback(async () => {
    if (isPlayingThisSurah) {
      togglePlayPause();
      return;
    }
    const audioData = await fetchAudioData();
    playSurah(chapterId, chapter.translated_name.name, audioData);
  }, [
    isPlayingThisSurah,
    togglePlayPause,
    fetchAudioData,
    playSurah,
    chapterId,
    chapter.translated_name.name,
  ]);

  const handlePlayFromVerse = useCallback(
    async (verseKey: string) => {
      const audioData = await fetchAudioData();
      playVerse(
        chapterId,
        chapter.translated_name.name,
        verseKey,
        audioData,
      );
    },
    [fetchAudioData, playVerse, chapterId, chapter.translated_name.name],
  );

  const hasPrev = chapterId > 1;
  const hasNext = chapterId < TOTAL_CHAPTERS;

  return (
    <div className="mx-auto max-w-[680px] px-5 py-8 sm:px-6 sm:py-10">
      <SurahHeader
        chapter={chapter}
        onPlay={handlePlaySurah}
        isPlaying={isPlayingThisSurah}
      />

      {/* View mode controls + Reading toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <SegmentedControl options={VIEW_MODE_OPTIONS} value={viewMode} onChange={setViewMode} />
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[var(--theme-text-tertiary)]">
            Sayfa {chapter.pages[0]}-{chapter.pages[1]}
          </span>
          <ReadingToolbar />
        </div>
      </div>

      {/* Bismillah */}
      {chapter.bismillah_pre && <Bismillah />}

      {/* Verses */}
      <VerseList
        verses={versesData.verses}
        showTranslation={showTranslation}
        onPlayFromVerse={handlePlayFromVerse}
      />

      {/* Pagination */}
      <Pagination pagination={versesData.pagination} onPageChange={setPage} />

      {/* Prev/Next surah navigation */}
      <div className="mt-10 flex items-center justify-between border-t border-[var(--theme-divider)]/40 pt-6">
        {hasPrev ? (
          <Link
            to="/surah/$surahId"
            params={{ surahId: String(chapterId - 1) }}
            className="text-[15px] font-medium text-primary-600 transition-colors hover:text-primary-700"
            onClick={() => setPage(1)}
          >
            ← Önceki Sure
          </Link>
        ) : (
          <span />
        )}
        {hasNext ? (
          <Link
            to="/surah/$surahId"
            params={{ surahId: String(chapterId + 1) }}
            className="text-[15px] font-medium text-primary-600 transition-colors hover:text-primary-700"
            onClick={() => setPage(1)}
          >
            Sonraki Sure →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

