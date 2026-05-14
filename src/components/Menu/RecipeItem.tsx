'use client';

import type { RecipeItemProps } from '../../types/menu.types';

export default function RecipeItem({
  label,
  selected,
  disabled,
  onClick,
}: RecipeItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex items-center w-full p-4 rounded-xl border-b border-gray-100
        disabled:opacity-40 disabled:cursor-not-allowed
        active:bg-gray-50 transition-colors"
    >
      <span
        className={`text-[17px] text-[#1d1d1f] ${disabled && !selected ? 'text-gray-400' : ''}`}
      >
        {label}
      </span>
      {selected && (
        <svg
          className="w-5 h-5 text-[#0071e3] ml-auto animate-fadeIn"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}