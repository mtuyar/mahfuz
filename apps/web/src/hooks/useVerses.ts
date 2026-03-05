import { queryOptions } from "@tanstack/react-query";
import { quranApi } from "~/lib/api";
import { TURKISH_TRANSLATIONS } from "@mahfuz/shared/constants";
import type { GetVersesParams } from "@mahfuz/shared/types";

const DEFAULT_VERSE_PARAMS: GetVersesParams = {
  words: true,
  translations: [TURKISH_TRANSLATIONS.DIYANET],
  perPage: 50,
  wordFields: ["text_uthmani", "text_imlaei"],
  translationFields: ["text", "resource_name"],
  fields: ["text_uthmani", "text_imlaei"],
};

export const versesByChapterQueryOptions = (
  chapterId: number,
  page: number = 1,
  params: GetVersesParams = {}
) =>
  queryOptions({
    queryKey: ["verses", "chapter", chapterId, page, params],
    queryFn: () =>
      quranApi.verses.byChapter(chapterId, {
        ...DEFAULT_VERSE_PARAMS,
        ...params,
        page,
      }),
  });

export const versesByPageQueryOptions = (
  pageNumber: number,
  params: GetVersesParams = {}
) =>
  queryOptions({
    queryKey: ["verses", "page", pageNumber, params],
    queryFn: () =>
      quranApi.verses.byPage(pageNumber, {
        ...DEFAULT_VERSE_PARAMS,
        ...params,
      }),
  });

export const versesByJuzQueryOptions = (
  juzNumber: number,
  page: number = 1,
  params: GetVersesParams = {}
) =>
  queryOptions({
    queryKey: ["verses", "juz", juzNumber, page, params],
    queryFn: () =>
      quranApi.verses.byJuz(juzNumber, {
        ...DEFAULT_VERSE_PARAMS,
        ...params,
        page,
      }),
  });

export const verseByKeyQueryOptions = (
  verseKey: string,
  params: GetVersesParams = {}
) =>
  queryOptions({
    queryKey: ["verse", verseKey, params],
    queryFn: () =>
      quranApi.verses.byKey(verseKey, {
        ...DEFAULT_VERSE_PARAMS,
        ...params,
      }),
  });
