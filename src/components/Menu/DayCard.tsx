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
      className="animate-fadeSlideUp"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Sticky day header */}
      <div className="sticky top-0 z-10 bg-[#f5f5f7]/95 backdrop-blur-sm py-3 px-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-[#1d1d1f]">{dayLabel}</h3>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-4 bg-white mx-4 mt-4 mb-6 p-5 rounded-2xl shadow-[rgba(0,0,0,0.08)_0_2px_8px]">
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