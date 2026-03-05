import type { QuranApiClient } from "./client";
import type { SearchResponse, SearchResult } from "@mahfuz/shared/types";
import { CACHE_TTL } from "@mahfuz/shared/constants";

export class SearchApi {
  constructor(private client: QuranApiClient) {}

  /** Search the Quran */
  async search(
    query: string,
    options: {
      size?: number;
      page?: number;
      language?: string;
    } = {}
  ): Promise<SearchResult> {
    const response = await this.client.get<SearchResponse>(
      "/search",
      {
        q: query,
        size: options.size ?? 20,
        page: options.page ?? 1,
        language: options.language,
      },
      CACHE_TTL.SEARCH,
    );
    return response.search;
  }
}
