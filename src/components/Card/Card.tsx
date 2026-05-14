'use client';
import React from 'react';
import Image from 'next/image';

interface Props {
  url: string;
  name: string;
  description: string;
  labels?: string[];
  mainLabel?: string;
  recipeId?: number;
  isFavorite?: boolean;
  onFavorite?: (recipeId: number, e: React.MouseEvent) => void;
}

const Card = ({
  url,
  name,
  description,
  labels,
  mainLabel,
  recipeId,
  isFavorite = false,
  onFavorite,
}: Props) => {
  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // Stop propagation is handled in RecipeListClient
    if (onFavorite && recipeId !== undefined) {
      onFavorite(recipeId, e);
    }
  };

  const getLabelStyles = (index: number) =>
    index % 2 === 0
      ? 'bg-blue-50 text-blue-700'
      : 'bg-emerald-50 text-emerald-700';

  return (
    <>
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          alt={`Imagen de ${name}`}
          src={url}
          loading="lazy"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {mainLabel && (
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-700 backdrop-blur-sm">
              {mainLabel}
            </span>
          </div>
        )}
      </div>

      <section className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-emerald-600">
            {name}
          </h3>
          <button
            onClick={handleFavorite}
            className="flex-shrink-0 rounded-full p-1.5 text-2xl transition-colors hover:bg-gray-100 active:scale-110"
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            {isFavorite ? (
              <span className="text-amber-500">★</span>
            ) : (
              <span className="text-gray-400 hover:text-amber-500">☆</span>
            )}
          </button>
        </div>

        <p className="line-clamp-2 text-sm text-gray-600">{description}</p>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {labels?.map(
            (label, index) =>
              label && (
                <span
                  key={label + '-' + index}
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getLabelStyles(index)}`}
                >
                  {label}
                </span>
              )
          )}
        </div>
      </section>
    </>
  );
};

export default React.memo(Card);