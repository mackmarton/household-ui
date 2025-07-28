'use client';

import React from 'react';
import Link from 'next/link';
import { useRecipes } from '@/hooks/useApi';
import { Plus, ChefHat } from 'lucide-react';

export default function RecipesPage() {
  const { recipes, loading, error } = useRecipes();

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Receptek</h1>
        <Link
          href="/recipes/add"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors"
        >
          <Plus size={24} />
        </Link>
      </div>

      {/* Recipes List */}
      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">Még nincsenek receptek</p>
          <Link
            href="/recipes/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Első recept hozzáadása
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="block bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {recipe.name}
                  </h3>
                  {recipe.description && (
                    <p className="text-sm text-gray-600 mb-1">
                      {recipe.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Hozzávalók megtekintése
                  </p>
                </div>
                <div className="text-gray-400">
                  <ChefHat size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
