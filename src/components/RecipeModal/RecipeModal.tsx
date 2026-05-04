'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Recipe } from '@/types/recipes.types';

interface RecipeModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, isOpen, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-[#f5f5f7] mx-4 animate-slideUp">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1d1d1f] shadow-md transition-all hover:bg-[#ededf2] hover:scale-105 active:scale-95"
          aria-label="Cerrar modal"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            className="object-cover"
            alt={`Imagen de ${recipe.name}`}
            src={recipe.url}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        </div>

        <div className="flex flex-col gap-4 p-6 overflow-y-auto max-h-[calc(90vh-40vh)]">
          <h2
            id="modal-title"
            className="text-[28px] font-bold tracking-[0.196px] leading-[1.14] text-[#1d1d1f]"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            {recipe.name}
          </h2>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Información de la receta
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {recipe.type && (
                <div className="flex flex-col gap-1 rounded-lg bg-blue-50 p-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
                    Tipo de plato
                  </span>
                  <span className="font-semibold text-blue-900">
                    {recipe.type.name}
                  </span>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex flex-col gap-1 rounded-lg bg-emerald-50 p-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                    Dificultad
                  </span>
                  <span className="font-semibold text-emerald-900">
                    {recipe.difficulty.name}
                  </span>
                </div>
              )}
              {recipe.mealType && (
                <div className="flex flex-col gap-1 rounded-lg bg-amber-50 p-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-amber-600">
                    Momento del día
                  </span>
                  <span className="font-semibold text-amber-900">
                    {recipe.mealType.name}
                  </span>
                </div>
              )}
              {recipe.healthyLevel && (
                <div className="flex flex-col gap-1 rounded-lg bg-purple-50 p-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-purple-600">
                    Nivel saludable
                  </span>
                  <span className="font-semibold text-purple-900">
                    {recipe.healthyLevel.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {recipe.description && (
            <div className="flex flex-col gap-2 rounded-xl bg-white p-4">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-[#1d1d1f]">Descripción</h3>
              </div>
              <p className="text-base leading-relaxed text-gray-600">
                {recipe.description}
              </p>
            </div>
          )}

          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="flex flex-col gap-3 rounded-xl bg-white p-4">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-semibold text-[#1d1d1f]">Ingredientes</h3>
                <span className="text-sm text-gray-500">({recipe.ingredients.length})</span>
              </div>
              <ul className="flex flex-col gap-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li 
                    key={ingredient.id ?? index} 
                    className="flex items-start justify-between gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                  >
                    <div className="flex items-start gap-2">
                      <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                        {index + 1}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#1d1d1f]">{ingredient.name}</span>
                        {ingredient.description && (
                          <span className="text-sm text-gray-500">
                            {ingredient.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-md bg-amber-100 px-2 py-1 text-sm font-medium text-amber-800">
                      {ingredient.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;