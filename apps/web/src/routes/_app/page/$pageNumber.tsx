import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { versesByPageQueryOptions } from "~/hooks/useVerses";
import { VerseList } from "~/components/quran";
import { Loading } from "~/components/ui/Loading";
import { TOTAL_PAGES } from "@mahfuz/shared/constants";

export const Route = createFileRoute("/_app/page/$pageNumber")({
  loader: ({ context, params }) => {
    const pageNum = Number(params.pageNumber);
    return context.queryClient.ensureQueryData(
      versesByPageQueryOptions(pageNum)
    );
  },
  pendingComponent: () => <Loading text="Sayfa yükleniyor..." />,
  head: ({ params }) => ({
    meta: [{ title: `Sayfa ${params.pageNumber} | Mahfuz` }],
  }),
  component: MushafPageView,
});

function MushafPageView() {
  const { pageNumber } = Route.useParams();
  const pageNum = Number(pageNumber);

  const { data } = useSuspenseQuery(versesByPageQueryOptions(pageNum));

  const hasPrev = pageNum > 1;
  const hasNext = pageNum < TOTAL_PAGES;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Sayfa {pageNum}</h1>
        <p className="text-sm text-gray-500">
          {data.pagination.total_records} ayet
        </p>
      </div>

      <VerseList verses={data.verses} showTranslation={true} />

      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
        {hasPrev ? (
          <Link
            to="/page/$pageNumber"
            params={{ pageNumber: String(pageNum - 1) }}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            ← Önceki Sayfa
          </Link>
        ) : (
          <span />
        )}
        <span className="text-sm text-gray-400">{pageNum} / {TOTAL_PAGES}</span>
        {hasNext ? (
          <Link
            to="/page/$pageNumber"
            params={{ pageNumber: String(pageNum + 1) }}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Sonraki Sayfa →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
