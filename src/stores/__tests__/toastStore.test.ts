import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToastStore, toastStore } from '../toastStore';

describe('toastStore', () => {
  beforeEach(() => {
    toastStore.clearToasts();
  });

  it('addToast adds a toast with correct type, message, and a non-empty id', () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      result.current.addToast('error', 'Error de prueba');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('error');
    expect(result.current.toasts[0].message).toBe('Error de prueba');
    expect(result.current.toasts[0].id).toBeTruthy();
  });

  it('addToast adds multiple toasts', () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      result.current.addToast('success', 'Éxito');
      result.current.addToast('info', 'Informativo');
    });

    expect(result.current.toasts).toHaveLength(2);
  });

  it('removeToast removes a toast by id', () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      result.current.addToast('error', 'Error a eliminar');
    });

    const id = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(id);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('removeToast only removes the targeted toast', () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      result.current.addToast('error', 'Primero');
      result.current.addToast('success', 'Segundo');
    });

    const firstId = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(firstId);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Segundo');
  });
});
