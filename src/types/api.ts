// Generated types from Swagger/OpenAPI specification

export interface ItemDTO {
  id?: number;
  name: string;
  isOnShoppingList: boolean;
}

export interface RecipeIngredientDTO {
  id?: number;
  recipeId: number;
  ingredientId: number;
  weight: string;
  isAvailable: boolean;
}

export interface RecipeDTO {
  id?: number;
  name: string;
  description: string;
}

export interface DishwashingDTO {
  id?: number;
  time: string; // ISO date-time string
  name: string;
}

// API Response types
export type RecipesResponse = RecipeDTO[];
export type ItemsResponse = ItemDTO[];
export type DishwashingResponse = DishwashingDTO[];
export type WhoseTurnResponse = string;

// API Error type
export interface ApiError {
  message: string;
  status: number;
}
