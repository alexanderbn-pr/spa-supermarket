import { fetchRecipes } from '@/api/recipe/get-recipes';
import { RecipeListClient } from '@/components/RecipeList/RecipeListClient';

// Server Component - carga datos en el servidor
// Esto permite que Suspense funcione correctamente
export default async function RecipeList() {
  const recipes = await fetchRecipes();
  return <RecipeListClient recipes={recipes} />;
}