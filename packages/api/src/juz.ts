import type { QuranApiClient } from "./client";
import type { Juz, JuzResponse } from "@mahfuz/shared/types";
import { CACHE_TTL } from "@mahfuz/shared/constants";

export class JuzApi {
  constructor(private client: QuranApiClient) {}

  /** List all 30 juz */
  async list(): Promise<Juz[]> {
    const response = await this.client.get<JuzResponse>(
      "/juzs",
      undefined,
      CACHE_TTL.CHAPTERS,
    );
    return response.juzs;
  }
}
