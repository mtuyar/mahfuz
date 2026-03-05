import type { QuranApiClient } from "./client";
import type {
  Reciter,
  RecitersResponse,
  VerseAudioResponse,
  ChapterAudioResponse,
} from "@mahfuz/shared/types";
import { CACHE_TTL } from "@mahfuz/shared/constants";

export class AudioApi {
  constructor(private client: QuranApiClient) {}

  /** List all reciters */
  async listReciters(): Promise<Reciter[]> {
    const response = await this.client.get<RecitersResponse>(
      "/resources/recitations",
      undefined,
      CACHE_TTL.RECITERS,
    );
    return response.reciters;
  }

  /** Get audio for a full chapter by a specific reciter */
  async getChapterAudio(
    reciterId: number,
    chapterId: number
  ): Promise<ChapterAudioResponse["audio_file"]> {
    const response = await this.client.get<ChapterAudioResponse>(
      `/chapter_recitations/${reciterId}/${chapterId}`,
      undefined,
      CACHE_TTL.AUDIO,
    );
    return response.audio_file;
  }

  /** Get verse-by-verse audio with timing segments */
  async getVerseAudio(
    reciterId: number,
    chapterId: number
  ): Promise<VerseAudioResponse["audio_files"]> {
    const response = await this.client.get<VerseAudioResponse>(
      `/recitations/${reciterId}/by_chapter/${chapterId}`,
      { per_page: 300 },
      CACHE_TTL.AUDIO,
    );
    return response.audio_files;
  }
}
