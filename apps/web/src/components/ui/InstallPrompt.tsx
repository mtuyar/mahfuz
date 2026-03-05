import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  if (!deferredPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-5 left-5 right-5 z-50 mx-auto flex max-w-sm items-center justify-between rounded-2xl bg-[#1d1d1f]/90 px-5 py-3.5 text-white shadow-[var(--shadow-modal)] backdrop-blur-xl">
      <span className="text-[13px] font-medium">Mahfuz'u cihazınıza yükleyin</span>
      <div className="flex gap-2">
        <button
          onClick={() => setDismissed(true)}
          className="rounded-full px-3 py-1 text-[13px] text-[#86868b] transition-colors hover:text-white"
        >
          Kapat
        </button>
        <button
          onClick={handleInstall}
          className="rounded-full bg-white px-4 py-1 text-[13px] font-medium text-[#1d1d1f] transition-all hover:bg-[#f5f5f7] active:scale-[0.97]"
        >
          Yükle
        </button>
      </div>
    </div>
  );
}
