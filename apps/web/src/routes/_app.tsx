import { createFileRoute, Outlet, Link, useRouter, useMatches, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { signOut } from "~/lib/auth-client";
import { AudioProvider, AudioBar } from "~/components/audio";
import { useAudioStore } from "~/stores/useAudioStore";
import { searchQueryOptions } from "~/hooks/useSearch";
import type { Chapter } from "@mahfuz/shared/types";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const NAV_ITEMS = [
  { to: "/surah", label: "Sureler", icon: BookIcon },
  { to: "/juz", label: "Cüzler", icon: LayersIcon },
  { to: "/memorize", label: "Ezberleme", icon: BrainIcon },
  { to: "/search", label: "Arama", icon: SearchIcon },
  { to: "/bookmarks", label: "Yer İmleri", icon: BookmarkIcon },
  { to: "/audio", label: "Dinleme", icon: HeadphonesIcon },
] as const;

const BOTTOM_ITEMS = [
  { to: "/surah", label: "Sureler", icon: BookIcon },
  { to: "/memorize", label: "Ezber", icon: BrainIcon },
  { to: "/search", label: "Ara", icon: SearchIcon },
  { to: "/bookmarks", label: "İmler", icon: BookmarkIcon },
  { to: "/settings", label: "Ayarlar", icon: SettingsIcon },
] as const;

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { session } = Route.useRouteContext();
  const router = useRouter();
  const audioVisible = useAudioStore((s) => s.isVisible);
  const matches = useMatches();
  const queryClient = useQueryClient();

  // Detect surah page and get chapter info from cache
  const surahMatch = matches.find((m) => m.routeId === "/_app/surah/$surahId");
  const surahId = (surahMatch?.params as { surahId?: string })?.surahId
    ? Number((surahMatch!.params as { surahId: string }).surahId)
    : null;
  const chapter = surahId
    ? queryClient.getQueryData<Chapter>(["chapter", surahId])
    : null;

  const handleSignOut = async () => {
    await signOut();
    await router.invalidate();
    router.navigate({ to: "/" });
  };

  return (
    <div className="flex h-screen flex-col bg-[var(--theme-bg)]">
      <div className="flex min-h-0 flex-1">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — macOS style */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] transform border-r border-[var(--theme-border)] bg-[var(--theme-bg)]/80 backdrop-blur-xl transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header — macOS traffic light area height */}
          <div className="flex items-center justify-between px-5 pb-2 pt-5">
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="arabic-text text-lg leading-none text-primary-600">محفوظ</span>
              <span className="text-[13px] font-semibold text-[var(--theme-text)]">
                Mahfuz
              </span>
            </Link>
            <button
              className="text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text)] lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Menüyü kapat"
            >
              <XIcon />
            </button>
          </div>

          {/* Nav items — macOS sidebar style */}
          <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pt-3">
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>

          {/* User section — bottom of sidebar (only when logged in) */}
          {session && (
            <div className="border-t border-[var(--theme-border)] px-3 py-3">
              <div className="flex items-center gap-2.5">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-[11px] font-semibold text-primary-700">
                    {session.user.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
                <span className="flex-1 truncate text-[13px] font-medium text-[var(--theme-text)]">
                  {session.user.name}
                </span>
                <button
                  onClick={handleSignOut}
                  className="rounded-lg p-1 text-[var(--theme-text-tertiary)] transition-colors hover:bg-[var(--theme-hover-bg)] hover:text-[var(--theme-text)]"
                  aria-label="Çıkış yap"
                >
                  <LogOutIcon />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header — Apple toolbar */}
        <header className="glass sticky top-0 z-30 border-b border-[var(--theme-border)] px-4 py-2.5 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button
                className="rounded-lg p-1 text-[var(--theme-text-secondary)] transition-colors hover:bg-[var(--theme-hover-bg)] hover:text-[var(--theme-text)] lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Menüyü aç"
              >
                <MenuIcon />
              </button>
              {chapter ? (
                <div className="flex items-center gap-1.5">
                  {chapter.id > 1 && (
                    <Link
                      to="/surah/$surahId"
                      params={{ surahId: String(chapter.id - 1) }}
                      className="rounded-md p-1 text-[var(--theme-text-tertiary)] transition-colors hover:bg-[var(--theme-hover-bg)] hover:text-[var(--theme-text)]"
                      aria-label="Önceki sure"
                    >
                      <ChevronLeftIcon />
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-[var(--theme-text-tertiary)]">
                      {chapter.id}
                    </span>
                    <span className="arabic-text text-base leading-none text-[var(--theme-text)]">
                      {chapter.name_arabic}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium leading-tight text-[var(--theme-text-secondary)]">
                        {chapter.translated_name.name}
                      </span>
                      <span className="text-[11px] leading-tight text-[var(--theme-text-tertiary)]">
                        {chapter.name_simple}
                      </span>
                    </div>
                  </div>
                  {chapter.id < 114 && (
                    <Link
                      to="/surah/$surahId"
                      params={{ surahId: String(chapter.id + 1) }}
                      className="rounded-md p-1 text-[var(--theme-text-tertiary)] transition-colors hover:bg-[var(--theme-hover-bg)] hover:text-[var(--theme-text)]"
                      aria-label="Sonraki sure"
                    >
                      <ChevronRightIcon />
                    </Link>
                  )}
                </div>
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="rounded-lg p-1.5 text-[var(--theme-text-secondary)] transition-colors hover:bg-[var(--theme-hover-bg)] hover:text-[var(--theme-text)]"
                aria-label="Ara"
              >
                <SearchIcon />
              </button>

              <Link
                to="/settings"
                className="rounded-lg p-1.5 text-[var(--theme-text-secondary)] transition-colors hover:bg-[var(--theme-hover-bg)] hover:text-[var(--theme-text)]"
                aria-label="Ayarlar"
              >
                <SettingsIcon />
              </Link>

              {session ? (
                <Link
                  to="/profile"
                  className="ml-1 flex items-center gap-2 rounded-full px-3 py-1 transition-colors hover:bg-[var(--theme-hover-bg)]"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-[10px] font-semibold text-primary-700">
                      {session.user.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  )}
                </Link>
              ) : (
                <Link
                  to="/auth/login"
                  className="ml-1 rounded-full bg-primary-600 px-4 py-1 text-xs font-medium text-white transition-all hover:bg-primary-700 active:scale-[0.97]"
                >
                  Giriş Yap
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Spotlight-style search overlay */}
        {searchOpen && (
          <SearchOverlay onClose={() => setSearchOpen(false)} />
        )}

        {/* Page content */}
        <main className={`flex-1 overflow-y-auto ${audioVisible ? "pb-40" : "pb-24"} lg:pb-0`}>
          <Outlet />
        </main>
      </div>
      </div>

      {/* Audio engine + player bar — spans full width */}
      <AudioProvider />
      <AudioBar />

      {/* Mobile bottom navigation — iOS tab bar */}
      <nav className="glass-heavy fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--theme-border)] lg:hidden">
        <div className="flex items-center justify-around pb-[env(safe-area-inset-bottom)] pt-1.5">
          {BOTTOM_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-0.5 px-3 py-1 text-[var(--theme-text-tertiary)] transition-colors"
              activeProps={{
                className:
                  "flex flex-col items-center gap-0.5 px-3 py-1 text-primary-600 transition-colors",
              }}
            >
              <item.icon />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.FC;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] font-medium text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-hover-bg)]"
      activeProps={{
        className:
          "flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] font-medium bg-primary-600/10 text-primary-700",
      }}
      onClick={onClick}
    >
      <Icon />
      {label}
    </Link>
  );
}

// -- Search Overlay (Spotlight-style) --

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Close on click outside
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const { data, isLoading } = useQuery(searchQueryOptions(debouncedQuery));

  const handleResultClick = (verseKey: string) => {
    const surahId = verseKey.split(":")[0];
    onClose();
    navigate({ to: "/surah/$surahId", params: { surahId } });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={overlayRef}
        className="mx-auto mt-14 w-[92%] max-w-[600px] animate-scale-in overflow-hidden rounded-2xl bg-[var(--theme-bg-primary)] shadow-[var(--shadow-modal)]"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[var(--theme-border)] px-4 py-3">
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kuran'da arayın..."
            className="flex-1 bg-transparent text-[16px] text-[var(--theme-text)] placeholder-[var(--theme-text-tertiary)] outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded-full p-0.5 text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text)]"
            >
              <XIcon />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[13px] font-medium text-primary-600"
          >
            İptal
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading && debouncedQuery && (
            <p className="px-4 py-6 text-center text-[13px] text-[var(--theme-text-tertiary)]">
              Aranıyor...
            </p>
          )}

          {data && data.results.length > 0 && (
            <div>
              <p className="px-4 pt-3 text-[11px] font-medium uppercase tracking-wider text-[var(--theme-text-quaternary)]">
                {data.total_results} sonuç
              </p>
              {data.results.map((result) => (
                <button
                  key={result.verse_id}
                  onClick={() => handleResultClick(result.verse_key)}
                  className="block w-full px-4 py-3 text-left transition-colors hover:bg-[var(--theme-hover-bg)]"
                >
                  <span className="mb-1 inline-block text-[12px] font-medium text-primary-600">
                    {result.verse_key}
                  </span>
                  <p
                    className="arabic-text text-base leading-relaxed text-[var(--theme-text)]"
                    dir="rtl"
                  >
                    {result.text}
                  </p>
                  {result.translations?.[0] && (
                    <p
                      className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[var(--theme-text-secondary)]"
                      dangerouslySetInnerHTML={{
                        __html: result.translations[0].text,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {data && data.results.length === 0 && debouncedQuery && (
            <p className="px-4 py-6 text-center text-[13px] text-[var(--theme-text-tertiary)]">
              Sonuç bulunamadı
            </p>
          )}

          {!debouncedQuery && (
            <p className="px-4 py-6 text-center text-[13px] text-[var(--theme-text-tertiary)]">
              Sure veya ayet arayın
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// -- Icons (simple inline SVG) --

function ChevronLeftIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75l-5.571-3m11.142 0l4.179 2.25L12 17.25l-9.75-5.25 4.179-2.25" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}
