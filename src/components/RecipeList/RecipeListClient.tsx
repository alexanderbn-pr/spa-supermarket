'use client';

import { useState } from 'react';
import { Recipe } from '@/types/recipes.types';
import Card from '@/components/Card/Card';
import RecipeModal from '@/components/RecipeModal/RecipeModal';

interface RecipeListClientProps {
  recipes: Recipe[];
}

export function RecipeListClient({ recipes }: RecipeListClientProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedRecipe(null), 300);
  };

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 py-16">
        <p className="text-lg text-gray-500">No hay recetas disponibles</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {recipes.map((recipe) => (
            <a 
              href={`/recipes/${recipe.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleCardClick(recipe);
              }}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              aria-label={`Ver detalles de la receta ${recipe.name}`}
              key={`link-recipe-${recipe.id}`}
            >
              <Card 
                name={recipe.name} 
                description={recipe.description} 
                url={recipe.url} 
                labels={[recipe.difficulty?.name, recipe.healthyLevel?.name]} 
                mainLabel={recipe.type?.name} 
              />
            </a>
          ))}
        </div>
      </div>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}