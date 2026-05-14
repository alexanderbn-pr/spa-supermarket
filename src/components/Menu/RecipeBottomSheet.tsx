'use client';

import { useState, useEffect, useRef } from 'react';
import RecipeItem from './RecipeItem';
import type { RecipeBottomSheetProps } from '../../types/menu.types';

export default function RecipeBottomSheet({
  isOpen,
  onClose,
  options,
  selectedValue,
  onSelect,
  dayLabel,
  mealType,
}: RecipeBottomSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset search when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Focus input when sheet opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mealLabel = mealType === 'comida' ? 'Comida' : 'Cena';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet container */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[24px] animate-slideUpSheet max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={`Seleccionar ${mealLabel} para ${dayLabel}`}
      >
        {/* Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />

        {/* Header */}
        <div className="px-4 pb-2">
          <h2 className="text-xl font-semibold text-[#1d1d1f]">
            Seleccionar {mealLabel}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{dayLabel}</p>
        </div>

        {/* Search input */}
        <div className="px-4 pb-3">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200
                bg-gray-50 text-[17px] text-[#1d1d1f]
                focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20
                placeholder:text-gray-400"
              placeholder="Buscar recetas..."
            />
          </div>
        </div>

        {/* Recipe list */}
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {filteredOptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No se encontraron recetas' : 'No hay recetas disponibles'}
            </div>
          ) : (
            filteredOptions.map((option) => (
              <RecipeItem
                key={option.value}
                label={option.label}
                selected={selectedValue === option.value}
                disabled={option.disabled && selectedValue !== option.value}
                onClick={() => {
                  if (!option.disabled || selectedValue === option.value) {
                    onSelect(option.value === -1 ? null : option.value);
                  }
                }}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}