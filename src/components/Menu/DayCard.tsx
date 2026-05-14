'use client';

import MealButton from './MealButton';
import type { DayCardProps } from '../../types/menu.types';

export default function DayCard({
  dayLabel,
  comida,
  cena,
  onComidaClick,
  onCenaClick,
  animationDelay = 0,
}: DayCardProps & { animationDelay?: number }) {
  return (
    <div
      className="animate-fadeSlideUp overflow-hidden rounded-2xl bg-white shadow-md"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Day header */}
      <div className="bg-[#f5f5f7] px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-[#1d1d1f]">{dayLabel}</h3>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-4 p-5">
        <MealButton
          label="Comida"
          recipe={comida}
          onClick={onComidaClick}
        />
        <MealButton
          label="Cena"
          recipe={cena}
          onClick={onCenaClick}
        />
      </div>
    </div>
  );
}