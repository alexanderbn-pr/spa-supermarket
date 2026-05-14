'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { RecipeFormData } from '@/app/recipe/new/config/schema';

interface TextareaFieldProps {
  field: {
    name: keyof RecipeFormData;
    label: string;
    placeholder?: string;
  };
  register: UseFormRegister<RecipeFormData>;
  errors: FieldErrors<RecipeFormData>;
}

export default function TextareaField({ field, register, errors }: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#1d1d1f]">{field.label}</label>
      <textarea
        {...register(field.name)}
        placeholder={field.placeholder}
        rows={4}
        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-[#1d1d1f] placeholder:text-gray-400 focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
      />
      {errors[field.name] && (
        <span className="text-sm text-red-500">{errors[field.name]?.message}</span>
      )}
    </div>
  );
}
