import { supabase } from '@/lib/supabaseClient';

// Cart list row from Supabase
export interface CartListRow {
  id: number;
  ingredient_id: number;
  deleted: boolean;
  quantity: number;
  created_at: string;
  updated_at: string;
  ingredient?: {
    id: number;
    name: string;
    description: string;
  };
}

// Mapped shopping item for UI
export interface CartItem {
  id: number;
  ingredientId: number;
  name: string;
  quantity: number;
  checked: boolean;
}

// Fetch all cart items (not deleted)
export async function fetchCartList(): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('cart_list')
    .select(`
      id,
      ingredient_id,
      deleted,
      quantity,
      ingredient:ingredients (
        id,
        name,
        description
      )
    `)
    .eq('deleted', false)
    .order('ingredient(name)', { ascending: true })
    .returns<CartListRow[]>();

  if (error) {
    console.error('Error fetching cart list:', error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    ingredientId: row.ingredient_id,
    name: row.ingredient?.name ?? '',
    quantity: row.quantity,
    checked: row.deleted,
  }));
}

// Add ingredient to cart (creates new row or increments existing)
export async function addToCart(
  ingredientId: number
): Promise<{ success: boolean; error: string | null }> {
  // Check if item already exists
  const { data: existing, error: fetchError } = await supabase
    .from('cart_list')
    .select('id, quantity')
    .eq('ingredient_id', ingredientId)
    .eq('deleted', false)

    .maybeSingle();

  if (fetchError) {
    console.error('Error checking existing cart item:', fetchError);
    return { success: false, error: fetchError.message };
  }

  if (existing) {
    // Update quantity (increment by 1)
    const { error: updateError } = await supabase
      .from('cart_list')
      .update({ quantity: existing.quantity + 1 })
      .eq('id', existing.id);

    if (updateError) {
      console.error('Error updating cart item:', updateError);
      return { success: false, error: updateError.message };
    }
  } else {
    // Insert new
    const { error: insertError } = await supabase.from('cart_list').insert({
      ingredient_id: ingredientId,
      quantity: 1,
      deleted: false,
    });

    if (insertError) {
      console.error('Error adding to cart:', insertError);
      return { success: false, error: insertError.message };
    }
  }

  return { success: true, error: null };
}

// Add item to cart by name - searches or creates ingredient
export async function addItemToCartByName(
  name: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Search for existing ingredient
    const { data: ingredients } = await supabase
      .from('ingredients')
      .select('id')
      .ilike('name', name.trim())
      .limit(1);

    let ingredientId: number;

    if (ingredients && ingredients.length > 0) {
      ingredientId = ingredients[0].id;
    } else {
      // Create new ingredient
      const { data: newIngredient, error: createError } = await supabase
        .from('ingredients')
        .insert({ name: name.trim() })
        .select('id')
        .single();

      if (createError) {
        return { success: false, error: createError.message };
      }

      ingredientId = newIngredient.id;
    }

    // Now add to cart
    return addToCart(ingredientId);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error adding item to cart:', message);
    return { success: false, error: message };
  }
}

// Add multiple ingredients (aggregates quantities)
export async function addIngredientsToCart(
  ingredients: { id: number; quantity: number }[]
): Promise<{ success: boolean; error: string | null }> {
  if (ingredients.length === 0) {
    return { success: true, error: null };
  }

  // Group by ingredient_id and sum quantities
  const grouped = ingredients.reduce(
    (
      acc: Record<number, number>,
      item
    ) => {
      acc[item.id] = (acc[item.id] ?? 0) + item.quantity;
      return acc;
    },
    {}
  );

  const ingredientIds = Object.keys(grouped).map((id) => parseInt(id, 10));

  // Fetch all existing items in one call
  const { data: existingItems } = await supabase
    .from('cart_list')
    .select('id, ingredient_id, quantity')
    .in('ingredient_id', ingredientIds)
    .eq('deleted', false);

  const existingMap = new Map(
    (existingItems ?? []).map((item) => [item.ingredient_id, item])
  );

  // Build upsert data - merge existing quantities with new ones
  const upsertData = Object.entries(grouped).map(([ingredientId, quantity]) => {
    const id = parseInt(ingredientId, 10);
    const existing = existingMap.get(id);
    const newQuantity = existing ? existing.quantity + quantity : quantity;

    return {
      ingredient_id: id,
      quantity: newQuantity,
      deleted: false,
    };
  });

  // Single upsert call with onConflict
  const { error } = await supabase
    .from('cart_list')
    .upsert(upsertData, {
      onConflict: 'ingredient_id',
      ignoreDuplicates: false,
    });

  if (error) {
    console.error('Error adding ingredients:', error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// Update quantity for a cart item
export async function updateCartQuantity(
  cartId: number,
  quantity: number
): Promise<{ success: boolean; error: string | null }> {
  if (quantity < 1) {
    // If quantity would be 0, delete the item
    return deleteFromCart(cartId);
  }

  const { error } = await supabase
    .from('cart_list')
    .update({ quantity })
    .eq('id', cartId);

  if (error) {
    console.error('Error updating quantity:', error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// Toggle checked status (deleted column)
export async function toggleCartItem(
  cartId: number
): Promise<{ success: boolean; error: string | null }> {
  // Get current status
  const { data, error: fetchError } = await supabase
    .from('cart_list')
    .select('deleted')
    .eq('id', cartId)
    .single();

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  // Toggle
  const { error: updateError } = await supabase
    .from('cart_list')
    .update({ deleted: !data.deleted })
    .eq('id', cartId);

  if (updateError) {
    console.error('Error toggling item:', updateError);
    return { success: false, error: updateError.message };
  }

  return { success: true, error: null };
}

// Delete (mark as deleted) an item from cart
export async function deleteFromCart(
  cartId: number
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase
    .from('cart_list')
    .update({ deleted: true })
    .eq('id', cartId);

  if (error) {
    console.error('Error deleting from cart:', error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// Clear all items from cart (mark all non-deleted items as deleted)
export async function clearCart(): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase
    .from('cart_list')
    .update({ deleted: true })
    .eq('deleted', false);

  if (error) {
    console.error('Error clearing cart:', error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}