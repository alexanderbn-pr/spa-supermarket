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
  const [clearing, setClearing] = useState(false);

  // Load initial data from Supabase
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      const cartItems = await fetchCartList();
      setItems(cartItems);
      setLoading(false);
    };

    loadCart();
  }, []);

  // Add item - search or create ingredient in Supabase, then persist
  const addItem = useCallback(async (name: string) => {
    if (!name.trim()) return;

    // Call addItemToCartByName API to search/create ingredient and persist to Supabase
    const result = await addItemToCartByName(name.trim());

    if (result.success) {
      // Reload cart from Supabase to get the real ID and data
      const cartItems = await fetchCartList();
      setItems(cartItems);
    } else {
      // If API fails, add locally as fallback with temp ID for UX continuity
      const newItem: ShoppingItem = {
        id: Date.now(),
        name: name.trim(),
        quantity: 1,
        checked: false,
        ingredientId: 0,
      };
      setItems((prev) => [...prev, newItem]);
    }

    setInputValue('');
  }, []);

  const removeItem = useCallback(async (id: number) => {
    // Optimistic update: remove from UI immediately
    setItems((prev) => prev.filter((item) => item.id !== id));

    // If it's a real Supabase item (id > 0), delete from DB
    if (id > 0) {
      await deleteFromCart(id);
    }
  }, []);

  const incrementQuantity = useCallback(async (id: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newQuantity = item.quantity + 1;

    // Update local state immediately (optimistic)
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      )
    );

    // If it's a real Supabase item, persist
    if (id > 0) {
      await updateCartQuantity(id, newQuantity);
    }
  }, [items]);

  const decrementQuantity = useCallback(async (id: number) => {
    const item = items.find((i) => i.id === id);
    if (!item || item.quantity <= 1) return;

    const newQuantity = item.quantity - 1;

    // Update local state immediately (optimistic)
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      )
    );

    // If it's a real Supabase item, persist
    if (id > 0) {
      await updateCartQuantity(id, newQuantity);
    }
  }, [items]);

  const toggleChecked = useCallback(async (id: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newChecked = !item.checked;

    // Update local state immediately (optimistic)
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, checked: newChecked } : i
      )
    );

    // If it's a real Supabase item, persist
    if (id > 0) {
      await toggleCartItem(id);
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
    }
    setClearing(false);
    return result;
  }, []);

  return {
    items,
    sortedItems,
    inputValue,
    loading,
    clearing,
    addItem,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    toggleChecked,
    handleInputChange,
    handleAddSubmit,
    clearAll,
  };
}