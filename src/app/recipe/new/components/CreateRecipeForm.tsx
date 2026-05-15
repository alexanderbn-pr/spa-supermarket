'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { recipeSchema, RecipeFormData } from '../config/schema';
import { recipeFormConfig } from '../config/form.config';
import GenericForm from '@/components/ComponentsForm/GenericForm';
import { createRecipe, updateRecipe, getRecipeById } from '@/api/recipe/create-recipe';
import { useDictionaries } from '@/hooks/useDictionaries';
import { CreateRecipeFormSkeleton } from '@/components/Skeleton/FormSkeleton';
import {
  createType,
  createDifficulty,
  createMealType,
  createHealthyLevel,
  createIngredient,
  updateType,
  updateDifficulty,
  updateMealType,
  updateHealthyLevel,
} from '@/api/recipe/create-dictionary';

interface CreateRecipeFormProps {
  recipeId: number | null;
}

export default function CreateRecipeForm({ recipeId }: CreateRecipeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [recipeNotFound, setRecipeNotFound] = useState(false);

  // T9: Detect edit mode
  const isEditMode = recipeId !== null;

  const {
    types,
    difficulties,
    mealTypes,
    healthyLevels,
    ingredients,
    isLoading,
    error: dictError,
    refetchTypes,
    refetchDifficulties,
    refetchMealTypes,
    refetchHealthyLevels,
    refetchIngredients,
  } = useDictionaries();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldUnregister: true,
    defaultValues: {
      name: '',
      description: '',
      url: '',
      type_id: 0,
      difficulty_id: 0,
      meal_type_id: 0,
      healthy_level_id: 0,
      ingredient_ids: [],
    },
  });

  // T10: Fetch recipe data when in edit mode
  // T13: Add loading state during fetch
  useEffect(() => {
    if (isEditMode && recipeId) {
      const fetchRecipe = async () => {
        try {
          setIsLoadingRecipe(true);
          setError(null);
          const recipe = await getRecipeById(recipeId);
          
          // T11: Pre-populate form using useForm.reset()
          reset({
            name: recipe.name,
            description: recipe.description,
            url: recipe.url || '',
            type_id: recipe.type?.id || 0,
            difficulty_id: recipe.difficulty?.id || 0,
            meal_type_id: recipe.mealType?.id || 0,
            healthy_level_id: recipe.healthyLevel?.id || 0,
            ingredient_ids: recipe.ingredients?.map(ing => ({
              id: ing.id,
              quantity: ing.quantity,
            })) || [],
          });
        } catch (err) {
          console.error('Error fetching recipe:', err);
          // T14: Handle "recipe not found" error
          setError('Receta no encontrada');
          setRecipeNotFound(true);
        } finally {
          setIsLoadingRecipe(false);
        }
      };
      fetchRecipe();
    }
  }, [isEditMode, recipeId, reset]);

  const fields = recipeFormConfig.map((field) => {
    if (field.name === 'type_id') {
      return {
        ...field,
        options: types.map((t) => ({ value: t.id, label: t.name })),
        onCreateOption: async (value: string) => {
          const newType = await createType(value);
          await refetchTypes();
          return { value: newType.id, label: newType.name };
        },
        onEditOption: async (id: number, value: string) => {
          const updatedType = await updateType(id, value);
          await refetchTypes();
          return { value: updatedType.id, label: updatedType.name };
        },
      };
    }
    if (field.name === 'difficulty_id') {
      return {
        ...field,
        options: difficulties.map((d) => ({ value: d.id, label: d.name })),
        onCreateOption: async (value: string) => {
          const newDifficulty = await createDifficulty(value);
          await refetchDifficulties();
          return { value: newDifficulty.id, label: newDifficulty.name };
        },
        onEditOption: async (id: number, value: string) => {
          const updatedDifficulty = await updateDifficulty(id, value);
          await refetchDifficulties();
          return { value: updatedDifficulty.id, label: updatedDifficulty.name };
        },
      };
    }
    if (field.name === 'meal_type_id') {
      return {
        ...field,
        options: mealTypes.map((m) => ({ value: m.id, label: m.name })),
        onCreateOption: async (value: string) => {
          const newMealType = await createMealType(value);
          await refetchMealTypes();
          return { value: newMealType.id, label: newMealType.name };
        },
        onEditOption: async (id: number, value: string) => {
          const updatedMealType = await updateMealType(id, value);
          await refetchMealTypes();
          return { value: updatedMealType.id, label: updatedMealType.name };
        },
      };
    }
    if (field.name === 'healthy_level_id') {
      return {
        ...field,
        options: healthyLevels.map((h) => ({ value: h.id, label: h.name })),
        onCreateOption: async (value: string) => {
          const newHealthyLevel = await createHealthyLevel(value);
          await refetchHealthyLevels();
          return { value: newHealthyLevel.id, label: newHealthyLevel.name };
        },
        onEditOption: async (id: number, value: string) => {
          const updatedHealthyLevel = await updateHealthyLevel(id, value);
          await refetchHealthyLevels();
          return { value: updatedHealthyLevel.id, label: updatedHealthyLevel.name };
        },
      };
    }
    if (field.name === 'ingredient_ids') {
      return {
        ...field,
        options: ingredients.map((i) => ({ value: i.id, label: i.name })),
        onCustomCreate: async (value: string) => {
          const newIngredient = await createIngredient(value);
          await refetchIngredients();
          return { value: newIngredient.id, label: newIngredient.name };
        },
      };
    }
    return field;
  });

  // T12: Update recipe on save instead of create
  const onSubmit = async (data: RecipeFormData) => {
    try {
      setIsSubmitting(true);
      if (isEditMode && recipeId) {
        await updateRecipe(recipeId, data);
      } else {
        await createRecipe(data);
      }
      router.push('/recipe');
    } catch (err) {
      console.error(err);
      setError('Error al guardar la receta');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state con skeleton profesional
  // T13: Add loading state during fetch
  if (isLoading || isLoadingRecipe) {
    return <CreateRecipeFormSkeleton />;
  }

  // T14: Handle "recipe not found" error
  if (recipeNotFound) {
    return (
      <div className="flex flex-col gap-8 rounded-2xl bg-white p-8 shadow-md">
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          La receta no fue encontrada
        </div>
        <Link
          href="/recipe"
          className="flex h-12 items-center justify-center rounded-full border border-gray-200 px-6 text-[#1d1d1f] transition-colors hover:bg-gray-50"
        >
          Volver a recetas
        </Link>
      </div>
    );
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
          {isEditMode ? 'Editar Receta' : 'Nueva Receta'}
        </h1>
        <p className="text-sm text-gray-500">
          {isEditMode ? 'Modifica los datos de la receta' : 'Completa los datos de la receta'}
        </p>
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