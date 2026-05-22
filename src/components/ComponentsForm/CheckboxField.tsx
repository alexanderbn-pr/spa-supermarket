'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { RecipeFormData } from '@/app/recipe/new/config/schema';

type FormFieldName = keyof RecipeFormData;

interface CheckboxFieldProps {
  field: {
    name: FormFieldName;
    label: string;
  };
  register: UseFormRegister<RecipeFormData>;
  errors: FieldErrors<RecipeFormData>;
}

export default function CheckboxField({ field, register, errors }: CheckboxFieldProps) {
  const error = errors[field.name];
  const errorMessage = error && 'message' in error ? error.message : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-[#1d1d1f]">
        <input
          type="checkbox"
          {...register(field.name)}
          className="h-5 w-5 rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3]/20"
          aria-describedby={error ? `${field.name}-error` : undefined}
        />
        {field.label}
      </label>
      {errorMessage && (
        <span id={`${field.name}-error`} className="text-sm text-red-500" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
