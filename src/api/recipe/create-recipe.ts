import { supabase } from '@/lib/supabaseClient';
import { RecipeFormData } from '../../app/recipe/new/config/schema';

export const createRecipe = async (data: RecipeFormData) => {
  console.log('Creating recipe with data:', data);
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
  console.log('Recipe created:', recipe);
  
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
