'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Recipe } from '@/types/recipes.types';
import {
  DayName,
  Moment,
  DayMenu,
  WeekMenu,
  SelectorOption,
  DAYS,
  DAY_ID_MAP,
  MOMENT_ID_MAP,
} from '@/types/menuApi.types';
import { fetchMenu } from '@/api/menu/get-menus';
import { saveMenuItem as apiSaveMenuItem } from '@/api/menu/save-menu';
import { fetchRecipes } from '@/api/recipe/get-recipes';

// Magic constants for recipe type filtering
const COMIDA_TYPE_IDS: number[] = [1, 3];
const CENA_TYPE_IDS: number[] = [2, 3];

interface UseMenuOptions {
  initialRecipes?: Recipe[];
  initialMenu?: DayMenu[];
}

interface UseMenuReturn {
  // Data
  weekMenu: WeekMenu;
  recipes: Recipe[];
  loading: boolean;
  error: string | null;

  // Computed options for selectors
  getComidaOptions: (day: DayName) => SelectorOption[];
  getCenaOptions: (day: DayName) => SelectorOption[];

  // Actions
  selectRecipe: (
    day: DayName,
    moment: Moment,
    recipeId: number | null
  ) => Promise<void>;

  // Clear all
  clearAllRecipes: () => Promise<void>;

  // Refresh
  refetch: () => Promise<void>;
}

function buildWeekMenu(
  recipes: Recipe[],
  menuData: { day_id: number; moment_id: number; recipe_id: number }[]
): WeekMenu {
  // Build a map of day_id -> { comida, cena }
  const menuMap: Record<
    number,
    { comida: Recipe | null; cena: Recipe | null }
  > = {};

  // Initialize all days with null
  DAYS.forEach((_, index) => {
    menuMap[index + 1] = { comida: null, cena: null };
  });

  // Fill in the menu data
  menuData.forEach(({ day_id, moment_id, recipe_id }) => {
    const recipe = recipes.find((r) => r.id === recipe_id) || null;
    if (moment_id === 1) {
      // comida
      if (menuMap[day_id]) {
        menuMap[day_id].comida = recipe;
      }
    } else if (moment_id === 2) {
      // cena
      if (menuMap[day_id]) {
        menuMap[day_id].cena = recipe;
      }
    }
  });

  // Convert to WeekMenu array
  return DAYS.map((dayConfig, index) => ({
    day: dayConfig.name,
    dayLabel: dayConfig.label,
    comida: menuMap[index + 1]?.comida ?? null,
    cena: menuMap[index + 1]?.cena ?? null,
  }));
}

