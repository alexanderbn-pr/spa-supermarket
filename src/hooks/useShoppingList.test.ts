import { describe, it, expect } from 'vitest';
import { sortShoppingItems, ShoppingItem } from './useShoppingList';

function item(name: string, checked: boolean, overrides?: Partial<ShoppingItem>): ShoppingItem {
  return {
    id: 0,
    name,
    quantity: 1,
    checked,
    ingredientId: 0,
    ...overrides,
  };
}

describe('sortShoppingItems', () => {
  it('should sort unchecked items alphabetically', () => {
    const items = [item('Zanahoria', false), item('Arroz', false)];
    const sorted = sortShoppingItems(items);

    expect(sorted[0].name).toBe('Arroz');
    expect(sorted[1].name).toBe('Zanahoria');
  });

  it('should place checked items after unchecked, both groups alphabetical', () => {
    const items = [
      item('Leche', true),
      item('Arroz', false),
      item('Pan', true),
      item('Aceite', false),
    ];
    const sorted = sortShoppingItems(items);

    expect(sorted).toHaveLength(4);
    // Unchecked group first, alphabetical
    expect(sorted[0].name).toBe('Aceite');
    expect(sorted[1].name).toBe('Arroz');
    // Checked group at end, alphabetical
    expect(sorted[2].name).toBe('Leche');
    expect(sorted[3].name).toBe('Pan');
  });

  it('should group checked items at the bottom', () => {
    const items = [item('Huevos', true), item('Arroz', false)];
    const sorted = sortShoppingItems(items);

    expect(sorted[0].name).toBe('Arroz');
    expect(sorted[1].name).toBe('Huevos');
  });

  it('should handle empty list', () => {
    const sorted = sortShoppingItems([]);
    expect(sorted).toEqual([]);
  });

  it('should handle single item', () => {
    const sorted = sortShoppingItems([item('Leche', false)]);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].name).toBe('Leche');
  });

  it('should not mutate original array', () => {
    const items = [item('Zanahoria', false), item('Arroz', false)];
    const originalOrder = items.map((i) => i.name).join(',');
    sortShoppingItems(items);
    expect(items.map((i) => i.name).join(',')).toBe(originalOrder);
  });

  it('should handle Spanish locale sorting correctly', () => {
    const items = [item('ñame', false), item('naranja', false)];
    const sorted = sortShoppingItems(items);
    // In Spanish locale, 'naranja' comes before 'ñame'
    expect(sorted[0].name).toBe('naranja');
    expect(sorted[1].name).toBe('ñame');
  });

  it('should re-sort when item toggles from unchecked to checked', () => {
    // Initial: Arroz unchecked, Leche checked → Arroz first
    const items = [
      item('Leche', true),
      item('Arroz', false),
    ];
    const sorted = sortShoppingItems(items);
    expect(sorted[0].name).toBe('Arroz');
    expect(sorted[1].name).toBe('Leche');

    // After toggle: Arroz now checked too → both checked, alphabetical
    const updatedItems = [
      item('Leche', true),
      item('Arroz', true),
    ];
    const reSorted = sortShoppingItems(updatedItems);
    expect(reSorted[0].name).toBe('Arroz');
    expect(reSorted[1].name).toBe('Leche');
  });

  it('should not mutate checked state when sorting', () => {
    const items = [item('Leche', true), item('Arroz', false)];
    const sorted = sortShoppingItems(items);

    expect(sorted[0].checked).toBe(false);
    expect(sorted[1].checked).toBe(true);
  });
});
