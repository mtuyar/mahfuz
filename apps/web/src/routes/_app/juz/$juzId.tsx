import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { versesByJuzQueryOptions } from "~/hooks/useVerses";
import { VerseList, Pagination } from "~/components/quran";
import { Loading } from "~/components/ui/Loading";
import { TOTAL_JUZ } from "@mahfuz/shared/constants";

export const Route = createFileRoute("/_app/juz/$juzId")({
  loader: ({ context, params }) => {
    const juzId = Number(params.juzId);
    return context.queryClient.ensureQueryData(
      versesByJuzQueryOptions(juzId, 1)
    );
  },
  pendingComponent: () => <Loading text="Cüz yükleniyor..." />,
  head: ({ params }) => ({
    meta: [{ title: `Cüz ${params.juzId} | Mahfuz` }],
  }),
  component: JuzView,
});

function JuzView() {
  const { juzId } = Route.useParams();
  const juzNumber = Number(juzId);
  const [page, setPage] = useState(1);

  const { data } = useSuspenseQuery(versesByJuzQueryOptions(juzNumber, page));

  const hasPrev = juzNumber > 1;
  const hasNext = juzNumber < TOTAL_JUZ;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Cüz {juzNumber}</h1>
        <p className="text-sm text-gray-500">
          {data.pagination.total_records} ayet
        </p>
      </div>

      <VerseList verses={data.verses} showTranslation={true} />

      <Pagination pagination={data.pagination} onPageChange={setPage} />

      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
        {hasPrev ? (
          <Link
            to="/juz/$juzId"
            params={{ juzId: String(juzNumber - 1) }}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
            onClick={() => setPage(1)}
          >
            ← Önceki Cüz
          </Link>
        ) : (
          <span />
        )}
        {hasNext ? (
          <Link
            to="/juz/$juzId"
            params={{ juzId: String(juzNumber + 1) }}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
            onClick={() => setPage(1)}
          >
            Sonraki Cüz →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
