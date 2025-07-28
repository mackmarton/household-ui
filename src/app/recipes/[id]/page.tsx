'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRecipeWithIngredients, useItems } from '@/hooks/useApi';
import { recipeApi } from '@/lib/api';
import { ArrowLeft, Edit, ShoppingCart, Check } from 'lucide-react';
import Link from 'next/link';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id ? parseInt(params.id as string) : null;

  const { recipe, ingredients, loading: recipeLoading, error: recipeError, refetchIngredients } = useRecipeWithIngredients(recipeId);
  const { items, updateItem } = useItems();

  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [updatingAvailability, setUpdatingAvailability] = useState<Set<number>>(new Set());

  const handleAvailabilityToggle = async (ingredientId: number, currentAvailability: boolean) => {
    if (!recipe || !ingredients) return;

    // Add visual feedback during update
    setUpdatingAvailability(prev => new Set(prev).add(ingredientId));

    try {
      // Find the specific recipe ingredient to update
      const recipeIngredientToUpdate = ingredients.find(ri => ri.ingredientId === ingredientId);
      if (!recipeIngredientToUpdate) {
        console.error('Recipe ingredient not found for ingredientId:', ingredientId);
        return;
      }

      // Update the recipe ingredient via the new PUT API
      await recipeApi.updateRecipeIngredient(recipeIngredientToUpdate.id!, {
        ...recipeIngredientToUpdate,
        isAvailable: !currentAvailability
      });

      // Refresh the ingredients to get the updated state
      await refetchIngredients();

    } catch (error) {
      console.error('Failed to update ingredient availability:', error);
    } finally {
      setUpdatingAvailability(prev => {
        const newSet = new Set(prev);
        newSet.delete(ingredientId);
        return newSet;
      });
    }
  };

  const handleAddToShoppingCart = async (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      await updateItem({
        ...item,
        isOnShoppingList: true
      });
    } catch (error) {
      console.error('Failed to add item to shopping cart:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  if (recipeLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recipeError || !recipe) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{recipeError || 'Recipe not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <Link
          href={`/recipes/${recipe.id}/edit`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Edit size={24} className="text-gray-600" />
        </Link>
      </div>

      {/* Recipe Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {recipe.name}
      </h1>

      {/* Recipe Description */}
      {recipe.description && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Leírás</h2>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {recipe.description}
          </div>
        </div>
      )}

      {/* Ingredients Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hozzávalók</h2>

        {!ingredients || ingredients.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Még nincsenek hozzávalók</p>
        ) : (
          <div className="space-y-3">
            {ingredients.map((recipeIngredient, index) => {
              // Find the item by ingredientId
              const item = items.find(i => i.id === recipeIngredient.ingredientId);
              if (!item) {
                console.warn('Item not found for ingredientId:', recipeIngredient.ingredientId);
                return null;
              }

              const isOnShoppingList = item.isOnShoppingList;
              const isUpdating = updatingItems.has(item.id || 0);
              const isUpdatingAvailability = updatingAvailability.has(item.id || 0);

              return (
                <div
                  key={recipeIngredient.id || index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {/* Availability Checkbox */}
                    <button
                      onClick={() => handleAvailabilityToggle(item.id || 0, recipeIngredient.isAvailable)}
                      disabled={isUpdatingAvailability}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors disabled:opacity-50 ${
                        recipeIngredient.isAvailable
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {isUpdatingAvailability ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        recipeIngredient.isAvailable && <Check size={16} />
                      )}
                    </button>

                    <span className={`flex-1 ${
                      recipeIngredient.isAvailable ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {item.name}
                      {recipeIngredient.weight && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({recipeIngredient.weight})
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Add to Shopping Cart Button */}
                  {!isOnShoppingList && (
                    <button
                      onClick={() => handleAddToShoppingCart(item.id || 0)}
                      disabled={isUpdating}
                      className="ml-3 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Hozzáadás a bevásárló listához"
                    >
                      {isUpdating ? (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <ShoppingCart size={20} />
                      )}
                    </button>
                  )}

                  {isOnShoppingList && (
                    <div className="ml-3 p-2 text-green-600" title="Már a bevásárló listán van">
                      <Check size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
