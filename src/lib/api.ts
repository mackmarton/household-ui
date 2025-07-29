import axios from 'axios';
import {
  RecipeDTO,
  RecipesResponse,
  ItemDTO,
  ItemsResponse,
  DishwashingDTO,
  DishwashingResponse,
  WhoseTurnResponse,
  RecipeIngredientDTO
} from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

// Debug logging to see what URL is being used
console.log('🔍 API Debug Info:');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('BASE_URL:', BASE_URL);
console.log('All env vars:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC')));

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log API requests for debugging
api.interceptors.request.use(request => {
  console.log('🚀 API Request:', request.method?.toUpperCase(), request.url);
  console.log('🔗 Full URL:', `${request.baseURL}${request.url}`);
  return request;
});


// Recipe API
export const recipeApi = {
  getAllRecipes: (): Promise<RecipesResponse> =>
    api.get('/recipes').then(res => res.data),

  getRecipeById: (id: number): Promise<RecipeDTO> =>
    api.get(`/recipes/${id}`).then(res => res.data),

  getRecipeIngredients: (recipeId: number): Promise<RecipeIngredientDTO[]> =>
    api.get(`/recipeingredients/${recipeId}`).then(res => res.data),

  updateRecipeIngredient: (id: number, ingredient: RecipeIngredientDTO): Promise<RecipeIngredientDTO> =>
    api.put(`/recipeingredients/${id}`, ingredient).then(res => res.data),

  createRecipeIngredient: (ingredient: Omit<RecipeIngredientDTO, 'id'>): Promise<RecipeIngredientDTO> =>
    api.post('/recipeingredients', ingredient).then(res => res.data),

  deleteRecipeIngredient: (id: number): Promise<void> =>
    api.delete(`/recipeingredients/${id}`).then(() => undefined),

  createRecipe: (recipe: Omit<RecipeDTO, 'id'>): Promise<RecipeDTO> =>
    api.post('/recipes', recipe).then(res => res.data),

  updateRecipe: (id: number, recipe: RecipeDTO): Promise<RecipeDTO> =>
    api.put(`/recipes/${id}`, recipe).then(res => res.data),

  deleteRecipe: (id: number): Promise<void> =>
    api.delete(`/recipes/${id}`).then(() => undefined),
};

// Item API
export const itemApi = {
  getAllItems: (): Promise<ItemsResponse> =>
    api.get('/items').then(res => res.data),

  getItemById: (id: number): Promise<ItemDTO> =>
    api.get(`/items/${id}`).then(res => res.data),

  createItem: (item: Omit<ItemDTO, 'id'>): Promise<ItemDTO> =>
    api.post('/items', item).then(res => res.data),

  updateItem: (id: number, item: ItemDTO): Promise<ItemDTO> =>
    api.put(`/items/${id}`, item).then(res => res.data),

  deleteItem: (id: number): Promise<void> =>
    api.delete(`/items/${id}`).then(() => undefined),
};

// Dishwashing API
export const dishwashingApi = {
  getAllDishwashingEvents: (): Promise<DishwashingResponse> =>
    api.get('/dishwashing').then(res => res.data),

  getWhoseTurnItIs: (): Promise<WhoseTurnResponse> =>
    api.get('/dishwashing/turn').then(res => res.data),

  addDishwashingForMarci: (): Promise<DishwashingDTO> =>
    api.post('/dishwashing/marci').then(res => res.data),

  addDishwashingForReka: (): Promise<DishwashingDTO> =>
    api.post('/dishwashing/reka').then(res => res.data),
};

export default api;
