import { fetchRecipes } from '@/api/recipe/get-recipes';
import { fetchMenu } from '@/api/menu/get-menus';
import WeeklyCalendar from '@/components/Menu/WeeklyCalendar';
import { DAYS } from '@/types/menuApi.types';
import { Recipe } from '@/types/recipes.types';

// Build initial menu from server data
function buildInitialMenu(
  recipes: Recipe[],
  menuData: { day_id: number; moment_id: number; recipe_id: number }[]
) {
  const menuMap: Record<
    number,
    { comida: Recipe | null; cena: Recipe | null }
  > = {};

  DAYS.forEach((_, index) => {
    menuMap[index + 1] = { comida: null, cena: null };
  });

  menuData.forEach(({ day_id, moment_id, recipe_id }) => {
    const recipe = recipes.find((r) => r.id === recipe_id) || null;
    if (moment_id === 1 && menuMap[day_id]) {
      menuMap[day_id].comida = recipe;
    } else if (moment_id === 2 && menuMap[day_id]) {
      menuMap[day_id].cena = recipe;
    }
  });

  return DAYS.map((dayConfig, index) => ({
    day: dayConfig.name,
    dayLabel: dayConfig.label,
    comida: menuMap[index + 1]?.comida ?? null,
    cena: menuMap[index + 1]?.cena ?? null,
  }));
}

export default async function MenuPage() {
  const [recipes, menuResponse] = await Promise.all([
    fetchRecipes(),
    fetchMenu(),
  ]);

  const initialMenu = buildInitialMenu(recipes, menuResponse.data);

  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col items-center bg-[#f5f5f7] py-6 px-4">
      <h2 className="mb-8 text-[40px] font-semibold text-[#1d1d1f]">
        Menú semanal
      </h2>
      <div className="w-full max-w-sm">
        <WeeklyCalendar initialRecipes={recipes} initialMenu={initialMenu} />
      </div>
    </div>
  );
}