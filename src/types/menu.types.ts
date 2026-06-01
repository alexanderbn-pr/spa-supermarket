import { Recipe } from '@/types/recipes.types';
import { DayName, DayMenu, SelectorOption } from '@/types/menuApi.types';

// DayList - scroll container
export interface DayListProps {
  weekMenu: DayMenu[];
  getComidaOptions: (day: DayName) => SelectorOption[];
  getCenaOptions: (day: DayName) => SelectorOption[];
  onComidaChange: (day: DayName) => (recipeId: number | null) => void;
  onCenaChange: (day: DayName) => (recipeId: number | null) => void;
  // Acompañante support — optionally wired by parent
  onToggleAcompanante?: (day: DayName, moment: 'comida' | 'cena') => void;
  onAcompananteChange?: (day: DayName, moment: 'comida' | 'cena', recipeIds: number[]) => void;
  acompananteRecipes?: Recipe[];
}

// DayCard - per day card
export interface DayCardProps {
  dayLabel: string;
  comida: Recipe | null;
  cena: Recipe | null;
  comidaOptions: SelectorOption[];
  cenaOptions: SelectorOption[];
  onComidaClick: () => void;
  onCenaClick: () => void;
  // Acompañante support — optionally wired by parent
  acompananteEnabled?: Record<'comida' | 'cena', boolean>;
  acompanantes?: Record<'comida' | 'cena', Recipe[]>;
  acompananteRecipes?: Recipe[];
  onToggleAcompanante?: (moment: 'comida' | 'cena') => void;
  onAcompananteChange?: (moment: 'comida' | 'cena', recipeIds: number[]) => void;
}

// MealButton - tap-friendly button
export interface MealButtonProps {
  label: string;
  recipe: Recipe | null;
  onClick: () => void;
}

// RecipeBottomSheet - modal
export interface RecipeBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  options: SelectorOption[];
  selectedValue: number | null;
  onSelect: (recipeId: number | null) => void;
  dayLabel: string;
  mealType: 'comida' | 'cena';
}

// RecipeItem - row in bottom sheet
export interface RecipeItemProps {
  label: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}