'use client';

import { useState, useCallback } from 'react';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
}

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addItem = useCallback((name: string) => {
    if (!name.trim()) return;

    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      quantity: 1,
      checked: false,
    };

    setItems((prev) => [...prev, newItem]);
    setInputValue('');
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const incrementQuantity = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decrementQuantity = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }, []);

  const toggleChecked = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

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

  return {
    items,
    inputValue,
    addItem,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    toggleChecked,
    handleInputChange,
    handleAddSubmit,
  };
}