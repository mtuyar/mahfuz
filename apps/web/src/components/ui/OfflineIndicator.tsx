import { useOnlineStatus } from "~/hooks/useOnlineStatus";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="glass-dark px-4 py-2 text-center text-[13px] font-medium text-white">
      Çevrimdışısınız — Önbellek verileri gösteriliyor
    </div>
  );
}
