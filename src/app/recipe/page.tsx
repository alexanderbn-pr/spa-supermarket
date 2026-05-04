import type { Metadata } from 'next';
import RecipeList from './components/RecipeList';
import CardSkeleton from '@/components/Card/CardSkeleton';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Recipe Collection',
  description: 'Explore our collection of delicious recipes. Find inspiration for your weekly meal planning.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RecipePage() {
  return (
    <>
        <section className='flex justify-between items-start'>
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
              className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md transition-all hover:bg-emerald-600 hover:shadow-lg active:scale-95"
              aria-label="Crear nueva receta"
            >
              +
            </Link>
          </section>
          <Suspense
            fallback={
              <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" role="status" aria-label="Cargando recetas...">
                {[...Array(8)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <RecipeList />
            </Suspense>
        </>
  );
}