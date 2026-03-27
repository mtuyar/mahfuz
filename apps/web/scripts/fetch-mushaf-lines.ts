/**
 * quran.com API'den sayfa bazlı kelime + satır numarası çeker → public/mushaf-lines/{page}.json
 *
 * Format: { lines: [{ words: [{ t: "text_uthmani", c: "word"|"end"|"pause" }] }] }
 *   - lines[0] = 1. satır, lines[14] = 15. satır (Medine Mushafı)
 *   - "c" = char_type_name (word / end / pause)
 *
 * Kullanım: npx tsx scripts/fetch-mushaf-lines.ts
 *           npx tsx scripts/fetch-mushaf-lines.ts 1 20   # sayfa 1-20 arası
 */

const API_BASE = "https://api.quran.com/api/v4/verses/by_page";
const OUT_DIR = "public/mushaf-lines";
const DELAY_MS = 350;
const TOTAL_PAGES = 604;

interface LineWord {
  /** text_uthmani */
  t: string;
  /** char_type: w=word, e=end, p=pause */
  c: "w" | "e" | "p";
}

interface PageLines {
  lines: { words: LineWord[] }[];
}

function charTypeShort(ct: string): "w" | "e" | "p" {
  if (ct === "end") return "e";
  if (ct === "pause") return "p";
  return "w";
}

async function fetchPage(page: number): Promise<PageLines> {
  const lines: Map<number, LineWord[]> = new Map();
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const url = `${API_BASE}/${page}?words=true&word_fields=text_uthmani&per_page=50&page=${currentPage}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for page ${page}`);
    const data = await res.json();
    totalPages = data.pagination.total_pages;

    for (const verse of data.verses) {
      for (const w of verse.words) {
        const ln = w.line_number as number;
        if (!lines.has(ln)) lines.set(ln, []);
        lines.get(ln)!.push({
          t: w.text_uthmani,
          c: charTypeShort(w.char_type_name),
        });
      }
    }
    currentPage++;
  }

  // Satır numarasına göre sırala
  const sorted = [...lines.entries()].sort((a, b) => a[0] - b[0]);
  return { lines: sorted.map(([, words]) => ({ words })) };
}

async function main() {
  const fs = await import("node:fs");
  const path = await import("node:path");

  const args = process.argv.slice(2);
  const startPage = args[0] ? parseInt(args[0], 10) : 1;
  const endPage = args[1] ? parseInt(args[1], 10) : TOTAL_PAGES;

  const outDir = path.resolve(OUT_DIR);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Mushaf satır verisi çekiliyor (sayfa ${startPage}-${endPage})...\n`);

  let success = 0;
  let fail = 0;

  for (let page = startPage; page <= endPage; page++) {
    try {
      const data = await fetchPage(page);
      const outPath = path.join(outDir, `${page}.json`);
      fs.writeFileSync(outPath, JSON.stringify(data));
      const totalWords = data.lines.reduce((s, l) => s + l.words.length, 0);
      console.log(`  ✓ Sayfa ${page} — ${data.lines.length} satır, ${totalWords} kelime`);
      success++;
    } catch (err) {
      console.error(`  ✗ Sayfa ${page} — ${err}`);
      fail++;
    }

    if (page < endPage) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\nTamamlandı! ${success} başarılı, ${fail} hatalı.`);
}

main();
