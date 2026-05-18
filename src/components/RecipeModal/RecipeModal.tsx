'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/types/recipes.types';
import { deleteRecipeAction } from '@/actions/recipe-actions';

interface RecipeModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, isOpen, onClose, onDelete }) => {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleEdit = () => {
    router.push(`/recipe/new?id=${recipe.id}`);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteRecipeAction(recipe.id);
      setShowDeleteConfirm(false);
      onClose();
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      console.error('Error deleting recipe:', err);
    } finally {
      setIsDeleting(false);
    }
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
        {/* Header Actions */}
        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <button
            onClick={handleEdit}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1d1d1f] shadow-md transition-all hover:bg-[#ededf2] hover:scale-105 active:scale-95"
            aria-label="Editar receta"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md transition-all hover:bg-red-50 hover:scale-105 active:scale-95"
            aria-label="Borrar receta"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1d1d1f] shadow-md transition-all hover:bg-[#ededf2] hover:scale-105 active:scale-95"
            aria-label="Cerrar modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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
                    Momento del día
                  </span>
                  <span className="font-semibold text-blue-900">
                    {recipe.type.name}
                  </span>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex flex-col gap-1 rounded-lg bg-emerald-50 p-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                    Tiempo de elaboración
                  </span>
                  <span className="font-semibold text-emerald-900">
                    {recipe.difficulty.name}
                  </span>
                </div>
              )}
              {recipe.mealType && (
                <div className="flex flex-col gap-1 rounded-lg bg-amber-50 p-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-amber-600">
                    Tipo de plato
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

      {/* Delete Confirmation Bottom Sheet */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDeleteConfirm(false)}
          />

          {/* Bottom Sheet */}
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 animate-slideUpSheet">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 id="delete-dialog-title" className="mb-2 text-xl font-semibold text-[#1d1d1f]">
                ¿Borrar la receta?
              </h3>
              <p className="mb-6 text-gray-500">
                Se eliminará &quot;{recipe.name}&quot; de forma permanente.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-medium text-[#1d1d1f] transition-colors hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-3 font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting ? 'Borrando...' : 'Borrar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeModal;