import { supabase } from '@/lib/supabaseClient';
import { BaseLookup } from '@/types/recipes.types';

export const createType = async (name: string): Promise<BaseLookup> => {
  const { data, error } = await supabase
    .from('types')
    .insert({ name })
    .select()
    .single();
  
  if (error) throw error;
  if (!data) throw new Error('Error al crear el tipo');
  return data;
};

export const createDifficulty = async (name: string): Promise<BaseLookup> => {
  const { data, error } = await supabase
    .from('difficulties')
    .insert({ name })
    .select()
    .single();
  
  if (error) throw error;
  if (!data) throw new Error('Error al crear la dificultad');
  return data;
};

export const createMealType = async (name: string): Promise<BaseLookup> => {
  const { data, error } = await supabase
    .from('meal_types')
    .insert({ name })
    .select()
    .single();
  
  if (error) throw error;
  if (!data) throw new Error('Error al crear el tipo de comida');
  return data;
};

export const createHealthyLevel = async (name: string): Promise<BaseLookup> => {
  const { data, error } = await supabase
    .from('healthy_levels')
    .insert({ name })
    .select()
    .single();
  
  if (error) throw error;
  if (!data) throw new Error('Error al crear el nivel saludable');
  return data;
};

export const createIngredient = async (name: string): Promise<BaseLookup> => {
  const { data, error } = await supabase
    .from('ingredients')
    .insert({ name })
    .select()
    .single();
  
  if (error) throw error;
  if (!data) throw new Error('Error al crear el ingrediente');
  return data;
};