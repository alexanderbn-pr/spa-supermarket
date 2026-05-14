'use client';

import { useState } from 'react';
import { DayName } from '@/types/menuApi.types';
import DayCard from './DayCard';
import RecipeBottomSheet from './RecipeBottomSheet';
import { useBodyLock } from '@/hooks/useBodyLock';
import type { DayListProps } from '../../types/menu.types';

export default function DayList({
  weekMenu,
  getComidaOptions,
  getCenaOptions,
  onComidaChange,
  onCenaChange,
}: DayListProps) {
  const [sheetState, setSheetState] = useState<{
    isOpen: boolean;
    day: DayName | null;
    mealType: 'comida' | 'cena' | null;
  }>({ isOpen: false, day: null, mealType: null });

  // Lock body scroll when sheet is open
  useBodyLock(sheetState.isOpen);

  const openSheet = (day: DayName, mealType: 'comida' | 'cena') => {
    setSheetState({ isOpen: true, day, mealType });
  };

  const closeSheet = () => {
    setSheetState({ isOpen: false, day: null, mealType: null });
  };

  const currentOptions =
    sheetState.day && sheetState.mealType
      ? sheetState.mealType === 'comida'
        ? getComidaOptions(sheetState.day)
        : getCenaOptions(sheetState.day)
      : [];

  const currentDayMenu = sheetState.day
    ? weekMenu.find((d) => d.day === sheetState.day)
    : null;

  const currentSelectedValue =
    currentDayMenu && sheetState.mealType
      ? sheetState.mealType === 'comida'
        ? currentDayMenu.comida?.id ?? null
        : currentDayMenu.cena?.id ?? null
      : null;

  const currentDayLabel = sheetState.day
    ? weekMenu.find((d) => d.day === sheetState.day)?.dayLabel ?? ''
    : '';

  const handleSelect = (recipeId: number | null) => {
    if (sheetState.day && sheetState.mealType) {
      const changeHandler =
        sheetState.mealType === 'comida'
          ? onComidaChange(sheetState.day)
          : onCenaChange(sheetState.day);
      changeHandler(recipeId);
    }
    closeSheet();
  };

  return (
    <>
      <div className="grid gap-4 w-full" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {weekMenu.map((dayMenu, index) => {
          const day = dayMenu.day;
          const dayLabel = dayMenu.dayLabel;

          return (
            <DayCard
              key={day}
              dayLabel={dayLabel}
              comida={dayMenu.comida}
              cena={dayMenu.cena}
              comidaOptions={getComidaOptions(day)}
              cenaOptions={getCenaOptions(day)}
              onComidaClick={() => openSheet(day, 'comida')}
              onCenaClick={() => openSheet(day, 'cena')}
              animationDelay={index * 50}
            />
          );
        })}
      </div>

      <RecipeBottomSheet
        isOpen={sheetState.isOpen}
        onClose={closeSheet}
        options={currentOptions}
        selectedValue={currentSelectedValue}
        onSelect={handleSelect}
        dayLabel={currentDayLabel}
        mealType={sheetState.mealType ?? 'comida'}
      />
    </>
  );
}