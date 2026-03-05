<div align="center">

<br>

# محفوظ

**Mahfuz** — Your Quran companion

[Features](#features) · [Getting Started](#getting-started) · [Contributing](#contributing)

<br>

</div>

## Features

**Reading** — Three view modes: line-by-line, word-by-word with translation/transliteration, and Mushaf page layout with a Karahisari-style illuminated border (lapis lazuli band, gold cetvel rulings, rumi corner ornaments — all pure CSS/SVG, no images).

**Audio** — Verse-level and surah-level playback with word-by-word highlight sync. Dual-element preloading for gapless transitions. Reciter selection, speed control, MediaSession for lock screen.

**Offline** — Three-layer cache: TanStack Query in memory, Dexie IndexedDB for persistence, Service Worker for full offline PWA.

**Customization** — 8 Arabic fonts, 4 color palettes, 3 themes (light/sepia/dark), independent font sizing per view mode.

## Tech Stack

React 19 · TanStack Start v1 (SSR) · TanStack Router · Vite 7 · Tailwind v4 · Zustand · Better Auth · Drizzle ORM · LibSQL · Turborepo · pnpm

Deployed on Netlify.

## Project Structure

```
apps/web              → Main web application
packages/api          → Quran.com API client
packages/audio-engine → Playback engine with word-level sync
packages/db           → IndexedDB cache layer (Dexie)
packages/shared       → Types and constants
packages/memorization → Memorization engine (planned)
packages/gamification → Achievement system (planned)
packages/sdk          → Public SDK (planned)
tooling/              → Shared ESLint, TypeScript, Tailwind configs
```

## Getting Started

```bash
git clone https://github.com/theilgaz/mahfuz.git
cd mahfuz
npx pnpm@9 install
cp apps/web/.env.example apps/web/.env  # configure auth & db
npx pnpm@9 dev                          # → http://localhost:3000
```

## Contributing

Open an issue first. PRs welcome.

```bash
npx pnpm@9 build      # build check
npx pnpm@9 typecheck   # type check
npx pnpm@9 lint        # lint
```

## License

MIT
