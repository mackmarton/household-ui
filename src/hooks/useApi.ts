import { useState, useEffect, useCallback } from 'react';
import { recipeApi, itemApi, dishwashingApi } from '@/lib/api';
import { RecipeDTO, ItemDTO, DishwashingDTO, RecipeIngredientDTO } from '@/types/api';

// Hook for fetching all recipes
export const useRecipes = () => {
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipeApi.getAllRecipes();
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return { recipes, loading, error, refetch: fetchRecipes };
};

// Hook for fetching a single recipe
export const useRecipe = (id: number | null) => {
  const [recipe, setRecipe] = useState<RecipeDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await recipeApi.getRecipeById(id);
        setRecipe(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch recipe');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  return { recipe, loading, error };
};

// Hook for fetching recipe ingredients separately
export const useRecipeIngredients = (recipeId: number | null) => {
  const [ingredients, setIngredients] = useState<RecipeIngredientDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIngredients = useCallback(async () => {
    if (!recipeId) return;

    try {
      setLoading(true);
      const data = await recipeApi.getRecipeIngredients(recipeId);
      setIngredients(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch recipe ingredients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  return { ingredients, loading, error, refetch: fetchIngredients };
};

// Hook for fetching recipe with ingredients combined
export const useRecipeWithIngredients = (id: number | null) => {
  const { recipe, loading: recipeLoading, error: recipeError } = useRecipe(id);
  const { ingredients, loading: ingredientsLoading, error: ingredientsError, refetch: refetchIngredients } = useRecipeIngredients(id);

  const loading = recipeLoading || ingredientsLoading;
  const error = recipeError || ingredientsError;

  return { recipe, ingredients, loading, error, refetchIngredients };
};

// Hook for fetching all items
export const useItems = () => {
  const [items, setItems] = useState<ItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemApi.getAllItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const updateItem = async (item: ItemDTO) => {
    try {
      if (item.id) {
        await itemApi.updateItem(item.id, item);
        await fetchItems(); // Refresh the list
      }
    } catch (err) {
      setError('Failed to update item');
      console.error(err);
    }
  };

  return { items, loading, error, refetch: fetchItems, updateItem };
};

// Hook for dishwashing functionality
export const useDishwashing = () => {
  const [events, setEvents] = useState<DishwashingDTO[]>([]);
  const [whoseTurn, setWhoseTurn] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsData, turnData] = await Promise.all([
        dishwashingApi.getAllDishwashingEvents(),
        dishwashingApi.getWhoseTurnItIs()
      ]);
      setEvents(eventsData);
      setWhoseTurn(turnData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dishwashing data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addDishwashingForMarci = async () => {
    try {
      await dishwashingApi.addDishwashingForMarci();
      await fetchData(); // Refresh data
    } catch (err) {
      setError('Failed to add dishwashing event for Marci');
      console.error(err);
    }
  };

  const addDishwashingForReka = async () => {
    try {
      await dishwashingApi.addDishwashingForReka();
      await fetchData(); // Refresh data
    } catch (err) {
      setError('Failed to add dishwashing event for Reka');
      console.error(err);
    }
  };

  return {
    events,
    whoseTurn,
    loading,
    error,
    addDishwashingForMarci,
    addDishwashingForReka,
    refetch: fetchData
  };
};
