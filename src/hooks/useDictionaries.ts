import { useState, useEffect, useRef, useCallback } from 'react';
import { BaseLookup } from '@/types/recipes.types';
import {
  fetchTypes,
  fetchDifficulties,
  fetchMealTypes,
  fetchHealthyLevels,
  fetchIngredients,
} from '@/api/recipe/get-dictionaries';

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

  const loadData = async (showLoading = true) => {
    const requestId = ++requestIdRef.current;

    if (showLoading) {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
    }

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
        isLoading: showLoading ? false : data.isLoading, // preserve loading if was false
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

  // Full refetch (shows loading)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refetch = useCallback(() => loadData(true), []);
  
  // Individual refetch functions - fetch only specific dictionary
  const refetchTypes = useCallback(async () => {
    const types = await fetchTypes();
    setData(prev => ({ ...prev, types }));
  }, []);
  
  const refetchDifficulties = useCallback(async () => {
    const difficulties = await fetchDifficulties();
    setData(prev => ({ ...prev, difficulties }));
  }, []);
  
  const refetchMealTypes = useCallback(async () => {
    const mealTypes = await fetchMealTypes();
    setData(prev => ({ ...prev, mealTypes }));
  }, []);
  
  const refetchHealthyLevels = useCallback(async () => {
    const healthyLevels = await fetchHealthyLevels();
    setData(prev => ({ ...prev, healthyLevels }));
  }, []);
  
  const refetchIngredients = useCallback(async () => {
    const ingredients = await fetchIngredients();
    setData(prev => ({ ...prev, ingredients }));
  }, []);

  useEffect(() => {
    loadData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...data,
    refetch,
    refetchTypes,
    refetchDifficulties,
    refetchMealTypes,
    refetchHealthyLevels,
    refetchIngredients,
  };
}