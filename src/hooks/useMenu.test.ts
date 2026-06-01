import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
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

const mockAcompananteRecipe: Recipe = {
  id: 10,
  name: 'Arroz blanco',
  description: 'Acompañante',
  url: 'https://example.com',
  type: { id: 5, name: 'Acompañante', description: '' },
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

vi.mock('@/api/menu/acompanantes', () => ({
  fetchAcompanantes: vi.fn().mockResolvedValue({ data: [], error: null }),
  addAcompanante: vi.fn().mockResolvedValue({ success: true, error: null }),
  clearAcompanantesForMoment: vi.fn().mockResolvedValue({ success: true, error: null }),
}));

function buildTestMenu(recipe: Recipe | null) {
  return [
    { day: 'monday' as const, dayLabel: 'Lunes', comida: recipe, cena: null, acompananteEnabled: { comida: false, cena: false }, acompanantes: { comida: [], cena: [] } },
    { day: 'tuesday' as const, dayLabel: 'Martes', comida: null, cena: null, acompananteEnabled: { comida: false, cena: false }, acompanantes: { comida: [], cena: [] } },
    { day: 'wednesday' as const, dayLabel: 'Miércoles', comida: null, cena: null, acompananteEnabled: { comida: false, cena: false }, acompanantes: { comida: [], cena: [] } },
    { day: 'thursday' as const, dayLabel: 'Jueves', comida: null, cena: null, acompananteEnabled: { comida: false, cena: false }, acompanantes: { comida: [], cena: [] } },
    { day: 'friday' as const, dayLabel: 'Viernes', comida: null, cena: null, acompananteEnabled: { comida: false, cena: false }, acompanantes: { comida: [], cena: [] } },
    { day: 'saturday' as const, dayLabel: 'Sábado', comida: null, cena: null, acompananteEnabled: { comida: false, cena: false }, acompanantes: { comida: [], cena: [] } },
    { day: 'sunday' as const, dayLabel: 'Domingo', comida: null, cena: null, acompananteEnabled: { comida: false, cena: false }, acompanantes: { comida: [], cena: [] } },
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

  it('should exclude acompañante recipes from comida options', () => {
    const { result } = renderHook(() =>
      useMenu({ initialRecipes: [mockRecipe, mockAcompananteRecipe] })
    );

    const options = result.current.getComidaOptions('monday');

    // mockRecipe (type.id=1) should appear
    expect(options.find((o) => o.label === 'Paella')).toBeDefined();
    // mockAcompananteRecipe (type.id=5) should NOT appear
    expect(options.find((o) => o.label === 'Arroz blanco')).toBeUndefined();
  });

  it('should exclude acompañante recipes from cena options', () => {
    const { result } = renderHook(() =>
      useMenu({ initialRecipes: [mockRecipe2, mockAcompananteRecipe] })
    );

    const options = result.current.getCenaOptions('monday');

    // mockRecipe2 (type.id=2) should appear
    expect(options.find((o) => o.label === 'Lasaña')).toBeDefined();
    // mockAcompananteRecipe (type.id=5) should NOT appear
    expect(options.find((o) => o.label === 'Arroz blanco')).toBeUndefined();
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

  // Acompañante tests
  describe('getAcompananteRecipes', () => {
    it('should filter recipes by type.id === 5', () => {
      const { result } = renderHook(() =>
        useMenu({
          initialRecipes: [mockRecipe, mockRecipe2, mockAcompananteRecipe],
        })
      );

      const acompananteRecipes = result.current.getAcompananteRecipes();

      expect(acompananteRecipes).toHaveLength(1);
      expect(acompananteRecipes[0].id).toBe(10);
      expect(acompananteRecipes[0].name).toBe('Arroz blanco');
    });

    it('should return empty array when no type-5 recipes exist', () => {
      const { result } = renderHook(() =>
        useMenu({ initialRecipes: [mockRecipe, mockRecipe2] })
      );

      const acompananteRecipes = result.current.getAcompananteRecipes();

      expect(acompananteRecipes).toHaveLength(0);
    });
  });

  describe('toggleAcompanante', () => {
    it('should toggle acompananteEnabled for the given day+moment', async () => {
      const { result } = renderHook(() =>
        useMenu({ initialRecipes: [mockRecipe] })
      );

      expect(
        result.current.weekMenu[0].acompananteEnabled.comida
      ).toBe(false);

      await act(async () => {
        await result.current.toggleAcompanante('monday', 'comida');
      });

      await waitFor(() => {
        expect(
          result.current.weekMenu[0].acompananteEnabled.comida
        ).toBe(true);
      });

      await act(async () => {
        await result.current.toggleAcompanante('monday', 'comida');
      });

      await waitFor(() => {
        expect(
          result.current.weekMenu[0].acompananteEnabled.comida
        ).toBe(false);
      });
    });

    it('should clear acompanante selections when toggling off', async () => {
      const initialMenu = buildTestMenu(null);
      initialMenu[0].acompananteEnabled.comida = true;
      initialMenu[0].acompanantes.comida = [mockAcompananteRecipe];

      const { result } = renderHook(() =>
        useMenu({
          initialRecipes: [mockAcompananteRecipe],
          initialMenu,
        })
      );

      expect(result.current.weekMenu[0].acompanantes.comida).toHaveLength(1);

      await act(async () => {
        await result.current.toggleAcompanante('monday', 'comida');
      });

      await waitFor(() => {
        expect(result.current.weekMenu[0].acompanantes.comida).toHaveLength(0);
      });
    });
  });

  describe('setAcompananteRecipes', () => {
    it('should set the selected recipes for the given day+moment', async () => {
      const { result } = renderHook(() =>
        useMenu({
          initialRecipes: [mockRecipe, mockAcompananteRecipe],
        })
      );

      // First enable acompañante
      await act(async () => {
        await result.current.toggleAcompanante('monday', 'comida');
      });

      // Then set recipes
      await act(async () => {
        await result.current.setAcompananteRecipes('monday', 'comida', [10]);
      });

      await waitFor(() => {
        expect(result.current.weekMenu[0].acompanantes.comida).toHaveLength(1);
      });
      expect(result.current.weekMenu[0].acompanantes.comida[0].id).toBe(10);
      expect(result.current.weekMenu[0].acompanantes.comida[0].name).toBe(
        'Arroz blanco'
      );
    });

    it('should clear existing selections before adding new ones', async () => {
      const initialMenu = buildTestMenu(null);
      initialMenu[0].acompananteEnabled.comida = true;
      initialMenu[0].acompanantes.comida = [mockAcompananteRecipe];

      const { result } = renderHook(() =>
        useMenu({
          initialRecipes: [mockRecipe, mockAcompananteRecipe],
          initialMenu,
        })
      );

      // Replace with empty selection
      await act(async () => {
        await result.current.setAcompananteRecipes('monday', 'comida', []);
      });

      await waitFor(() => {
        expect(result.current.weekMenu[0].acompanantes.comida).toHaveLength(0);
      });
    });
  });
});
