'use client';

import { Control, FieldErrors, Controller } from 'react-hook-form';
import { RecipeFormData } from '@/app/recipe/new/config/schema';

interface Option {
  value: number;
  label: string;
}

interface SelectFieldProps {
  field: {
    name: keyof RecipeFormData;
    label: string;
    placeholder?: string;
    options?: Option[];
  };
  control: Control<RecipeFormData>;
  errors: FieldErrors<RecipeFormData>;
}

export default function SelectField({ field, control, errors }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#1d1d1f]">{field.label}</label>
      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField }) => (
          <select
            {...controllerField}
            // Convertir a number para el value del select
            value={controllerField.value as number}
            onChange={(e) => controllerField.onChange(Number(e.target.value))}
            className="h-12 rounded-xl border border-gray-200 bg-white px-4 text-[#1d1d1f] focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
          >
            <option value="">{field.placeholder}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
      {errors[field.name] && (
        <span className="text-sm text-red-500">{errors[field.name]?.message}</span>
      )}
    </div>
  );
}