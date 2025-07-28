'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRecipeWithIngredients, useItems } from '@/hooks/useApi';
import { recipeApi } from '@/lib/api';
import { RecipeDTO, ItemDTO } from '@/types/api';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';

interface RecipeFormData {
  name: string;
  description: string;
  ingredients: Array<{
    ingredientId: number;
    ingredientName: string;
    weight: string;
    isAvailable: boolean;
  }>;
}

export default function AddEditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const isEdit = params.id !== 'add';
  const recipeId = isEdit ? parseInt(params.id as string) : null;

  const { recipe, ingredients, loading: recipeLoading } = useRecipeWithIngredients(recipeId);
  const { items, loading: itemsLoading } = useItems();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<RecipeFormData>({
    defaultValues: {
      name: '',
      description: '',
      ingredients: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients'
  });

  // Load recipe data for editing
  useEffect(() => {
    if (isEdit && recipe && !recipeLoading) {
      setValue('name', recipe.name);
      setValue('description', recipe.description);
    }
  }, [isEdit, recipe, recipeLoading, setValue]);

  // Load ingredients data for editing
  useEffect(() => {
    if (isEdit && ingredients && ingredients.length > 0 && items.length > 0) {
      const formIngredients = ingredients.map(ri => {
        const item = items.find(item => item.id === ri.ingredientId);
        return {
          ingredientId: ri.ingredientId,
          ingredientName: item?.name || '',
          weight: ri.weight || '',
          isAvailable: ri.isAvailable
        };
      });
      setValue('ingredients', formIngredients);
      // Populate the form fields array
      formIngredients.forEach(() => {
        append({
          ingredientId: 0,
          ingredientName: '',
          weight: '',
          isAvailable: false
        });
      });
      // Clear the appended fields and set the actual data
      remove(); // Clear all
      formIngredients.forEach(ing => {
        append(ing);
      });
    }
  }, [isEdit, ingredients, items, setValue, append, remove]);

  const onSubmit = async (data: RecipeFormData) => {
    setSaving(true);
    setError(null);

    try {
      // First, create or update the recipe (only name and description)
      const recipeData: Omit<RecipeDTO, 'id'> = {
        name: data.name,
        description: data.description
      };

      let savedRecipe: RecipeDTO;
      if (isEdit && recipeId) {
        savedRecipe = await recipeApi.updateRecipe(recipeId, { id: recipeId, ...recipeData });
      } else {
        savedRecipe = await recipeApi.createRecipe(recipeData);
      }

      // If we have ingredients to save and a recipe ID
      if (data.ingredients.length > 0 && savedRecipe.id) {
        // For editing: we would need to handle updating existing ingredients vs adding new ones
        // For now, let's just handle the creation case for new recipes
        if (!isEdit) {
          // Create each ingredient separately
          for (const ingredient of data.ingredients) {
            if (ingredient.ingredientId > 0) { // Only create if an actual item was selected
              await recipeApi.createRecipeIngredient({
                recipeId: savedRecipe.id,
                ingredientId: ingredient.ingredientId,
                weight: ingredient.weight,
                isAvailable: ingredient.isAvailable
              });
            }
          }
        }
      }

      router.push('/recipes');
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} recipe`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addIngredient = () => {
    append({
      ingredientId: 0,
      ingredientName: '',
      weight: '',
      isAvailable: false
    });
  };

  const selectExistingItem = (index: number, item: ItemDTO) => {
    setValue(`ingredients.${index}.ingredientId`, item.id || 0);
    setValue(`ingredients.${index}.ingredientName`, item.name);
  };

  if (recipeLoading || itemsLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
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
        <h1 className="text-xl font-bold text-gray-900">
          {isEdit ? 'Recept szerkesztése' : 'Recept hozzáadása'}
        </h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Recipe Name */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Recept neve
          </label>
          <input
            {...register('name', {
              required: 'A recept neve kötelező'
            })}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add meg a recept nevét"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Recipe Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Recept leírása
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add meg a recept leírását vagy főzési útmutatót"
          />
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Hozzávalók</h2>
            <button
              type="button"
              onClick={addIngredient}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          {fields.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Még nincsenek hozzávalók</p>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{index + 1}. hozzávaló</h3>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Ingredient Name */}
                    <div>
                      <input
                        {...register(`ingredients.${index}.ingredientName`, {
                          required: 'Ingredient name is required'
                        })}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Hozzávaló neve"
                      />
                    </div>

                    {/* Quick Select from Existing Items */}
                    {items.length > 0 && (
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Vagy válassz meglévő terméket:
                        </label>
                        <select
                          onChange={(e) => {
                            const selectedItem = items.find(item => item.id === parseInt(e.target.value));
                            if (selectedItem) {
                              selectExistingItem(index, selectedItem);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Válassz egy meglévő terméket...</option>
                          {items.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Ingredient Weight */}
                    <div>
                      <label htmlFor={`ingredients.${index}.weight`} className="block text-sm font-medium text-gray-700 mb-2">
                        Mennyiség
                      </label>
                      <input
                        {...register(`ingredients.${index}.weight`, {
                          required: 'A mennyiség megadása kötelező'
                        })}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="pl. 200g, 1 csésze, 2 evőkanál"
                      />
                      {errors.ingredients?.[index]?.weight && (
                        <p className="mt-2 text-sm text-red-600">{errors.ingredients[index].weight.message}</p>
                      )}
                    </div>

                    {/* Available Checkbox */}
                    <div className="flex items-center">
                      <input
                        {...register(`ingredients.${index}.isAvailable`)}
                        type="checkbox"
                        id={`available-${index}`}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`available-${index}`} className="ml-2 text-sm text-gray-700">
                        Jelenleg elérhető
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : (
            <Save size={20} className="mr-2" />
          )}
          {saving ? 'Mentés...' : (isEdit ? 'Recept frissítése' : 'Recept létrehozása')}
        </button>
      </form>
    </div>
  );
}
