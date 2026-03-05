import { QuranApiClient, type QuranApiClientOptions } from "./client";
import { ChaptersApi } from "./chapters";
import { VersesApi } from "./verses";
import { AudioApi } from "./audio";
import { TranslationsApi } from "./translations";
import { SearchApi } from "./search";
import { JuzApi } from "./juz";

export class QuranApi {
  private client: QuranApiClient;

  readonly chapters: ChaptersApi;
  readonly verses: VersesApi;
  readonly audio: AudioApi;
  readonly translations: TranslationsApi;
  readonly search: SearchApi;
  readonly juz: JuzApi;

  constructor(options?: QuranApiClientOptions) {
    this.client = new QuranApiClient(options);
    this.chapters = new ChaptersApi(this.client);
    this.verses = new VersesApi(this.client);
    this.audio = new AudioApi(this.client);
    this.translations = new TranslationsApi(this.client);
    this.search = new SearchApi(this.client);
    this.juz = new JuzApi(this.client);
  }

  setLanguage(language: string): void {
    this.client.setLanguage(language);
  }
}

// Re-export client and types
export { QuranApiClient } from "./client";
export type { QuranApiClientOptions } from "./client";
export { ChaptersApi } from "./chapters";
export { VersesApi } from "./verses";
export { AudioApi } from "./audio";
export { TranslationsApi } from "./translations";
export { SearchApi } from "./search";
export { JuzApi } from "./juz";
