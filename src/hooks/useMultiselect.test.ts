import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMultiselect } from './useMultiselect';

describe('useMultiselect', () => {
  const mockOptions = [
    { value: 1, label: 'Tomate' },
    { value: 2, label: 'Cebolla' },
    { value: 3, label: 'Ajo' },
  ];

  it('should start with empty selection', () => {
    const { result } = renderHook(() => useMultiselect(mockOptions));

    expect(result.current.selectedIngredients).toHaveLength(0);
    expect(result.current.selectedIds).toHaveLength(0);
  });

  it('should add ingredient when toggling', () => {
    const { result } = renderHook(() => useMultiselect(mockOptions));

    act(() => {
      result.current.toggleIngredient(1, 'Tomate');
    });

    expect(result.current.selectedIngredients).toHaveLength(1);
    expect(result.current.selectedIngredients[0].id).toBe(1);
  });

  it('should remove ingredient when toggling twice', () => {
    const { result } = renderHook(() => useMultiselect(mockOptions));

    act(() => {
      result.current.toggleIngredient(1, 'Tomate');
      result.current.toggleIngredient(1, 'Tomate');
    });

    expect(result.current.selectedIngredients).toHaveLength(0);
  });

  it('should update quantity for selected ingredient', () => {
    const { result } = renderHook(() => useMultiselect(mockOptions));

    act(() => {
      result.current.toggleIngredient(1, 'Tomate');
    });

    act(() => {
      result.current.updateQuantity(1, '2 unidades');
    });

    expect(result.current.selectedIngredients[0].quantity).toBe('2 unidades');
  });

  it('should filter available options correctly', () => {
    const { result } = renderHook(() => useMultiselect(mockOptions));

    act(() => {
      result.current.toggleIngredient(1, 'Tomate');
      result.current.toggleIngredient(2, 'Cebolla');
    });

    expect(result.current.availableOptionsFiltered).toHaveLength(1);
    expect(result.current.availableOptionsFiltered[0].value).toBe(3);
  });

  it('should reset selection', () => {
    const { result } = renderHook(() => useMultiselect(mockOptions));

    act(() => {
      result.current.toggleIngredient(1, 'Tomate');
      result.current.toggleIngredient(2, 'Cebolla');
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.selectedIngredients).toHaveLength(0);
  });

  it('should detect when all options are selected', () => {
    const { result } = renderHook(() => useMultiselect(mockOptions));

    act(() => {
      result.current.toggleIngredient(1, 'Tomate');
      result.current.toggleIngredient(2, 'Cebolla');
      result.current.toggleIngredient(3, 'Ajo');
    });

    expect(result.current.isAllSelected).toBe(true);
  });
});