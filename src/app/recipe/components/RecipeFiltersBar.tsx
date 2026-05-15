'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useRef, useEffect } from 'react';
import SearchInput from './SearchInput';
import TypeMultiSelect from './TypeMultiSelect';
import DifficultyMultiSelect from './DifficultyMultiSelect';
import MealTypeMultiSelect from './MealTypeMultiSelect';
import HealthyLevelMultiSelect from './HealthyLevelMultiSelect';
import FavoriteCheckbox from './FavoriteCheckbox';
import { BaseLookup } from '@/types/recipes.types';

interface Dictionaries {
  types: BaseLookup[];
  difficulties: BaseLookup[];
  mealTypes: BaseLookup[];
  healthyLevels: BaseLookup[];
}

export default function RecipeFiltersBar({ dictionaries }: { dictionaries: Dictionaries }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Ref to store the latest update function - avoids re-render dependency
  const updateFnRef = useRef<((key: string, value: string | null) => void) | null>(null);

  const updateParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const newUrl = `?${params.toString()}`;
    // Use replace to avoid adding to history stack for filter changes
    router.replace(newUrl, { scroll: false });
  }, [searchParams, router]);

  // Keep ref updated with latest function
  useEffect(() => {
    updateFnRef.current = updateParam;
  }, [updateParam]);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateMultiParam = useCallback(
    (key: string, ids: number[]) => {
      // Clear any pending debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Debounce the update by 300ms
      debounceTimeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (ids.length === 0) {
          params.delete(key);
        } else {
          params.set(key, ids.join(','));
        }
        router.replace(`?${params.toString()}`, { scroll: false });
      }, 300);
    },
    [searchParams, router]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const parseMultiParam = (key: string): number[] => {
    const value = searchParams.get(key);
    if (!value) return [];
    return value.split(',').map(Number).filter((n) => !isNaN(n));
  };

  const handleFavoriteToggle = useCallback(
    (checked: boolean) => {
      updateParam('favourite', checked ? 'true' : null);
    },
    [updateParam]
  );

  const handleSearch = useCallback((value: string) => {
    updateParam('search', value || null);
  }, [updateParam]);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
      <SearchInput
        initialValue={searchParams.get('search') ?? ''}
        onSearch={handleSearch}
      />
      <TypeMultiSelect
        options={dictionaries.types}
        selected={parseMultiParam('types')}
        onChange={(ids) => updateMultiParam('types', ids)}
        label="Tipo"
      />
      <DifficultyMultiSelect
        options={dictionaries.difficulties}
        selected={parseMultiParam('difficulties')}
        onChange={(ids) => updateMultiParam('difficulties', ids)}
        label="Tiempo de elaboración"
      />
      <MealTypeMultiSelect
        options={dictionaries.mealTypes}
        selected={parseMultiParam('mealTypes')}
        onChange={(ids) => updateMultiParam('mealTypes', ids)}
        label="Comida"
      />
      <HealthyLevelMultiSelect
        options={dictionaries.healthyLevels}
        selected={parseMultiParam('healthyLevels')}
        onChange={(ids) => updateMultiParam('healthyLevels', ids)}
        label="Saludable"
      />
      <FavoriteCheckbox
        checked={searchParams.get('favourite') === 'true'}
        onChange={handleFavoriteToggle}
      />
    </div>
  );
}