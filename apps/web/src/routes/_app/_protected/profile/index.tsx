import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_protected/profile/")({
  component: ProfilePage,
});

function ProfilePage() {
  const { session } = Route.useRouteContext();

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-[var(--theme-text)]">Profil</h1>
      <div className="rounded-2xl bg-[var(--theme-bg-primary)] p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-semibold text-primary-700">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-[var(--theme-text)]">
              {session?.user?.name || "Kullanıcı"}
            </h2>
            <p className="text-[13px] text-[var(--theme-text-tertiary)]">
              {session?.user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
