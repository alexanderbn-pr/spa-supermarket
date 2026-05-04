import { useState, useEffect, useRef } from 'react';
import { BaseLookup } from '@/types/recipes.types';
import {
  fetchTypes,
  fetchDifficulties,
  fetchMealTypes,
  fetchHealthyLevels,
  fetchIngredients,
} from '@/api/get-dictionaries';

export interface DictionaryData {
  types: BaseLookup[];
  difficulties: BaseLookup[];
  mealTypes: BaseLookup[];
  healthyLevels: BaseLookup[];
  ingredients: BaseLookup[];
  isLoading: boolean;
  error: string | null;
}

export function useDictionaries() {
  const [data, setData] = useState<DictionaryData>({
    types: [],
    difficulties: [],
    mealTypes: [],
    healthyLevels: [],
    ingredients: [],
    isLoading: true,
    error: null,
  });

  const requestIdRef = useRef(0);

  const loadData = async () => {
    const requestId = ++requestIdRef.current;

    setData(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [
        types,
        difficulties,
        mealTypes,
        healthyLevels,
        ingredients,
      ] = await Promise.all([
        fetchTypes(),
        fetchDifficulties(),
        fetchMealTypes(),
        fetchHealthyLevels(),
        fetchIngredients(),
      ]);

      // 👇 evita race conditions
      if (requestId !== requestIdRef.current) return;

      setData({
        types,
        difficulties,
        mealTypes,
        healthyLevels,
        ingredients,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      setData(prev => ({
        ...prev,
        isLoading: false,
        error:
          err instanceof Error
            ? err.message
            : 'Error al cargar los diccionarios',
      }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    ...data,
    refetch: loadData,
  };
}