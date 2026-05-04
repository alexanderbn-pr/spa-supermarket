'use client';

import { Component, ReactNode } from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
}

/**
 * Componente ErrorBoundary personalizado
 * Captura errores en componentes hijos y muestra una UI de recuperación
 * 
 * Uso en el layout raíz para capturar errores de toda la app
 * o en páginas específicas
 */
export class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <ErrorFallbackUI 
          error={this.state.error!} 
          reset={this.reset} 
        />
      );
    }

    return this.props.children;
  }
}

/**
 * UI por defecto para el fallback de error
 * Diseño estilo Apple
 */
function ErrorFallbackUI({ error, reset }: ErrorFallbackProps) {
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
        Algo salió mal
      </h2>
      
      <p className="mb-6 max-w-md text-gray-500">
        {error?.message || 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'}
      </p>
      
      <div className="flex gap-4">
        <button
          onClick={reset}
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
      
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-8 w-full max-w-md text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Detalles del error (solo desarrollo)
          </summary>
          <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-gray-100 p-4 text-xs text-gray-600">
            {error.stack || error.message}
          </pre>
        </details>
      )}
    </div>
  );
}

/**
 * Hook para usar el ErrorBoundary programáticamente
 * Útil cuando quieres resetear errores desde un componente hijo
 */
export function useErrorBoundary() {
  // Este hook permite a los componentes hijo reiniciar el error boundary
  // Usar con precaución - en la mayoría de casos el botón de retry es suficiente
  return {
    // Por ahora retorna funciones vacías - la implementación completa
    // requiere contexto de React más avanzado
  };
}

export default AppErrorBoundary;