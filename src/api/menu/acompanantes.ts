import { supabase } from '@/lib/supabaseClient';
import { AcompananteRow } from '@/types/menuApi.types';

export interface FetchAcompanantesResponse {
  data: AcompananteRow[];
  error: string | null;
}

export interface AcompananteMutationResponse {
  success: boolean;
  error: string | null;
}

/**
 * Fetch all acompañante rows from menu_acompanantes table.
 */
export const fetchAcompanantes = async (): Promise<FetchAcompanantesResponse> => {
  try {
    const { data, error } = await supabase
      .from('menu_acompanantes')
      .select('*')
      .returns<AcompananteRow[]>();

    if (error) {
      console.error('Error fetching acompañantes:', error);
      return { data: [], error: error.message };
    }

    return { data: data ?? [], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error fetching acompañantes:', message);
    return { data: [], error: message };
  }
};

/**
 * Add a new acompañante recipe assignment for a day+moment.
 * No conflict check — multi-select allows duplicates across days/moments.
 */
export const addAcompanante = async (
  dayId: number,
  momentId: number,
  recipeId: number
): Promise<AcompananteMutationResponse> => {
  try {
    const { error } = await supabase.from('menu_acompanantes').insert({
      day_id: dayId,
      moment_id: momentId,
      recipe_id: recipeId,
    });

    if (error) {
      console.error('Error adding acompañante:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error adding acompañante:', message);
    return { success: false, error: message };
  }
};

/**
 * Remove a specific acompañante assignment by its row ID.
 */
export const removeAcompanante = async (
  id: number
): Promise<AcompananteMutationResponse> => {
  try {
    const { error } = await supabase
      .from('menu_acompanantes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing acompañante:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error removing acompañante:', message);
    return { success: false, error: message };
  }
};

/**
 * Clear all acompañante assignments for a given day+moment.
 * Used when the user toggles off the acompañante section.
 */
export const clearAcompanantesForMoment = async (
  dayId: number,
  momentId: number
): Promise<AcompananteMutationResponse> => {
  try {
    const { error } = await supabase
      .from('menu_acompanantes')
      .delete()
      .match({ day_id: dayId, moment_id: momentId });

    if (error) {
      console.error('Error clearing acompañantes for moment:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error clearing acompañantes for moment:', message);
    return { success: false, error: message };
  }
};
