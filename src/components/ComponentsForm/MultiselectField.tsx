'use client';

import { Control, FieldErrors, Controller } from 'react-hook-form';
import { RecipeFormData } from '@/app/recipe/new/config/schema';

interface Option {
  value: number;
  label: string;
}

// Tipo para los ingredientes seleccionados (coincide con ingredient_ids en el schema)
interface IngredientWithQuantity {
  id: number;
  quantity: string;
}

// Definir el tipo de field compatible con GenericForm pero específico para multiselect
interface MultiselectFieldConfig {
  name: keyof RecipeFormData;
  label: string;
  mode: 'multiselect';
  options?: Option[];
}

interface MultiselectFieldProps {
  field: MultiselectFieldConfig;
  control: Control<RecipeFormData>;
  errors: FieldErrors<RecipeFormData>;
}

export default function MultiselectField({ field, control, errors }: MultiselectFieldProps) {
  const options = field.options ?? [];

  const error = errors[field.name];
  const errorMessage = error && 'message' in error ? error.message : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#1d1d1f]" id={`${field.name}-label`}>
        {field.label}
      </label>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField }) => {
          // Estado derivado del formulario
          const selectedValue = (controllerField.value ?? []) as IngredientWithQuantity[];

          // Cálculos simples (no necesitan useMemo porque son O(n))
          const selectedIds = selectedValue.map((i) => i.id);
          const availableOptionsFiltered = options.filter(
            (option) => !selectedIds.includes(option.value)
          );
          const isAllSelected = options.length > 0 && selectedIds.length === options.length;

          // Función para sincronizar con el formulario
          const syncWithForm = (ingredients: IngredientWithQuantity[]) => {
            controllerField.onChange(ingredients);
          };

          // Handler para eliminar ingrediente
          const handleRemoveIngredient = (id: number) => {
            const updated = selectedValue.filter((i) => i.id !== id);
            syncWithForm(updated);
          };

          // Handler para cambiar cantidad
          const handleQuantityChange = (id: number, quantity: string) => {
            const updated = selectedValue.map((i) =>
              i.id === id ? { ...i, quantity } : i
            );
            syncWithForm(updated);
          };

          // Handler para agregar ingrediente
          const handleAddIngredient = (optionValue: number) => {
            const newSelection: IngredientWithQuantity[] = [
              ...selectedValue,
              { id: optionValue, quantity: '' },
            ];
            syncWithForm(newSelection);
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

              {/* Available options to select */}
              <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-3">
                {availableOptionsFiltered.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleAddIngredient(option.value)}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-[#0071e3] hover:text-[#0071e3]"
                  >
                    <span>{option.label}</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                ))}
                {isAllSelected && (
                  <span className="text-sm text-gray-400">Todos los ingredientes seleccionados</span>
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