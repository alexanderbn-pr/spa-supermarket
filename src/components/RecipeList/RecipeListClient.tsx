'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
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
  const router = useRouter();

  // Local state for optimistic favorite updates
  const [localRecipes, setLocalRecipes] = useState<Recipe[]>(recipes);

  // Sync local state when recipes prop changes (from server)
  useEffect(() => {
    setLocalRecipes(recipes);
  }, [recipes]);

  const handleCardClick = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedRecipe(null), 300);
  }, []);

  // Handle recipe deletion - remove from local state
  const handleDeleteRecipe = useCallback(() => {
    if (selectedRecipe) {
      setLocalRecipes((prev) => prev.filter((r) => r.id !== selectedRecipe.id));
    }
  }, [selectedRecipe]);

  // Optimistic update - update local state immediately
  const handleFavorite = useCallback(
    async (recipeId: number, e: React.MouseEvent) => {
      // Stop propagation so it doesn't trigger card click
      e.stopPropagation();

      const recipe = localRecipes.find((r) => r.id === recipeId);
      if (!recipe) return;

      const newFavourite = !recipe.favourite;

      // Optimistic update: update local state immediately
      setLocalRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeId ? { ...r, favourite: newFavourite } : r
        )
      );

      try {
        const result = await updateRecipeFavourite(recipeId, newFavourite);

        if (!result.success) {
          console.error('Failed to update favorite:', result.error);
          // Rollback on error by refreshing
          router.refresh();
        }
      } catch {
        // Rollback on error by refreshing
        router.refresh();
      }
    },
    [localRecipes, router]
  );

  // Memoize handlers passed to children to prevent unnecessary re-renders
  const memoizedHandleCardClick = useMemo(() => handleCardClick, [handleCardClick]);
  const memoizedHandleCloseModal = useMemo(() => handleCloseModal, [handleCloseModal]);
  const memoizedHandleFavorite = useMemo(() => handleFavorite, [handleFavorite]);

  if (localRecipes.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {localRecipes.map((recipe) => (
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
                isComodin={recipe.comodin}
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
          onDelete={handleDeleteRecipe}
        />
      )}
    </>
  );
}

export default RecipeListClient;