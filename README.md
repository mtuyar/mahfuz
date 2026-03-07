<div align="center">

<br>

<img src="apps/web/public/icons/icon-512.png" width="280" alt="Mahfuz">

<br><br>

# Mahfuz · محفوظ

A minimal, distraction free Quran reading experience on the web.

**[mahfuz.ilg.az](https://mahfuz.ilg.az)**

<br>

</div>

## About

Mahfuz is a Quran companion designed around simplicity. No clutter, no ads, just the text and the tools you need to read, listen, and learn.

Three view modes let you choose how to engage with the Quran: a clean line by line layout for focused reading, a word by word breakdown with inline translation and transliteration for deeper understanding, and a traditional Mushaf page with Karahisari style illuminated borders crafted entirely in CSS and SVG.

Audio playback runs at the verse or surah level with real time word highlighting, gapless preloading between verses, reciter selection, adjustable speed, and lock screen controls via MediaSession. Everything works offline through a three layer caching strategy combining in memory, IndexedDB, and Service Worker.

The interface stays minimal on purpose. Typography, spacing, and color choices are carefully considered so nothing gets between you and the Quran.

## Where We're Headed

Mahfuz is just getting started. The reading and listening experience is live today, but there is much more planned:

**Memorization** · Spaced repetition, progress tracking per surah and ayah, quiz modes with hide and recall, daily goals and streaks.

**Gamification** · Achievement badges, reading challenges, and optional leaderboards to keep you motivated.

**Quran Education** · Curated content and interactive tools to support learning tajweed, tafsir context, and deeper study.

**Mobile Apps** · Native Android and iOS applications are on the roadmap.

## Contributing

We'd love to have talented developers join the journey. Whether you're into React, mobile development, or just passionate about building tools for the Quran, there's a place for you here.

Start by opening an issue to discuss your idea, then send a PR.

```bash
git clone https://github.com/theilgaz/mahfuz.git
cd mahfuz
npx pnpm@9 install
cp apps/web/.env.example apps/web/.env
npx pnpm@9 dev
```

The dev server runs at `http://localhost:3000`.

## Tech

React 19 · TanStack Start (SSR) · TanStack Router · Vite 7 · Tailwind v4 · Zustand · Better Auth · Drizzle ORM · LibSQL · Turborepo · pnpm · Netlify

## Structure

```
apps/web              Main web application
packages/api          Quran.com API client
packages/audio-engine Playback engine with word level sync
packages/db           IndexedDB cache layer (Dexie)
packages/shared       Types and constants
tooling/              Shared ESLint, TypeScript, Tailwind configs
```

## License

MIT
