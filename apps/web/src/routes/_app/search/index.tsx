import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { searchQueryOptions } from "~/hooks/useSearch";

export const Route = createFileRoute("/_app/search/")({
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const { data, isLoading, isError } = useQuery(
    searchQueryOptions(submittedQuery)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(query.trim());
  };

  return (
    <div className="mx-auto max-w-[680px] px-5 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-[28px] font-semibold tracking-[-0.02em] text-[var(--theme-text)]">
        Arama
      </h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kuran'da arayın..."
            className="flex-1 rounded-xl bg-[var(--theme-input-bg)] px-4 py-2.5 text-[15px] text-[var(--theme-text)] placeholder-[var(--theme-text-tertiary)] outline-none transition-colors focus:bg-[var(--theme-bg-primary)] focus:shadow-[var(--shadow-elevated)]"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="rounded-full bg-primary-600 px-6 py-2.5 text-[15px] font-medium text-white transition-all hover:bg-primary-700 active:scale-[0.97] disabled:opacity-30"
          >
            Ara
          </button>
        </div>
      </form>

      {isLoading && (
        <p className="text-center text-[13px] text-[var(--theme-text-tertiary)]">Aranıyor...</p>
      )}

      {isError && (
        <p className="text-center text-[13px] text-red-500">
          Arama sırasında bir hata oluştu.
        </p>
      )}

      {data && (
        <div>
          <p className="mb-4 text-[13px] text-[var(--theme-text-tertiary)]">
            {data.total_results} sonuç bulundu
          </p>
          <div className="space-y-3">
            {data.results.map((result) => (
              <Link
                key={result.verse_id}
                to="/surah/$surahId"
                params={{ surahId: result.verse_key.split(":")[0] }}
                className="block rounded-2xl bg-[var(--theme-bg-primary)] p-5 transition-all hover:shadow-[var(--shadow-elevated)] active:scale-[0.995]"
              >
                <span className="mb-2 inline-block text-[12px] font-medium text-primary-600">
                  {result.verse_key}
                </span>
                <p
                  className="arabic-text mb-2 text-lg leading-relaxed text-[var(--theme-text)]"
                  dir="rtl"
                >
                  {result.text}
                </p>
                {result.translations?.[0] && (
                  <p
                    className="text-[14px] leading-relaxed text-[var(--theme-text-secondary)]"
                    dangerouslySetInnerHTML={{
                      __html: result.translations[0].text,
                    }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
