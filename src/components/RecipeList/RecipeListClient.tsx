'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/types/recipes.types';
import Card from '@/components/Card/Card';
import RecipeModal from '@/components/RecipeModal/RecipeModal';
import EmptyState from '@/app/recipe/components/EmptyState';
import { updateRecipeFavourite } from '@/actions/update-recipe-favourite';

interface RecipeListClientProps {
  recipes: Recipe[];
}

export function RecipeListClient({ recipes }: RecipeListClientProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const router = useRouter();

  const handleCardClick = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedRecipe(null), 300);
  }, []);

  // Optimistic update - update local state immediately
  const handleFavorite = useCallback(
    async (recipeId: number, e: React.MouseEvent) => {
      // Stop propagation so it doesn't trigger card click
      e.stopPropagation();
      
      // Don't update if already updating
      if (updatingId !== null) return;
      
      const recipe = recipes.find((r) => r.id === recipeId);
      if (!recipe) return;

      const newFavourite = !recipe.favourite;
      
      // Optimistic update: update local state immediately
      setUpdatingId(recipeId);
      
      try {
        const result = await updateRecipeFavourite(recipeId, newFavourite);

        if (result.success) {
          // Refresh the page data after successful update
          router.refresh();
        } else {
          console.error('Failed to update favorite:', result.error);
        }
      } finally {
        setUpdatingId(null);
      }
    },
    [recipes, router, updatingId]
  );

  // Memoize handlers passed to children to prevent unnecessary re-renders
  const memoizedHandleCardClick = useMemo(() => handleCardClick, [handleCardClick]);
  const memoizedHandleCloseModal = useMemo(() => handleCloseModal, [handleCloseModal]);
  const memoizedHandleFavorite = useMemo(() => handleFavorite, [handleFavorite]);

  if (recipes.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {recipes.map((recipe) => (
            <div
              role="button"
              tabIndex={0}
              onClick={() => memoizedHandleCardClick(recipe)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  memoizedHandleCardClick(recipe);
                }
              }}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              aria-label={`Ver detalles de la receta ${recipe.name}`}
              key={`recipe-${recipe.id}`}
            >
              <Card
                name={recipe.name}
                description={recipe.description}
                url={recipe.url}
                labels={[recipe.difficulty?.name, recipe.healthyLevel?.name]}
                mainLabel={recipe.type?.name}
                recipeId={recipe.id}
                isFavorite={recipe.favourite}
                onFavorite={memoizedHandleFavorite}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={isModalOpen}
          onClose={memoizedHandleCloseModal}
        />
      )}
    </>
  );
}

export default RecipeListClient;