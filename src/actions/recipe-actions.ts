'use server';

import { revalidatePath } from 'next/cache';
import { createRecipe, updateRecipe, deleteRecipe, getRecipeById } from '@/api/recipe/create-recipe';
import { RecipeFormData } from '@/app/recipe/new/config/schema';

// Re-export for convenience (no server-side logic needed)
export { getRecipeById };

export async function createRecipeAction(data: RecipeFormData) {
  const recipe = await createRecipe(data);
  revalidatePath('/menu');
  return recipe;
}

export async function updateRecipeAction(id: number, data: RecipeFormData) {
  const recipe = await updateRecipe(id, data);
  revalidatePath('/menu');
  return recipe;
}

export async function deleteRecipeAction(id: number) {
  await deleteRecipe(id);
  revalidatePath('/menu');
}