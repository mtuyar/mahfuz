import { queryOptions } from "@tanstack/react-query";
import { quranApi } from "~/lib/api";

export const recitersQueryOptions = () =>
  queryOptions({
    queryKey: ["reciters"],
    queryFn: () => quranApi.audio.listReciters(),
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days — static data
  });

export const verseAudioQueryOptions = (reciterId: number, chapterId: number) =>
  queryOptions({
    queryKey: ["verseAudio", reciterId, chapterId],
    queryFn: () => quranApi.audio.getVerseAudio(reciterId, chapterId),
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

export const chapterAudioQueryOptions = (
  reciterId: number,
  chapterId: number,
) =>
  queryOptions({
    queryKey: ["chapterAudio", reciterId, chapterId],
    queryFn: () => quranApi.audio.getChapterAudio(reciterId, chapterId),
    staleTime: 30 * 24 * 60 * 60 * 1000,
  });
