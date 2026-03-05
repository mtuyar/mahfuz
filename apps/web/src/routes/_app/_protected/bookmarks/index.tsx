import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_protected/bookmarks/")({
  component: BookmarksPage,
});

function BookmarksPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Yer İmleri</h1>
      <p className="text-gray-500">Yer imleri sistemi yakında eklenecek.</p>
    </div>
  );
}
