'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  fetchCartList,
  addItemToCartByName,
  updateCartQuantity,
  toggleCartItem,
  deleteFromCart,
  clearCart,
} from '@/api/cart/cart';
import { toastStore } from '@/stores/toastStore';

export interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  checked: boolean;
  ingredientId: number;
}

export function sortShoppingItems(items: ShoppingItem[]): ShoppingItem[] {
  return [...items].sort((a, b) => {
    if (a.checked !== b.checked) return a.checked ? 1 : -1;
    return a.name.localeCompare(b.name, 'es');
  });
}

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const sortedItems = sortShoppingItems(items);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  // Shared fetch + state update logic
  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cartItems = await fetchCartList();
      setItems(cartItems);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error inesperado al cargar la lista';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data from Supabase
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Refetch (publicly exposed for retry)
  const refetch = useCallback(async () => {
    await loadCart();
  }, [loadCart]);

  // Add item — search or create ingredient in Supabase, then persist
  const addItem = useCallback(async (name: string) => {
    if (!name.trim()) return;

    const result = await addItemToCartByName(name.trim());

    if (result.success) {
      setError(null);
      const cartItems = await fetchCartList();
      setItems(cartItems);
    } else {
      toastStore.addToast(
        'error',
        `Error al añadir "${name.trim()}": ${result.error}`
      );
    }

    setInputValue('');
  }, []);

  const removeItem = useCallback(async (id: number) => {
    // Optimistic update: remove from UI immediately
    setItems((prev) => prev.filter((item) => item.id !== id));

    const result = await deleteFromCart(id);
    if (!result.success) {
      toastStore.addToast('error', `Error al eliminar: ${result.error}`);
      // Reload to get correct state after failed delete
      const cartItems = await fetchCartList();
      setItems(cartItems);
    }
  }, []);

  const incrementQuantity = useCallback(async (id: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );

    const item = items.find((i) => i.id === id);
    if (!item) return;

    const result = await updateCartQuantity(id, item.quantity + 1);
    if (!result.success) {
      toastStore.addToast('error', `Error al aumentar cantidad: ${result.error}`);
      // Revert optimistic update
      const cartItems = await fetchCartList();
      setItems(cartItems);
    }
  }, [items]);

  const decrementQuantity = useCallback(async (id: number) => {
    const item = items.find((i) => i.id === id);
    if (!item || item.quantity <= 1) return;

    const newQuantity = item.quantity - 1;

    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i))
    );

    const result = await updateCartQuantity(id, newQuantity);
    if (!result.success) {
      toastStore.addToast('error', `Error al disminuir cantidad: ${result.error}`);
      // Revert optimistic update
      const cartItems = await fetchCartList();
      setItems(cartItems);
    }
  }, [items]);

  const toggleChecked = useCallback(async (id: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newChecked = !item.checked;

    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: newChecked } : i))
    );

    const result = await toggleCartItem(id);
    if (!result.success) {
      toastStore.addToast('error', `Error al cambiar estado: ${result.error}`);
      // Revert optimistic update
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, checked: item.checked } : i))
      );
    }
  }, [items]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleAddSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      addItem(inputValue);
    },
    [addItem, inputValue]
  );

  const clearAll = useCallback(async () => {
    setClearing(true);
    const result = await clearCart();
    if (result.success) {
      setItems([]);
      setError(null);
    } else {
      toastStore.addToast('error', `Error al vaciar la lista: ${result.error}`);
    }
    setClearing(false);
    return result;
  }, []);

  return {
    items,
    sortedItems,
    inputValue,
    loading,
    error,
    clearing,
    addItem,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    toggleChecked,
    handleInputChange,
    handleAddSubmit,
    clearAll,
    refetch,
  };
}
