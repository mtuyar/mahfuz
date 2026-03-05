import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_protected/memorize/")({
  component: MemorizePage,
});

function MemorizePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Ezberleme</h1>
      <p className="text-gray-500">Hafızlık paneli yakında eklenecek.</p>
    </div>
  );
}
