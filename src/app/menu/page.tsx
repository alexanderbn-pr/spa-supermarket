import { fetchRecipes } from '@/api/recipe/get-recipes';
import { fetchMenu } from '@/api/menu/get-menus';
import { fetchAcompanantes } from '@/api/menu/acompanantes';
import WeeklyCalendar from '@/components/Menu/WeeklyCalendar';
import { DAYS, AcompananteRow } from '@/types/menuApi.types';
import { Recipe } from '@/types/recipes.types';

// Force dynamic rendering to fetch fresh data from Supabase on each request
// Without this, Next.js statically pre-renders the page at build time when
// Supabase is unavailable, resulting in an empty menu.
export const dynamic = 'force-dynamic';

// Build initial menu from server data
function buildInitialMenu(
  recipes: Recipe[],
  menuData: { day_id: number; moment_id: number; recipe_id: number }[],
  acompanantesData: AcompananteRow[] = []
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

  // Build acompañante map: day_id -> { comida: Recipe[], cena: Recipe[] }
  const acompananteMap: Record<
    number,
    { comida: Recipe[]; cena: Recipe[] }
  > = {};

  acompanantesData.forEach(({ day_id, moment_id, recipe_id }) => {
    const recipe = recipes.find((r) => r.id === recipe_id);
    if (!recipe) return;

    if (!acompananteMap[day_id]) {
      acompananteMap[day_id] = { comida: [], cena: [] };
    }

    if (moment_id === 1) {
      acompananteMap[day_id].comida.push(recipe);
    } else if (moment_id === 2) {
      acompananteMap[day_id].cena.push(recipe);
    }
  });

  return DAYS.map((dayConfig, index) => {
    const dayAcompanantes = acompananteMap[index + 1];

    return {
      day: dayConfig.name,
      dayLabel: dayConfig.label,
      comida: menuMap[index + 1]?.comida ?? null,
      cena: menuMap[index + 1]?.cena ?? null,
      acompananteEnabled: {
        comida: (dayAcompanantes?.comida.length ?? 0) > 0,
        cena: (dayAcompanantes?.cena.length ?? 0) > 0,
      },
      acompanantes: dayAcompanantes ?? { comida: [], cena: [] },
    };
  });
}

export default async function MenuPage() {
  const [recipes, menuResponse, acompanantesResponse] = await Promise.all([
    fetchRecipes(),
    fetchMenu(),
    fetchAcompanantes(),
  ]);

  const initialMenu = buildInitialMenu(recipes, menuResponse.data, acompanantesResponse.data);

  // Serialization safety net: ensure data is plain JSON before passing to client
  const serializedInitialMenu = JSON.parse(JSON.stringify(initialMenu));

  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col items-center bg-[#f5f5f7] py-6 px-4">
      <h2 className="mb-8 text-[40px] font-semibold text-[#1d1d1f]">
        Menú semanal
      </h2>
      <div className="w-full">
        <WeeklyCalendar initialRecipes={recipes} initialMenu={serializedInitialMenu} />
      </div>
    </div>
  );
}