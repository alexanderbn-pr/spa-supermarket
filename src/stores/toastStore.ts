'use client';

import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// --- Module-level store (no Zustand dependency) ---
let toasts: Toast[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

let idCounter = 0;

// Accessible outside React hooks (e.g., in useShoppingList callbacks)
export const toastStore = {
  addToast(type: ToastType, message: string) {
    const id = `toast-${++idCounter}-${Date.now()}`;
    toasts = [...toasts, { id, type, message }];
    notify();
  },

  removeToast(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },

  clearToasts() {
    toasts = [];
    notify();
  },
};

// React hook for components
export function useToastStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    toasts,
    addToast: toastStore.addToast,
    removeToast: toastStore.removeToast,
    clearToasts: toastStore.clearToasts,
  };
}
