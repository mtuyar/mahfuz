import type { QuranApiClient } from "./client";
import type {
  Chapter,
  ChaptersResponse,
} from "@mahfuz/shared/types";
import { CACHE_TTL } from "@mahfuz/shared/constants";

export class ChaptersApi {
  constructor(private client: QuranApiClient) {}

  /** List all 114 chapters */
  async list(): Promise<Chapter[]> {
    const response = await this.client.get<ChaptersResponse>(
      "/chapters",
      undefined,
      CACHE_TTL.CHAPTERS,
    );
    return response.chapters;
  }

  /** Get a single chapter by ID (1-114) */
  async get(chapterId: number): Promise<Chapter> {
    const response = await this.client.get<{ chapter: Chapter }>(
      `/chapters/${chapterId}`,
      undefined,
      CACHE_TTL.CHAPTERS,
    );
    return response.chapter;
  }
}
