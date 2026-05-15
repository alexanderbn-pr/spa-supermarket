'use client';

import { UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import { RecipeFormData } from '@/app/recipe/new/config/schema';
import InputField from './InputField';
import TextareaField from './TextareaField';
import SelectField from './SelectField';
import MultiselectField from './MultiselectField';
import ComboboxField from './ComboboxField';

export interface FromField {
  name: keyof RecipeFormData;
  label: string;
  mode: 'input' | 'select' | 'multiselect' | 'textarea' | 'combobox';
  inputType?: 'text' | 'url' | 'email' | 'password' | 'number';
  placeholder?: string;
  options?: { value: number; label: string }[];
  onCreateOption?: (value: string) => Promise<{ value: number; label: string }>;
  onCustomCreate?: (value: string) => Promise<{ value: number; label: string }>;
  onEditOption?: (id: number, value: string) => Promise<{ value: number; label: string }>;
}

export interface ComboboxFieldType extends FromField {
  mode: 'combobox';
}

// Type guard para detectar campos de tipo combobox
function isComboboxField(field: FromField): field is ComboboxFieldType {
  return field.mode === 'combobox';
}

export interface MultiselectFieldType extends FromField {
  mode: 'multiselect';
  onCustomCreate?: (value: string) => Promise<{ value: number; label: string }>;
}

function isMultiselectField(field: FromField): field is MultiselectFieldType {
  return field.mode === 'multiselect';
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
            if (!isMultiselectField(field)) return null;
            return (
              <MultiselectField
                key={String(field.name)}
                field={field}
                control={control}
                errors={errors}
              />
            );
          case 'combobox':
            if (!isComboboxField(field)) return null;
            return (
              <ComboboxField
                key={String(field.name)}
                field={field}
                control={control}
                errors={errors}
                onCreateOption={field.onCreateOption}
                onEditOption={field.onEditOption}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}