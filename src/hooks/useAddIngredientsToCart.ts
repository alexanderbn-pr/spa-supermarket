'use client';

import { useOptimistic, useTransition } from 'react';
import { addIngredientsToCart } from '@/api/cart/cart';

export interface IngredientQuantity {
  id: number;
  quantity: number;
}

// Optimistic state type: "idle" | "adding"
type AddingState = 'idle' | 'adding';

export function useAddIngredientsToCart() {
  const [isAddingToList, startTransition] = useTransition();
  const [optimisticState, addOptimistic] = useOptimistic<
    AddingState,
    IngredientQuantity[]
  >('idle', (state, ingredients) => {
    // When we receive ingredients, immediately show "adding" state
    return ingredients.length > 0 ? 'adding' : 'idle';
  });

  const addIngredientsFromRecipes = (
    ingredients: IngredientQuantity[]
  ): Promise<{ success: boolean; error: string | null }> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        // Optimistic update: immediately show adding state
        addOptimistic(ingredients);

        // Call the batch API (5-7 queries instead of 84-112)
        const result = await addIngredientsToCart(ingredients);

        resolve(result);
      });
    });
  };

  return {
    addIngredientsFromRecipes,
    isAddingToList: optimisticState === 'adding' || isAddingToList,
  };
}
