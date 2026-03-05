interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({
  message = "Bir hata oluştu. Lütfen tekrar deneyin.",
  onRetry,
}: ErrorViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-28">
      <h2 className="mb-1 text-[17px] font-semibold text-[#1d1d1f]">
        Bir Şeyler Ters Gitti
      </h2>
      <p className="mb-6 text-[15px] text-[#6e6e73]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-full bg-primary-600 px-6 py-2.5 text-[15px] font-medium text-white transition-all hover:bg-primary-700 active:scale-[0.97]"
        >
          Tekrar Dene
        </button>
      )}
    </div>
  );
}
