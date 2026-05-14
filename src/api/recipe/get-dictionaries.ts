import { supabase } from '@/lib/supabaseClient';
import { BaseLookup } from '@/types/recipes.types';

export const fetchTypes = async (): Promise<BaseLookup[]> => {
  const { data, error } = await supabase.from('types').select('*').order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const fetchDifficulties = async (): Promise<BaseLookup[]> => {
  const { data, error } = await supabase.from('difficulties').select('*').order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const fetchMealTypes = async (): Promise<BaseLookup[]> => {
  const { data, error } = await supabase.from('meal_types').select('*').order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const fetchHealthyLevels = async (): Promise<BaseLookup[]> => {
  const { data, error } = await supabase.from('healthy_levels').select('*').order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const fetchIngredients = async (): Promise<BaseLookup[]> => {
  const { data, error } = await supabase.from('ingredients').select('*').order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
};
