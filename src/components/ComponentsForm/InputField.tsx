'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { RecipeFormData } from '@/app/recipe/new/config/schema';

type FormFieldName = keyof RecipeFormData;

interface InputFieldProps {
  field: {
    name: FormFieldName;
    label: string;
    inputType?: 'text' | 'url' | 'email' | 'password' | 'number';
    placeholder?: string;
  };
  register: UseFormRegister<RecipeFormData>;
  errors: FieldErrors<RecipeFormData>;
}

export default function InputField({ field, register, errors }: InputFieldProps) {
  const error = errors[field.name];
  const errorMessage = error && 'message' in error ? error.message : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#1d1d1f]">{field.label}</label>
      <input
        type={field.inputType || 'text'}
        {...register(field.name)}
        placeholder={field.placeholder}
        className="h-12 rounded-xl border border-gray-200 bg-white px-4 text-[#1d1d1f] placeholder:text-gray-400 focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 aria-invalid={error ? 'true' : 'false'}"
        aria-describedby={error ? `${field.name}-error` : undefined}
      />
      {errorMessage && (
        <span id={`${field.name}-error`} className="text-sm text-red-500" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
