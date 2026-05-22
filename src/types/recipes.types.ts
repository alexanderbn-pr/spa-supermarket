export interface Recipe {
  id: number;
  url: string;
  name: string;
  description: string;
  ingredients?: Ingredient[];
  type: Type;
  difficulty: Difficulty;
  mealType: MealType;
  healthyLevel: HealthyLevel;
  favourite?: boolean;
  comodin?: boolean;
}

export interface BaseLookup {
  id: number;
  name: string;
  description: string;
}

export type Type = BaseLookup;
export type Difficulty = BaseLookup;
export type MealType = BaseLookup;
export type HealthyLevel = BaseLookup;

export interface Ingredient {
  id: number;
  name: string;
  description: string;
  quantity: string;
}


export interface RecipeRow {
  id: number;
  url: string;
  name: string;
  description: string;
  type: Type;
  difficulty: Difficulty;
  meal_type: MealType;
  healthy_level: HealthyLevel;
  favourite?: boolean;
  comodin?: boolean;
}

export interface RecipeFilters {
  search?: string;
  types?: number[];
  difficulties?: number[];
  mealTypes?: number[];
  healthyLevels?: number[];
  favourite?: boolean;
}