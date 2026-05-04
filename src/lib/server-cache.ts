import { cache } from 'react';
import { supabase } from './supabaseClient';
import { BaseLookup } from '@/types/recipes.types';

/**
 * Utilidades de caching para Server Components
 * React.cache() proporciona deduplicación a nivel de request
 * Nota: Este caching solo funciona dentro de un mismo request
 * Para caché cross-request, considera usar LRU cache o Redis
 */

// Deduplicación de llamadas dentro de un mismo request
export const getTypes = cache(async (): Promise<BaseLookup[]> => {
  const { data, error } = await supabase.from('types').select('*');
  if (error) throw new Error(`Failed to fetch types: ${error.message}`);
  return data ?? [];
});

export const getDifficulties = cache(async (): Promise<BaseLookup[]> => {
  const { data, error } = await supabase.from('difficulties').select('*');
  if (error) throw new Error(`Failed to fetch difficulties: ${error.message}`);
  return data ?? [];
});

export const getMealTypes = cache(async (): Promise<BaseLookup[]> => {
  const { data, error } = await supabase.from('meal_types').select('*');
  if (error) throw new Error(`Failed to fetch meal types: ${error.message}`);
  return data ?? [];
});

export const getHealthyLevels = cache(async (): Promise<BaseLookup[]> => {
  const { data, error } = await supabase.from('healthy_levels').select('*');
  if (error) throw new Error(`Failed to fetch healthy levels: ${error.message}`);
  return data ?? [];
});

export const getIngredients = cache(async (): Promise<BaseLookup[]> => {
  const { data, error } = await supabase.from('ingredients').select('*');
  if (error) throw new Error(`Failed to fetch ingredients: ${error.message}`);
  return data ?? [];
});

/**
 * Cargar todos los diccionarios en paralelo
 * React.cache ya está aplicado a cada función individual
 * por lo que llamadas múltiples dentro del mismo request
 * solo ejecutarán la query una vez
 */
export const getAllDictionaries = cache(async () => {
  const [types, difficulties, mealTypes, healthyLevels, ingredients] = await Promise.all([
    getTypes(),
    getDifficulties(),
    getMealTypes(),
    getHealthyLevels(),
    getIngredients(),
  ]);

  return {
    types,
    difficulties,
    mealTypes,
    healthyLevels,
    ingredients,
  };
});