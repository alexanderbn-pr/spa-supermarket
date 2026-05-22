import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMenu } from './useMenu';
import { Recipe } from '@/types/recipes.types';

const mockRecipe: Recipe = {
  id: 1,
  name: 'Paella',
  description: 'Test recipe',
  url: 'https://example.com',
  type: { id: 1, name: 'Comida', description: '' },
  difficulty: { id: 1, name: 'Media', description: '' },
  mealType: { id: 1, name: 'Almuerzo', description: '' },
  healthyLevel: { id: 1, name: 'Saludable', description: '' },
};

const mockComodinRecipe: Recipe = {
  id: 3,
  name: 'Comodín Pizza',
  description: 'Reusable recipe',
  url: 'https://example.com',
  type: { id: 1, name: 'Comida', description: '' },
  difficulty: { id: 1, name: 'Media', description: '' },
  mealType: { id: 1, name: 'Almuerzo', description: '' },
  healthyLevel: { id: 1, name: 'Saludable', description: '' },
  comodin: true,
};

const mockRecipe2: Recipe = {
  id: 2,
  name: 'Lasaña',
  description: 'Test recipe 2',
  url: 'https://example.com',
  type: { id: 2, name: 'Cena', description: '' },
  difficulty: { id: 1, name: 'Media', description: '' },
  mealType: { id: 1, name: 'Almuerzo', description: '' },
  healthyLevel: { id: 1, name: 'Saludable', description: '' },
};

// Mock APIs (must match exact import paths from useMenu.ts)
vi.mock('@/api/menu/get-menus', () => ({
  fetchMenu: vi.fn().mockResolvedValue({ data: [], error: null }),
}));

vi.mock('@/api/menu/save-menu', () => ({
  saveMenuItem: vi.fn().mockResolvedValue({ success: true, error: null }),
}));

vi.mock('@/api/recipe/get-recipes', () => ({
  fetchRecipes: vi.fn().mockResolvedValue([]),
}));

function buildTestMenu(recipe: Recipe | null) {
  return [
    { day: 'monday' as const, dayLabel: 'Lunes', comida: recipe, cena: null },
    { day: 'tuesday' as const, dayLabel: 'Martes', comida: null, cena: null },
    { day: 'wednesday' as const, dayLabel: 'Miércoles', comida: null, cena: null },
    { day: 'thursday' as const, dayLabel: 'Jueves', comida: null, cena: null },
    { day: 'friday' as const, dayLabel: 'Viernes', comida: null, cena: null },
    { day: 'saturday' as const, dayLabel: 'Sábado', comida: null, cena: null },
    { day: 'sunday' as const, dayLabel: 'Domingo', comida: null, cena: null },
  ];
}

describe('useMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty menu', () => {
    const { result } = renderHook(() => useMenu());

    expect(result.current.weekMenu).toHaveLength(7);
    expect(result.current.recipes).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('should initialize with provided recipes', () => {
    const { result } = renderHook(() =>
      useMenu({ initialRecipes: [mockRecipe] })
    );

    expect(result.current.recipes).toEqual([mockRecipe]);
    expect(result.current.loading).toBe(false);
  });

  it('should get comida options filtered by type', () => {
    const { result } = renderHook(() =>
      useMenu({ initialRecipes: [mockRecipe, mockRecipe2] })
    );

    const options = result.current.getComidaOptions('monday');

    // mockRecipe has type.id = 1 (comida)
    expect(options.find((o) => o.label === 'Paella')).toBeDefined();
    // mockRecipe2 has type.id = 2 (cena) - should not appear
    expect(options.find((o) => o.label === 'Lasaña')).toBeUndefined();
  });

  it('should get cena options filtered by type', () => {
    const { result } = renderHook(() =>
      useMenu({ initialRecipes: [mockRecipe, mockRecipe2] })
    );

    const options = result.current.getCenaOptions('monday');

    // mockRecipe2 has type.id = 2 (cena)
    expect(options.find((o) => o.label === 'Lasaña')).toBeDefined();
  });

  it('should mark used recipes as disabled in other days', () => {
    const initialMenu = buildTestMenu(mockRecipe);

    const { result } = renderHook(() =>
      useMenu({ initialRecipes: [mockRecipe], initialMenu })
    );

    const tuesdayOptions = result.current.getComidaOptions('tuesday');

    // mockRecipe is used in monday, should be disabled in tuesday
    const paellaOption = tuesdayOptions.find((o) => o.label === 'Paella');
    expect(paellaOption?.disabled).toBe(true);
  });

  it('should not disable recipe in current day', () => {
    const initialMenu = buildTestMenu(mockRecipe);

    const { result } = renderHook(() =>
      useMenu({ initialRecipes: [mockRecipe], initialMenu })
    );

    const mondayOptions = result.current.getComidaOptions('monday');

    // mockRecipe is used in monday, should NOT be disabled when viewing monday
    const paellaOption = mondayOptions.find((o) => o.label === 'Paella');
    expect(paellaOption?.disabled).toBe(false);
  });

  it('should not disable comodin recipes when used in other days', () => {
    const initialMenu = buildTestMenu(mockComodinRecipe);

    const { result } = renderHook(() =>
      useMenu({ initialRecipes: [mockComodinRecipe], initialMenu })
    );

    const tuesdayOptions = result.current.getComidaOptions('tuesday');

    // mockComodinRecipe is used in monday but has comodin=true
    // It should NOT be disabled in tuesday (reusable)
    const pizzaOption = tuesdayOptions.find((o) => o.label === 'Comodín Pizza');
    expect(pizzaOption?.disabled).toBe(false);
  });

  it('should keep non-comodin recipes disabled even when mixed with comodin', () => {
    // Monday: comodin recipe in comida, non-comodin recipe in cena
    // Tuesday: empty — both recipes are "used"
    const initialMenu = buildTestMenu(null);
    initialMenu[0] = {
      day: 'monday' as const,
      dayLabel: 'Lunes',
      comida: mockComodinRecipe,
      cena: mockRecipe,
    };

    const { result } = renderHook(() =>
      useMenu({ initialRecipes: [mockRecipe, mockComodinRecipe], initialMenu })
    );

    const tuesdayOptions = result.current.getComidaOptions('tuesday');

    // mockRecipe (comodin=false) is used in monday cena — should be disabled
    // (mockRecipe has type.id=1, appears in getComidaOptions)
    const paellaOption = tuesdayOptions.find((o) => o.label === 'Paella');
    expect(paellaOption?.disabled).toBe(true);

    // mockComodinRecipe (comodin=true) is used in monday — should be enabled (reusable)
    const pizzaOption = tuesdayOptions.find((o) => o.label === 'Comodín Pizza');
    expect(pizzaOption?.disabled).toBe(false);
  });
});
