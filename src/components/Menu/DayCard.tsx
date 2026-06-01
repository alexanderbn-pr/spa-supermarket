'use client';

import React from 'react';
import MealButton from './MealButton';
import AcompananteSelector from './AcompananteSelector';
import type { DayCardProps } from '../../types/menu.types';

export default React.memo(function DayCard({
  dayLabel,
  comida,
  cena,
  onComidaClick,
  onCenaClick,
  acompananteEnabled,
  acompanantes,
  acompananteRecipes,
  onToggleAcompanante,
  onAcompananteChange,
  animationDelay = 0,
}: DayCardProps & { animationDelay?: number }) {
  return (
    <div
      className="animate-fadeSlideUp rounded-2xl bg-white shadow-md"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Day header */}
      <div className="bg-[#f5f5f7] px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-[#1d1d1f]">{dayLabel}</h3>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-4 p-5">
        <div>
          <MealButton
            label="Comida"
            recipe={comida}
            onClick={onComidaClick}
          />
          {onToggleAcompanante && onAcompananteChange && acompananteRecipes && (
            <AcompananteSelector
              moment="comida"
              enabled={acompananteEnabled?.comida ?? false}
              selectedRecipes={acompanantes?.comida ?? []}
              acompananteOptions={acompananteRecipes}
              onToggle={onToggleAcompanante}
              onChange={onAcompananteChange}
            />
          )}
        </div>
        <div>
          <MealButton
            label="Cena"
            recipe={cena}
            onClick={onCenaClick}
          />
          {onToggleAcompanante && onAcompananteChange && acompananteRecipes && (
            <AcompananteSelector
              moment="cena"
              enabled={acompananteEnabled?.cena ?? false}
              selectedRecipes={acompanantes?.cena ?? []}
              acompananteOptions={acompananteRecipes}
              onToggle={onToggleAcompanante}
              onChange={onAcompananteChange}
            />
          )}
        </div>
      </div>
    </div>
  );
});