'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { recipeSchema, RecipeFormData } from '../config/schema';
import { recipeFormConfig } from '../config/form.config';
import GenericForm from '@/components/ComponentsForm/GenericForm';
import { createRecipe } from '@/api/create-recipe';
import { useDictionaries } from '@/hooks/useDictionaries';
import { CreateRecipeFormSkeleton } from '@/components/Skeleton/FormSkeleton';

export default function CreateRecipeForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { types, difficulties, mealTypes, healthyLevels, ingredients, isLoading, error: dictError } = useDictionaries();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldUnregister: true,
    defaultValues: {
      name: '',
      description: '',
      url: '',
      type_id: '',
      difficulty_id: '',
      meal_type_id: '',
      healthy_level_id: '',
      ingredient_ids: [],
    },
  });

  const fields = recipeFormConfig.map((field) => {
    if (field.name === 'type_id') {
      return { ...field, options: types.map((t) => ({ value: t.id, label: t.name })) };
    }
    if (field.name === 'difficulty_id') {
      return { ...field, options: difficulties.map((d) => ({ value: d.id, label: d.name })) };
    }
    if (field.name === 'meal_type_id') {
      return { ...field, options: mealTypes.map((m) => ({ value: m.id, label: m.name })) };
    }
    if (field.name === 'healthy_level_id') {
      return { ...field, options: healthyLevels.map((h) => ({ value: h.id, label: h.name })) };
    }
    if (field.name === 'ingredient_ids') {
      return { ...field, options: ingredients.map((i) => ({ value: i.id, label: i.name })) };
    }
    return field;
  });

  const onSubmit = async (data: RecipeFormData) => {
    try {
      setIsSubmitting(true);
      await createRecipe(data);
      router.push('/recipe');
    } catch (err) {
      console.error(err);
      setError('Error al guardar la receta');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state con skeleton profesional
  if (isLoading) {
    return <CreateRecipeFormSkeleton />;
  }

  // Error state
  if (dictError) {
    return (
      <div className="flex flex-col gap-8 rounded-2xl bg-white p-8 shadow-md">
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {dictError}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 rounded-2xl bg-white p-8 shadow-md">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
          Nueva Receta
        </h1>
        <p className="text-sm text-gray-500">Completa los datos de la receta</p>
      </div>

      <GenericForm fields={fields} register={register} errors={errors} control={control} />

      <div className="flex gap-4">
        <Link
          href="/recipe"
          className="flex h-12 items-center justify-center rounded-full border border-gray-200 px-6 text-[#1d1d1f] transition-colors hover:bg-gray-50"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 items-center justify-center rounded-full bg-[#0071e3] px-8 font-semibold text-white transition-colors hover:bg-[#0077ed] disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar receta'}
        </button>
      </div>
    </form>
  );
}