import { Recipe, RecipeRow } from '@/types/recipes.types'

export const mapRecipeRowToRecipe = (r: RecipeRow): Recipe => ({
  id: r.id,
  url: r.url,
  name: r.name,
  description: r.description,
  ingredients: [],
  type: r.type,
  difficulty:  r.difficulty,
  mealType:  r.meal_type,
  healthyLevel: r.healthy_level,
  favourite: r.favourite,
  comodin: r.comodin
})