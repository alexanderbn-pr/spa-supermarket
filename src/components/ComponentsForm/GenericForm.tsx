'use client';

import { UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import { RecipeFormData } from '@/app/recipe/new/config/schema';
import InputField from './InputField';
import TextareaField from './TextareaField';
import SelectField from './SelectField';
import MultiselectField from './MultiselectField';

export interface FromField {
  name: keyof RecipeFormData;
  label: string;
  mode: 'input' | 'select' | 'multiselect' | 'textarea';
  inputType?: 'text' | 'url' | 'email' | 'password' | 'number';
  placeholder?: string;
  options?: { value: number; label: string }[];
}

// Type guard para detectar campos de tipo multiselect
function isMultiselectField(field: FromField): field is FromField & { mode: 'multiselect'; options: NonNullable<FromField['options']> } {
  return field.mode === 'multiselect' && Array.isArray(field.options);
}

interface GenericFormProps {
  fields: FromField[];
  register: UseFormRegister<RecipeFormData>;
  errors: FieldErrors<RecipeFormData>;
  control: Control<RecipeFormData>;
}

export default function GenericForm({
  fields,
  register,
  errors,
  control,
}: GenericFormProps) {
  return (
    <div className="flex flex-col gap-6">
      {fields.map((field) => {
        switch (field.mode) {
          case 'input':
            return (
              <InputField
                key={String(field.name)}
                field={field}
                register={register}
                errors={errors}
              />
            );
          case 'textarea':
            return (
              <TextareaField
                key={String(field.name)}
                field={field}
                register={register}
                errors={errors}
              />
            );
          case 'select':
            return (
              <SelectField
                key={String(field.name)}
                field={field}
                control={control}
                errors={errors}
              />
            );
          case 'multiselect':
            // Solo pasar el field si tiene opciones (type guard)
            if (isMultiselectField(field)) {
              return (
                <MultiselectField
                  key={String(field.name)}
                  field={field}
                  control={control}
                  errors={errors}
                />
              );
            }
            return null;
          default:
            return null;
        }
      })}
    </div>
  );
}
