'use client';

import { useState, useRef, useEffect } from 'react';
import { Control, FieldErrors, Controller } from 'react-hook-form';
import { RecipeFormData } from '@/app/recipe/new/config/schema';

interface Option {
  value: number;
  label: string;
}

interface IngredientWithQuantity {
  id: number;
  quantity: string;
}

interface MultiselectFieldConfig {
  name: keyof RecipeFormData;
  label: string;
  mode: 'multiselect';
  options?: Option[];
  onCustomCreate?: (value: string) => Promise<{ value: number; label: string }>;
}

interface MultiselectFieldProps {
  field: MultiselectFieldConfig;
  control: Control<RecipeFormData>;
  errors: FieldErrors<RecipeFormData>;
}

export default function MultiselectField({ field, control, errors }: MultiselectFieldProps) {
  const options = field.options ?? [];
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const error = errors[field.name];
  const errorMessage = error && 'message' in error ? error.message : undefined;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#1d1d1f]" id={`${field.name}-label`}>
        {field.label}
      </label>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField }) => {
          const selectedValue = (controllerField.value ?? []) as IngredientWithQuantity[];
          const selectedIds = selectedValue.map((i) => i.id);

          // Filter options based on search query
          const filteredOptions = options.filter(
            (option) =>
              !selectedIds.includes(option.value) &&
              option.label.toLowerCase().includes(searchQuery.toLowerCase())
          );

          const handleRemoveIngredient = (id: number) => {
            const updated = selectedValue.filter((i) => i.id !== id);
            controllerField.onChange(updated);
          };

          const handleQuantityChange = (id: number, quantity: string) => {
            const updated = selectedValue.map((i) =>
              i.id === id ? { ...i, quantity } : i
            );
            controllerField.onChange(updated);
          };

          const handleAddIngredient = (optionValue: number) => {
            controllerField.onChange([
              ...selectedValue,
              { id: optionValue, quantity: '1' },
            ]);
            setSearchQuery('');
            setIsDropdownOpen(false);
          };

          const handleCustomCreate = async () => {
            if (!searchQuery.trim() || !field.onCustomCreate) return;

            setIsCreating(true);
            try {
              const newOption = await field.onCustomCreate(searchQuery.trim());
              controllerField.onChange([
                ...selectedValue,
                { id: newOption.value, quantity: '1' },
              ]);
              setSearchQuery('');
              setIsDropdownOpen(false);
            } catch (err) {
              console.error('Error creating ingredient:', err);
            } finally {
              setIsCreating(false);
            }
          };

          return (
            <div className="flex flex-col gap-3" role="group" aria-labelledby={`${field.name}-label`}>
              {/* Selected ingredients with quantity inputs */}
              {selectedValue.length > 0 && (
                <div className="flex flex-col gap-2 rounded-lg bg-emerald-50 p-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                    Ingredientes seleccionados
                  </span>
                  {selectedValue.map((ingredient) => {
                    const option = options.find((o) => o.value === ingredient.id);
                    return (
                      <div
                        key={ingredient.id}
                        className="flex items-center justify-between gap-2 rounded-lg bg-white p-2"
                      >
                        <span className="flex-1 text-sm font-medium text-[#1d1d1f]">
                          {option?.label}
                        </span>
                        <input
                          type="text"
                          placeholder="Cantidad"
                          value={ingredient.quantity}
                          onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                          className="w-24 rounded-md border border-gray-200 px-2 py-1 text-sm focus:border-[#0071e3] focus:outline-none"
                          aria-label={`Cantidad para ${option?.label}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(ingredient.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500"
                          aria-label={`Quitar ${option?.label}`}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Searchable dropdown */}
              <div ref={dropdownRef} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Buscar ingrediente..."
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm
                    focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20
                    placeholder:text-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      e.preventDefault();
                      if (field.onCustomCreate && filteredOptions.length === 0) {
                        handleCustomCreate();
                      } else if (filteredOptions.length > 0) {
                        handleAddIngredient(filteredOptions[0].value);
                      }
                    }
                  }}
                />

                {/* Dropdown options */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleAddIngredient(option.value)}
                          className="w-full px-4 py-2 text-left text-sm text-[#1d1d1f] hover:bg-gray-50 transition-colors flex items-center justify-between"
                        >
                          <span>{option.label}</span>
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      ))
                    ) : (
                      field.onCustomCreate && searchQuery.trim() && (
                        <button
                          type="button"
                          onClick={handleCustomCreate}
                          disabled={isCreating}
                          className="w-full px-4 py-2 text-left text-sm text-[#0071e3] hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>
                            {isCreating ? 'Creando...' : `Crear "${searchQuery.trim()}"`}
                          </span>
                        </button>
                      )
                    )}
                    {filteredOptions.length === 0 && (!field.onCustomCreate || !searchQuery.trim()) && (
                      <div className="px-4 py-2 text-sm text-gray-400">
                        {searchQuery.trim() ? 'Sin resultados' : 'Escribe para buscar'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />
      {errorMessage && (
        <span className="text-sm text-red-500" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
}