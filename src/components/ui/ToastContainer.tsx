'use client';

import { useEffect, useCallback } from 'react';
import { useToastStore } from '@/stores/toastStore';

const typeStyles: Record<string, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
};

function ToastItem({
  id,
  type,
  message,
  onDismiss,
}: {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  onDismiss: (id: string) => void;
}) {
  const handleDismiss = useCallback(() => onDismiss(id), [id, onDismiss]);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(handleDismiss, 5000);
    return () => clearTimeout(timer);
  }, [handleDismiss]);

  return (
    <div
      role="alert"
      className={`pointer-events-auto animate-slideUpSheet rounded-xl px-5 py-3 shadow-lg ${typeStyles[type]}`}
      onClick={handleDismiss}
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onDismiss={removeToast}
        />
      ))}
    </div>
  );
}
