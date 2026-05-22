import { supabase } from '@/lib/supabaseClient';
import { MenuRow, FetchMenuResponse } from '@/types/menuApi.types';

export const fetchMenu = async (): Promise<FetchMenuResponse> => {
  try {
    const { data, error } = await supabase
      .from('menus')
      .select(`
      id,
      day_id,
      recipe_id,
      moment_id,
      day:days (id, name, description)
    `)
      .returns<MenuRow[]>();

    if (error) {
      console.error('Error fetching menu:', error);
      return { data: [], error: error.message };
    }
    console.log('[menu-debug] fetchMenu raw:', data);
    return { data: data ?? [], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error fetching menu:', message);
    return { data: [], error: message };
  }
};