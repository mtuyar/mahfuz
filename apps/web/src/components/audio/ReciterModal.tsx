import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { recitersQueryOptions } from "~/hooks/useAudio";
import { useAudioStore } from "~/stores/useAudioStore";

interface ReciterModalProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (reciterId: number) => void;
}

export function ReciterModal({ open, onClose, onSelect }: ReciterModalProps) {
  const [search, setSearch] = useState("");
  const reciterId = useAudioStore((s) => s.reciterId);
  const setReciter = useAudioStore((s) => s.setReciter);
  const { data: reciters, isLoading } = useQuery(recitersQueryOptions());

  if (!open) return null;

  const filtered = reciters?.filter(
    (r) =>
      r.reciter_name.toLowerCase().includes(search.toLowerCase()) ||
      r.translated_name.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (id: number) => {
    if (onSelect) {
      onSelect(id);
    } else {
      setReciter(id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg animate-slide-up rounded-t-2xl bg-[var(--theme-bg-primary)] p-5 shadow-modal sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-[var(--theme-text)]">
            Kari Secimi
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[var(--theme-text-tertiary)] transition-colors hover:bg-[var(--theme-hover-bg)] hover:text-[var(--theme-text)]"
            aria-label="Kapat"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <input
          type="text"
          placeholder="Kari ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3 w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-input-bg)] px-4 py-2.5 text-[14px] text-[var(--theme-text)] outline-none placeholder:text-[var(--theme-text-quaternary)] focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20"
        />

        <div className="max-h-[50vh] overflow-y-auto">
          {isLoading ? (
            <p className="py-8 text-center text-[13px] text-[var(--theme-text-tertiary)]">
              Yükleniyor...
            </p>
          ) : filtered && filtered.length > 0 ? (
            <div className="space-y-0.5">
              {filtered.map((r) => {
                const isActive = r.id === reciterId;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelect(r.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? "bg-primary-600/10 text-primary-700"
                        : "text-[var(--theme-text)] hover:bg-[var(--theme-hover-bg)]"
                    }`}
                  >
                    <span className="flex-1">
                      <span className="block text-[14px] font-medium">
                        {r.reciter_name}
                      </span>
                      {r.style && (
                        <span className="block text-[12px] text-[var(--theme-text-tertiary)]">
                          {r.style.name}
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <svg
                        className="h-4 w-4 flex-shrink-0 text-primary-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-[13px] text-[var(--theme-text-tertiary)]">
              Sonuc bulunamadi.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
