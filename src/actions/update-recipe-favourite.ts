'use server'

import { supabase } from '@/lib/supabaseClient'

export async function updateRecipeFavourite(
  recipeId: number,
  favourite: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('recipes')
      .update({ favourite })
      .eq('id', recipeId)

    if (error) {
      console.error('Error updating favourite:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Exception updating favourite:', message)
    return { success: false, error: message }
  }
}