export function useMenu(options: UseMenuOptions = {}): UseMenuReturn {
  const { initialRecipes = [], initialMenu = [] } = options;

  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  
  // Refs for stable state access without causing re-renders
  const recipesRef = useRef<Recipe[]>(initialRecipes);
  const weekMenuRef = useRef<WeekMenu>(initialMenu.length > 0 ? initialMenu : DAYS.map((dayConfig) => ({
    day: dayConfig.name,
    dayLabel: dayConfig.label,
    comida: null,
    cena: null,
  })));
  
  const [weekMenu, setWeekMenu] = useState<WeekMenu>(() => {
    if (initialMenu.length > 0) {
      return initialMenu;
    }
    // Initialize empty weekMenu
    return DAYS.map((dayConfig) => ({
      day: dayConfig.name,
      dayLabel: dayConfig.label,
      comida: null,
      cena: null,
    }));
  });
  const [loading, setLoading] = useState(initialRecipes.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Keep refs in sync with state
  useEffect(() => {
    recipesRef.current = recipes;
  }, [recipes]);

  useEffect(() => {
    weekMenuRef.current = weekMenu;
  }, [weekMenu]);

  // Get used recipe IDs (excluding optionally a specific day)
  const getUsedRecipeIds = useCallback(
    (excludeDay?: DayName): number[] => {
      const ids: number[] = [];
      weekMenu.forEach(({ day, comida, cena }) => {
        if (day !== excludeDay) {
          if (comida) ids.push(comida.id);
          if (cena) ids.push(cena.id);
        }
      });
      return ids;
    },
    [weekMenu]
  );

  // Get options for comida selector (type 1 or 3)
  const getComidaOptions = useCallback(
    (day: DayName): SelectorOption[] => {
      const usedIds = getUsedRecipeIds(day);
      const dayMenu = weekMenu.find((d) => d.day === day);
      const hasComidaSelected = dayMenu?.comida !== null;
      
      const options: SelectorOption[] = [
        { value: -1, label: hasComidaSelected ? 'Eliminar receta' : 'Seleccionar...', disabled: false },
      ];

      recipes
        .filter((r) => COMIDA_TYPE_IDS.includes(r.type.id))
        .forEach((r) => {
          options.push({
            value: r.id,
            label: r.name,
            disabled: usedIds.includes(r.id),
          });
        });

      return options;
    },
    [recipes, getUsedRecipeIds, weekMenu]
  );

  // Get options for cena selector (type 2 or 3)
  const getCenaOptions = useCallback(
    (day: DayName): SelectorOption[] => {
      const usedIds = getUsedRecipeIds(day);
      const dayMenu = weekMenu.find((d) => d.day === day);
      const hasCenaSelected = dayMenu?.cena !== null;
      
      const options: SelectorOption[] = [
        { value: -1, label: hasCenaSelected ? 'Eliminar receta' : 'Seleccionar...', disabled: false },
      ];

      recipes
        .filter((r) => CENA_TYPE_IDS.includes(r.type.id))
        .forEach((r) => {
          options.push({
            value: r.id,
            label: r.name,
            disabled: usedIds.includes(r.id),
          });
        });

      return options;
    },
    [recipes, getUsedRecipeIds, weekMenu]
  );

  // Select a recipe - stable callback using refs
  const selectRecipe = useCallback(
    async (day: DayName, moment: Moment, recipeId: number | null) => {
      const dayId = DAY_ID_MAP[day];
      const momentId = MOMENT_ID_MAP[moment];

      // Use refs for stable access to latest state
      const currentRecipes = recipesRef.current;

      // Optimistic update
      setWeekMenu((prev) =>
        prev.map((dm) => {
          if (dm.day !== day) return dm;

          const selectedRecipe =
            recipeId === null
              ? null
              : currentRecipes.find((r) => r.id === recipeId) || null;

          if (moment === 'comida') {
            return { ...dm, comida: selectedRecipe };
          } else {
            return { ...dm, cena: selectedRecipe };
          }
        })
      );

      // Save to Supabase
      const result = await apiSaveMenuItem({
        dayId,
        momentId,
        recipeId,
      });

      if (!result.success) {
        // Note: we don't revert the UI state as per spec
        setError(result.error);
      }
    },
    []
  );

  // Clear all recipes from the week menu
  const clearAllRecipes = useCallback(async () => {
    // Optimistic update
    setWeekMenu((prev) =>
      prev.map((dm) => ({ ...dm, comida: null, cena: null }))
    );

    // Clear all in parallel
    const promises = DAYS.map((day) => {
      const dayId = DAY_ID_MAP[day.name];
      return Promise.all([
        apiSaveMenuItem({ dayId, momentId: 1, recipeId: null }),
        apiSaveMenuItem({ dayId, momentId: 2, recipeId: null }),
      ]);
    });

    const results = await Promise.all(promises);
    const errors = results.flat().filter((r) => !r.success);
    
    if (errors.length > 0) {
      setError('Error al limpiar algunas recetas');
    }
  }, []);

  // Refetch data
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [recipesData, menuData] = await Promise.all([
        fetchRecipes(),
        fetchMenu(),
      ]);

      setRecipes(recipesData);
      setWeekMenu(buildWeekMenu(recipesData, menuData.data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load if no initial recipes provided
  useEffect(() => {
    if (initialRecipes.length === 0) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    weekMenu,
    recipes,
    loading,
    error,
    getComidaOptions,
    getCenaOptions,
    selectRecipe,
    clearAllRecipes,
    refetch,
  };
}