'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log del error para monitoring
    console.error('Error en página /recipe:', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg 
          className="h-8 w-8 text-red-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      
      <h2 className="mb-2 text-xl font-semibold text-gray-900">
        Error al cargar las recetas
      </h2>
      
      <p className="mb-6 max-w-md text-gray-500">
        {error.message || 'Ha ocurrido un error al cargar las recetas. Por favor, inténtalo de nuevo.'}
      </p>
      
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="rounded-full bg-[#0071e3] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0077ed]"
        >
          Intentar de nuevo
        </button>
        
        <Link
          href="/"
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Volver al inicio
        </Link>
      </div>
      
      {process.env.NODE_ENV === 'development' && error.digest && (
        <p className="mt-4 text-xs text-gray-400">
          Error digest: {error.digest}
        </p>
      )}
    </div>
  );
}