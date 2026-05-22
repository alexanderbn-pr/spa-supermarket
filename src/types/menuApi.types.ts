import { Recipe } from '@/types/recipes.types';

// Day identifier - keys match the days table in Supabase
export type DayName =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// Meal moment - keys match the moments table in Supabase
export type Moment = 'comida' | 'cena';

// Day record from Supabase (referenced by foreign key)
export interface Day {
  id: number;
  name: DayName;
  description: string;
}

// Moment record from Supabase (referenced by foreign key)
export interface MomentType {
  id: number;
  name: Moment;
}

// Single menu item stored in Supabase
export interface MenuRow {
  id: number;
  day_id: number;
  day: Day;
  moment_id: number;
  recipe_id: number;
}

// Combined day+recipe for local state
export interface DayMenu {
  day: DayName;
  dayLabel: string;
  comida: Recipe | null;
  cena: Recipe | null;
}

// Full week menu
export type WeekMenu = DayMenu[];

// Option for dropdown selector
export interface SelectorOption {
  value: number;
  label: string;
  disabled: boolean;
}

// API response types
export interface FetchMenuResponse {
  data: MenuRow[];
  error: string | null;
}

export interface SaveMenuItemRequest {
  dayId: number;
  momentId: number;
  recipeId: number | null; // null = clear selection
}

export interface SaveMenuItemResponse {
  success: boolean;
  error: string | null;
}

// Days configuration
export const DAYS: { name: DayName; label: string }[] = [
  { name: 'monday', label: 'Lunes' },
  { name: 'tuesday', label: 'Martes' },
  { name: 'wednesday', label: 'Miércoles' },
  { name: 'thursday', label: 'Jueves' },
  { name: 'friday', label: 'Viernes' },
  { name: 'saturday', label: 'Sábado' },
  { name: 'sunday', label: 'Domingo' },
];

// Day name to ID mapping (matches days table in Supabase)
export const DAY_ID_MAP: Record<DayName, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

// Moment name to ID mapping (matches moments table in Supabase)
export const MOMENT_ID_MAP: Record<Moment, number> = {
  comida: 1,
  cena: 2,
};