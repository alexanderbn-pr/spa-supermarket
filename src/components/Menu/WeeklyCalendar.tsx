'use client';

import { useState, useCallback } from 'react';
import { Recipe } from '@/types/recipes.types';
import { DayName, DayMenu } from '@/types/menuApi.types';
import { useMenu } from '@/hooks/useMenu';
import { useAddIngredientsToCart } from '@/hooks/useAddIngredientsToCart';
import DayList from './DayList';
import MenuSkeleton from './MenuSkeleton';
import MenuError from './MenuError';

interface WeeklyCalendarProps {
  initialRecipes?: Recipe[];
  initialMenu?: DayMenu[];
}

type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export default function WeeklyCalendar({
  initialRecipes = [],
  initialMenu = [],
}: WeeklyCalendarProps) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showConfirmAdd, setShowConfirmAdd] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const {
    weekMenu,
    recipes,
    loading,
    error,
    getComidaOptions,
    getCenaOptions,
    selectRecipe,
    clearAllRecipes,
    refetch,
  } = useMenu({
    initialRecipes,
    initialMenu,
  });

  const { addIngredientsFromRecipes, isAddingToList } = useAddIngredientsToCart();

  // Show toast notification
  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => setToast((current) => (current?.id === id ? null : current)), 3000);
  }, []);

  // Check if all days have recipes selected
  const allDaysHaveRecipes = weekMenu.every(
    (day) => day.comida !== null && day.cena !== null
  );

  // Extract all ingredients from selected recipes
  const getIngredientsFromMenu = useCallback(() => {
    const ingredientMap: Record<number, number> = {};

    weekMenu.forEach((day) => {
      const addIngredientsFromRecipe = (recipe: Recipe) => {
        if (recipe.ingredients) {
          recipe.ingredients.forEach((ing) => {
            const qty = parseFloat(ing.quantity) || 1;
            ingredientMap[ing.id] = (ingredientMap[ing.id] ?? 0) + qty;
          });
        }
      };

      if (day.comida) addIngredientsFromRecipe(day.comida);
      if (day.cena) addIngredientsFromRecipe(day.cena);
    });

    return Object.entries(ingredientMap).map(([id, quantity]) => ({
      id: parseInt(id, 10),
      quantity,
    }));
  }, [weekMenu]);

  const handleComidaChange = (day: DayName) => (recipeId: number | null) => {
    selectRecipe(day, 'comida', recipeId);
  };

  const handleCenaChange = (day: DayName) => (recipeId: number | null) => {
    selectRecipe(day, 'cena', recipeId);
  };

  const handleClearAll = async () => {
    await clearAllRecipes();
    setShowConfirmClear(false);
  };

  const handleAddIngredients = async () => {
    const ingredients = getIngredientsFromMenu();
    if (ingredients.length === 0) return;

    setShowConfirmAdd(false);
    const result = await addIngredientsFromRecipes(ingredients);

    if (result.success) {
      showToast('Ingredientes añadidos correctamente', 'success');
    } else {
      showToast('Error al añadir ingredientes', 'error');
    }
  };

  if (loading && recipes.length === 0) {
    return <MenuSkeleton />;
  }

  if (error && recipes.length === 0) {
    return <MenuError message={error} onRetry={refetch} />;
  }

  return (
    <div className="max-w-sm sm:max-w-2xl sm:px-6 md:max-w-4xl lg:max-w-6xl">
      {/* Clear menu button */}
      <button
        onClick={() => setShowConfirmClear(true)}
        className="mb-4 w-full py-3 px-4 rounded-xl border border-gray-200 bg-white text-gray-600 
          hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 text-sm font-medium"
      >
        Limpiar menú
      </button>

      {/* Add ingredients button */}
      <button
        onClick={() => setShowConfirmAdd(true)}
        disabled={!allDaysHaveRecipes || isAddingToList}
        className="mb-4 w-full py-3 px-4 rounded-xl bg-emerald-600 text-white 
          hover:bg-emerald-700 active:scale-[0.98] transition-all duration-200 text-sm font-medium
          disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isAddingToList ? 'Añadiendo...' : 'Añadir ingredientes a la lista'}
      </button>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-white text-sm font-medium z-50 transition-opacity duration-300 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Confirm dialog */}
      {showConfirmClear && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setShowConfirmClear(false)}
          />
          <div className="fixed inset-x-4 bottom-0 z-50 bg-white rounded-t-2xl p-6 animate-slideUpSheet">
            <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">
              ¿Limpiar menú?
            </h3>
            <p className="text-gray-500 mb-6">
              Se eliminarán todas las recetas seleccionadas del menú semanal.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 bg-white text-gray-600 
                  hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white 
                  hover:bg-red-600 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>
        </>
      )}

      {/* Confirm dialog for adding ingredients */}
      {showConfirmAdd && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setShowConfirmAdd(false)}
          />
          <div className="fixed inset-x-4 bottom-0 z-50 bg-white rounded-t-2xl p-6 animate-slideUpSheet">
            <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">
              Añadir ingredientes
            </h3>
            <p className="text-gray-500 mb-6">
              Se añadirán los ingredientes de todas las recetas del menú a tu lista de la compra.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmAdd(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 bg-white text-gray-600 
                  hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddIngredients}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-white 
                  hover:bg-emerald-700 transition-colors"
              >
                Añadir
              </button>
            </div>
          </div>
        </>
      )}

      <DayList
        weekMenu={weekMenu}
        getComidaOptions={getComidaOptions}
        getCenaOptions={getCenaOptions}
        onComidaChange={handleComidaChange}
        onCenaChange={handleCenaChange}
      />
    </div>
  );
}