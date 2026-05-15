import type { Metadata } from 'next';
import RecipeList from './components/RecipeList';
import RecipeListSkeleton from '@/components/RecipeList/RecipeListSkeleton';
import Link from 'next/link';
import { Suspense } from 'react';
import { fetchTypes, fetchDifficulties, fetchMealTypes, fetchHealthyLevels } from '@/api/recipe/get-dictionaries';
import RecipeFiltersBar from './components/RecipeFiltersBar';

export const metadata: Metadata = {
  title: 'Recipe Collection',
  description: 'Explore our collection of delicious recipes. Find inspiration for your weekly meal planning.',
  robots: {
    index: true,
    follow: true,
  },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RecipePage({ searchParams }: PageProps) {
  const [types, difficulties, mealTypes, healthyLevels] = await Promise.all([
    fetchTypes(),
    fetchDifficulties(),
    fetchMealTypes(),
    fetchHealthyLevels(),
  ]);

  return (
    <>
      <section className="flex justify-between items-start">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Recetario
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Explora nuestra colección de recetas deliciosas
          </p>
        </div>
        <Link
          href="/recipe/new"
          className="flex h-12 w-12 aspect-square min-w-[48px] min-h-[48px] items-center justify-center rounded-full bg-emerald-500 text-white shadow-md transition-all hover:bg-emerald-600 hover:shadow-lg active:scale-95"
          aria-label="Crear nueva receta"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Link>
      </section>

      <Suspense fallback={<div className="mb-6 h-12 animate-pulse rounded-xl bg-gray-100" />}>
        <RecipeFiltersBar
          dictionaries={{ types, difficulties, mealTypes, healthyLevels }}
        />
      </Suspense>

      <Suspense
        fallback={<RecipeListSkeleton count={8} />}
      >
        <RecipeList searchParams={searchParams} />
      </Suspense>
    </>
  );
}