'use client';

import MultiSelect from '@/components/ui/MultiSelect';
import { Recipe } from '@/types/recipes.types';
import { Moment } from '@/types/menuApi.types';

export interface AcompananteSelectorProps {
  moment: Moment;
  enabled: boolean;
  selectedRecipes: Recipe[];
  acompananteOptions: Recipe[];
  onToggle: (moment: Moment) => void;
  onChange: (moment: Moment, recipeIds: number[]) => void;
}

export default function AcompananteSelector({
  moment,
  enabled,
  selectedRecipes,
  acompananteOptions,
  onToggle,
  onChange,
}: AcompananteSelectorProps) {
  const selectedIds = selectedRecipes.map((r) => r.id);

  return (
    <div className="mt-2">
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => onToggle(moment)}
          className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
        />
        <span className="text-sm text-gray-600">Acompañante</span>
      </label>

      {enabled && (
        <div className="ml-6 mt-2">
          <MultiSelect
            options={acompananteOptions}
            selected={selectedIds}
            onChange={(ids) => onChange(moment, ids)}
            label="Seleccionar acompañantes"
          />
        </div>
      )}
    </div>
  );
}
