import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/share/$verseKey")({
  head: ({ params }) => ({
    meta: [
      { title: `Kuran-ı Kerim | ${params.verseKey} | Mahfuz` },
      {
        name: "description",
        content: `Kuran-ı Kerim ${params.verseKey} ayetini okuyun.`,
      },
      { property: "og:title", content: `Kuran-ı Kerim — ${params.verseKey}` },
      {
        property: "og:description",
        content: `Kuran-ı Kerim ${params.verseKey} ayetini okuyun.`,
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: ShareVersePage,
});

function ShareVersePage() {
  const { verseKey } = Route.useParams();

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-sm text-gray-500">Kuran-ı Kerim</p>
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Ayet {verseKey}
        </h1>
        <p className="text-gray-500">
          Ayet paylaşım sayfası Faz 8'de SSR + OG image ile tamamlanacak.
        </p>
      </div>
    </div>
  );
}
