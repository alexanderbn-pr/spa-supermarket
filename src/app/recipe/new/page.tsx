import { Suspense } from 'react';
import CreateRecipeForm from './components/CreateRecipeForm';

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function NewRecipePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const recipeId = resolvedParams?.id ? parseInt(resolvedParams.id, 10) : null;

  return (
    <div className="mx-auto max-w-2xl py-8">
      <Suspense fallback={<div className="animate-pulse">Cargando...</div>}>
        <CreateRecipeForm recipeId={recipeId} />
      </Suspense>
    </div>
  );
}