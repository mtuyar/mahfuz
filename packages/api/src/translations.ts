import type { QuranApiClient } from "./client";
import type {
  TranslationResource,
  TranslationResourcesResponse,
  TafsirResource,
  TafsirResourcesResponse,
  Tafsir,
} from "@mahfuz/shared/types";
import { CACHE_TTL } from "@mahfuz/shared/constants";

export class TranslationsApi {
  constructor(private client: QuranApiClient) {}

  /** List available translation resources */
  async listResources(): Promise<TranslationResource[]> {
    const response = await this.client.get<TranslationResourcesResponse>(
      "/resources/translations",
      undefined,
      CACHE_TTL.TRANSLATIONS,
    );
    return response.translations;
  }

  /** List available tafsir resources */
  async listTafsirResources(): Promise<TafsirResource[]> {
    const response = await this.client.get<TafsirResourcesResponse>(
      "/resources/tafsirs",
      undefined,
      CACHE_TTL.TRANSLATIONS,
    );
    return response.tafsirs;
  }

  /** Get tafsir for a specific verse */
  async getTafsir(
    tafsirId: number,
    verseKey: string
  ): Promise<Tafsir> {
    const response = await this.client.get<{ tafsir: Tafsir }>(
      `/tafsirs/${tafsirId}/by_ayah/${verseKey}`,
      undefined,
      CACHE_TTL.TRANSLATIONS,
    );
    return response.tafsir;
  }
}
