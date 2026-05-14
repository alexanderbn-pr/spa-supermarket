import { useState, useCallback, useMemo } from 'react';

export interface IngredientOption {
  id: number;
  label: string;
  quantity: string;
}

export function useMultiselect(
  availableOptions: { value: number; label: string }[]
) {
  const [selectedIngredients, setSelectedIngredients] = useState<IngredientOption[]>([]);

  const selectedIds = useMemo(
    () => selectedIngredients.map((i) => i.id),
    [selectedIngredients]
  );

  const availableOptionsFiltered = useMemo(
    () => availableOptions.filter((option) => !selectedIds.includes(option.value)),
    [availableOptions, selectedIds]
  );

  const toggleIngredient = useCallback((id: number, label: string) => {
    setSelectedIngredients((prev) => {
      const exists = prev.find((i) => i.id === id);
      if (exists) {
        return prev.filter((i) => i.id !== id);
      }
      return [...prev, { id, label, quantity: '' }];
    });
  }, []);

  const updateQuantity = useCallback((id: number, quantity: string) => {
    setSelectedIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const reset = useCallback(() => {
    setSelectedIngredients([]);
  }, []);

  const isAllSelected = availableOptions.length > 0 && selectedIds.length === availableOptions.length;

  return {
    // State
    selectedIngredients,
    selectedIds,
    // Computed
    availableOptionsFiltered,
    isAllSelected,
    // Actions
    toggleIngredient,
    updateQuantity,
    reset,
  };
}