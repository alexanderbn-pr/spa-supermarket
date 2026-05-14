import { supabase } from '@/lib/supabaseClient'
import { Recipe, RecipeRow, Ingredient, RecipeFilters } from '@/types/recipes.types'
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

export const fetchRecipes = async (filters?: RecipeFilters): Promise<Recipe[]> => {
  const buildQuery = (supabase: typeof import('@/lib/supabaseClient')['supabase']) => {
    let q = supabase
      .from('recipes')
      .select(`
        *,
        type:types (*),
        difficulty:difficulties (*),
        meal_type:meal_types (*),
        healthy_level:healthy_levels (*)
      `)
      .order('created_at', { ascending: false })
    
    if (filters?.search) {
      q = q.or(`name.ilike.%${filters.search}%`)
    }
    if (filters?.types?.length) {
      q = q.in('type_id', filters.types)
    }
    if (filters?.difficulties?.length) {
      q = q.in('difficulty_id', filters.difficulties)
    }
    if (filters?.mealTypes?.length) {
      q = q.in('meal_type_id', filters.mealTypes)
    }
    if (filters?.healthyLevels?.length) {
      q = q.in('healthy_level_id', filters.healthyLevels)
    }
    if (filters?.favourite === true) {
      q = q.eq('favourite', true)
    }
    
    return q.returns<RecipeRow[]>()
  }

  const { data: recipesData, error: recipesError } = await buildQuery(supabase)

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