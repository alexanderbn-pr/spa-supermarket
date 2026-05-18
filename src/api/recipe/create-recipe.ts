import { supabase } from '@/lib/supabaseClient';
import { RecipeFormData } from '../../app/recipe/new/config/schema';

// Note: revalidatePath is called in the Server Action wrapper, not here
// This keeps the API functions clean and usable in any context

export const createRecipe = async (data: RecipeFormData) => {
  const { data: recipe, error } = await supabase
    .from('recipes')
    .insert({
      name: data.name,
      description: data.description,
      url: data.url,
      type_id: data.type_id,
      difficulty_id: data.difficulty_id,
      meal_type_id: data.meal_type_id,
      healthy_level_id: data.healthy_level_id,
    })
    .select()
    .single();

  if (error) throw error;

  if (data.ingredient_ids.length > 0) {
    const ingredientLinks = data.ingredient_ids.map((ingredient) => ({
      id_recipe: recipe.id,
      id_ingredient: ingredient.id,
      quantity: ingredient.quantity,
    }));

    const { error: linkError } = await supabase
      .from('rel_recipes_ingredients')
      .insert(ingredientLinks);

    if (linkError) throw linkError;
  }

  return recipe;
};

export const updateRecipe = async (id: number, data: RecipeFormData) => {
  // Update recipe main data
  const { data: recipe, error } = await supabase
    .from('recipes')
    .update({
      name: data.name,
      description: data.description,
      url: data.url,
      type_id: data.type_id,
      difficulty_id: data.difficulty_id,
      meal_type_id: data.meal_type_id,
      healthy_level_id: data.healthy_level_id,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Delete existing ingredient relations
  const { error: deleteError } = await supabase
    .from('rel_recipes_ingredients')
    .delete()
    .eq('id_recipe', id);

  if (deleteError) throw deleteError;

  // Insert new ingredient relations
  if (data.ingredient_ids.length > 0) {
    const ingredientLinks = data.ingredient_ids.map((ingredient) => ({
      id_recipe: id,
      id_ingredient: ingredient.id,
      quantity: ingredient.quantity,
    }));

    const { error: linkError } = await supabase
      .from('rel_recipes_ingredients')
      .insert(ingredientLinks);

    if (linkError) throw linkError;
  }

  return recipe;
};

export const deleteRecipe = async (id: number) => {
  // Delete ingredient relations first
  const { error: deleteLinksError } = await supabase
    .from('rel_recipes_ingredients')
    .delete()
    .eq('id_recipe', id);

  if (deleteLinksError) throw deleteLinksError;
  
  // Delete the recipe
  const { error: deleteError } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id);

  if (deleteError) throw deleteError;
};

// Note: revalidatePath('/menu') is called in the Server Action wrapper (deleteRecipeAction in recipe-actions.ts)
// This keeps the API function clean and usable in any context

export const getRecipeById = async (id: number) => {
  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  
  // Fetch ingredient relations
  const { data: ingredientRelations, error: relationsError } = await supabase
    .from('rel_recipes_ingredients')
    .select('*')
    .eq('id_recipe', id);

  if (relationsError) throw relationsError;
  
  // Fetch ingredient details if there are relations
  let ingredients: Array<{id: number, name: string, description: string, quantity: string}> = [];
  if (ingredientRelations && ingredientRelations.length > 0) {
    const ingredientIds = ingredientRelations.map(r => r.id_ingredient);
    const { data: ingredientData, error: ingredientError } = await supabase
      .from('ingredients')
      .select('*')
      .in('id', ingredientIds);
    
    if (ingredientError) throw ingredientError;
    
    ingredients = ingredientRelations.map(rel => {
      const ing = ingredientData?.find(i => i.id === rel.id_ingredient);
      return {
        id: rel.id_ingredient,
        name: ing?.name || '',
        description: ing?.description || '',
        quantity: String(rel.quantity), // Ensure string type for Zod validation
      };
    });
  }

  // Fetch related data (type, difficulty, meal_type, healthy_level)
  const [typeData, difficultyData, mealTypeData, healthyLevelData] = await Promise.all([
    recipe.type_id ? supabase.from('types').select('*').eq('id', recipe.type_id).single() : Promise.resolve({ data: null }),
    recipe.difficulty_id ? supabase.from('difficulties').select('*').eq('id', recipe.difficulty_id).single() : Promise.resolve({ data: null }),
    recipe.meal_type_id ? supabase.from('meal_types').select('*').eq('id', recipe.meal_type_id).single() : Promise.resolve({ data: null }),
    recipe.healthy_level_id ? supabase.from('healthy_levels').select('*').eq('id', recipe.healthy_level_id).single() : Promise.resolve({ data: null }),
  ]);

  return {
    id: recipe.id,
    url: recipe.url,
    name: recipe.name,
    description: recipe.description,
    type: typeData.data,
    difficulty: difficultyData.data,
    mealType: mealTypeData.data,
    healthyLevel: healthyLevelData.data,
    ingredients,
  };
};
