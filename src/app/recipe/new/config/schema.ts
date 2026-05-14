import { z } from 'zod';

export const ingredientSchema = z.object({
  id: z.number(),
  quantity: z.string().min(1, 'Indica la cantidad'),
});

// Schema unificado - usa number para IDs (coincide con lo que viene de Supabase)
export const recipeSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  url: z.string().url('Debe ser una URL válida').or(z.string().length(0)),
  type_id: z.number().min(1, 'Selecciona un tipo'),
  difficulty_id: z.number().min(1, 'Selecciona una dificultad'),
  meal_type_id: z.number().min(1, 'Selecciona un tipo de comida'),
  healthy_level_id: z.number().min(1, 'Selecciona un nivel saludable'),
  ingredient_ids: z.array(ingredientSchema).min(1, 'Selecciona al menos un ingrediente'),
});

export type RecipeFormData = z.infer<typeof recipeSchema>;
