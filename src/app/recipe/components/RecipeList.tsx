import { fetchRecipes } from '@/api/recipe/get-recipes';
import { RecipeListClient } from '@/components/RecipeList/RecipeListClient';
import { RecipeFilters } from '@/types/recipes.types';
import { Suspense } from 'react';

interface RecipeListProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function parseSearchParamsToFilters(searchParams: URLSearchParams): RecipeFilters {
  const getParam = (key: string): string | undefined => {
    const value = searchParams.get(key);
    return value === '' ? undefined : value || undefined;
  };

  const getMultiParam = (key: string): number[] | undefined => {
    const value = searchParams.get(key);
    if (!value) return undefined;
    const parsed = value.split(',').map(Number).filter((n) => !isNaN(n));
    return parsed.length > 0 ? parsed : undefined;
  };

  return {
    search: getParam('search'),
    types: getMultiParam('types'),
    difficulties: getMultiParam('difficulties'),
    mealTypes: getMultiParam('mealTypes'),
    healthyLevels: getMultiParam('healthyLevels'),
    favourite: searchParams.get('favourite') === 'true' ? true : undefined,
  };
}

async function RecipeListContent({ searchParams }: { searchParams: URLSearchParams }) {
  const filters = parseSearchParamsToFilters(searchParams);
  const recipes = await fetchRecipes(filters);
  return <RecipeListClient recipes={recipes} />;
}

export default async function RecipeList({ searchParams }: RecipeListProps) {
  let params = new URLSearchParams();

  if (searchParams) {
    const resolved = await searchParams;
    params = new URLSearchParams();
    Object.entries(resolved).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });
  }

  return (
    <Suspense fallback={<div className="grid grid-cols-3 gap-6 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" />}>
      <RecipeListContent searchParams={params} />
    </Suspense>
  );
}