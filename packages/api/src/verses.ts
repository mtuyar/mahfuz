import type { QuranApiClient } from "./client";
import type {
  Verse,
  VersesResponse,
  GetVersesParams,
} from "@mahfuz/shared/types";
import { DEFAULT_PER_PAGE, CACHE_TTL } from "@mahfuz/shared/constants";

export class VersesApi {
  constructor(private client: QuranApiClient) {}

  /** Get verses by chapter */
  async byChapter(
    chapterId: number,
    params: GetVersesParams = {}
  ): Promise<VersesResponse> {
    return this.client.get<VersesResponse>(
      `/verses/by_chapter/${chapterId}`,
      this.buildParams(params),
      CACHE_TTL.VERSES,
    );
  }

  /** Get verses by page number */
  async byPage(
    pageNumber: number,
    params: GetVersesParams = {}
  ): Promise<VersesResponse> {
    return this.client.get<VersesResponse>(
      `/verses/by_page/${pageNumber}`,
      this.buildParams(params),
      CACHE_TTL.VERSES,
    );
  }

  /** Get verses by juz number */
  async byJuz(
    juzNumber: number,
    params: GetVersesParams = {}
  ): Promise<VersesResponse> {
    return this.client.get<VersesResponse>(
      `/verses/by_juz/${juzNumber}`,
      this.buildParams(params),
      CACHE_TTL.VERSES,
    );
  }

  /** Get a specific verse by key (e.g. "2:255") */
  async byKey(
    verseKey: string,
    params: GetVersesParams = {}
  ): Promise<Verse> {
    const response = await this.client.get<{ verse: Verse }>(
      `/verses/by_key/${verseKey}`,
      this.buildParams(params),
      CACHE_TTL.VERSES,
    );
    return response.verse;
  }

  private buildParams(
    params: GetVersesParams
  ): Record<string, string | number | boolean | undefined> {
    return {
      page: params.page,
      per_page: params.perPage ?? DEFAULT_PER_PAGE,
      words: params.words,
      translations: params.translations?.join(","),
      tafsirs: params.tafsirs?.join(","),
      word_fields: params.wordFields?.join(","),
      translation_fields: params.translationFields?.join(","),
      fields: params.fields?.join(","),
    };
  }
}
