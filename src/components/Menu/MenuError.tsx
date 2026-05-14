'use client';

interface MenuErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function MenuError({ message = 'Error al cargar el menú', onRetry }: MenuErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white p-8">
      <div className="text-center">
        <p className="text-lg text-red-500">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 rounded-lg bg-[#0071e3] px-6 py-2 text-white transition-colors hover:bg-[#0077ed]"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}