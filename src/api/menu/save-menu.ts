import { supabase } from '@/lib/supabaseClient';
import { SaveMenuItemRequest, SaveMenuItemResponse } from '@/types/menuApi.types';

export const saveMenuItem = async (
  request: SaveMenuItemRequest
): Promise<SaveMenuItemResponse> => {
  try {
    if (request.recipeId === null) {
      // Clear selection - UPDATE recipe_id to null (do NOT delete)
      const { error } = await supabase
        .from('menus')
        .update({ recipe_id: null })
        .match({
          day_id: request.dayId,
          moment_id: request.momentId,
        });

      if (error) {
        console.error('Error clearing menu item:', error);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    }

    // Check if row exists for this day_id + moment_id
    const { data: existing, error: fetchError } = await supabase
      .from('menus')
      .select('id')
      .match({
        day_id: request.dayId,
        moment_id: request.momentId,
      })
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking existing menu item:', fetchError);
      return { success: false, error: fetchError.message };
    }

    // Upsert: update if exists, insert if not
    const payload = {
      day_id: request.dayId,
      moment_id: request.momentId,
      recipe_id: request.recipeId,
    };

    const { error } = existing
      ? await supabase.from('menus').update(payload).match({
          day_id: request.dayId,
          moment_id: request.momentId,
        })
      : await supabase.from('menus').insert(payload);

    if (error) {
      console.error('Error saving menu item:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error saving menu item:', message);
    return { success: false, error: message };
  }
};