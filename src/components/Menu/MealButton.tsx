'use client';

import React from 'react';
import type { MealButtonProps } from '../../types/menu.types';

export default React.memo(function MealButton({
  label,
  recipe,
  onClick,
}: MealButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col w-full min-h-[72px] p-4 rounded-xl border border-gray-100 bg-gray-50/50
        hover:border-[#0071e3]/30 hover:bg-[#0071e3]/5
        active:scale-[0.98] transition-all duration-200
        touch-manipulation"
    >
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-[17px] text-[#1d1d1f] font-normal mt-1">
        {recipe?.name || 'Seleccionar...'}
      </span>
    </button>
  );
});