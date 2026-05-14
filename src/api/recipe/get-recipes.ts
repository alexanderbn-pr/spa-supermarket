import { supabase } from '@/lib/supabaseClient'
import { Recipe, RecipeRow, Ingredient } from '@/types/recipes.types'
import { mapRecipeRowToRecipe } from '@/mapper/recipe.mapper'

// Tipo para la relación con ingredientes desde Supabase
interface RecipeIngredientRelation {
  id: number
  id_recipe: number
  id_ingredient: number
  quantity: string
  ingredient: {
    id: number
    name: string
    description: string
  }
}

export const fetchRecipes = async (): Promise<Recipe[]> => {
  const { data: recipesData, error: recipesError } = await supabase
    .from('recipes')
    .select(`
      *,
      type:types (*),
      difficulty:difficulties (*),
      meal_type:meal_types (*),
      healthy_level:healthy_levels (*)
    `)
    .returns<RecipeRow[]>()

  if (recipesError) {
    console.error(recipesError)
    return []
  }

  // Fetch all recipe-ingredient relations
  const { data: relationsData, error: relationsError } = await supabase
    .from('rel_recipes_ingredients')
    .select(`
      id,
      id_recipe,
      id_ingredient,
      quantity,
      ingredient:ingredients (
        id,
        name,
        description
      )
    `)
    .returns<RecipeIngredientRelation[]>()

  if (relationsError) {
    console.error(relationsError)
    return []
  }

  // Map recipes and attach ingredients
  const recipes = (recipesData ?? []).map(mapRecipeRowToRecipe)
  
  // Group ingredients by recipe_id
  const ingredientsByRecipe: Record<number, Ingredient[]> = {}
  
  ;(relationsData ?? []).forEach((rel) => {
    const recipeId = rel.id_recipe
    if (!ingredientsByRecipe[recipeId]) {
      ingredientsByRecipe[recipeId] = []
    }
    ingredientsByRecipe[recipeId].push({
      id: rel.ingredient.id,
      name: rel.ingredient.name,
      description: rel.ingredient.description,
      quantity: rel.quantity
    })
  })

  // Attach ingredients to each recipe
  return recipes.map(recipe => ({
    ...recipe,
    ingredients: ingredientsByRecipe[recipe.id] || []
  }))
}