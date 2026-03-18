import type { Verse } from "@mahfuz/shared/types";

interface TranslationViewProps {
  verse: Verse;
}

export function TranslationView({ verse }: TranslationViewProps) {
  if (!verse.translations || verse.translations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {verse.translations.map((t) => (
        <div key={t.id} className="rounded-2xl bg-[var(--theme-pill-bg)] p-5">
          <p
            className="font-sans text-[15px] leading-relaxed text-[var(--theme-text)]"
            dangerouslySetInnerHTML={{ __html: t.text }}
          />
          <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-[var(--theme-text-tertiary)]">
            {t.resource_name}
          </p>
        </div>
      ))}
    </div>
  );
}
