'use client';

import React, { useState } from 'react';
import { useItems } from '@/hooks/useApi';
import { itemApi } from '@/lib/api';
import { ShoppingCart, Check, X, Plus } from 'lucide-react';

export default function ShoppingCartPage() {
  const { items, loading, error, updateItem, refetch } = useItems();
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [newItemName, setNewItemName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setIsCreating(true);
    try {
      // Create new item with isOnShoppingList: true to instantly add to cart
      await itemApi.createItem({
        name: newItemName.trim(),
        isOnShoppingList: true
      });

      // Clear form and refresh items
      setNewItemName('');
      await refetch();
    } catch (error) {
      console.error('Failed to create new item:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleShoppingList = async (itemId: number, currentStatus: boolean) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      await updateItem({
        ...item,
        isOnShoppingList: !currentStatus
      });
    } catch (error) {
      console.error('Failed to update shopping list status:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
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

  // Separate items by shopping list status
  const itemsOnShoppingList = items.filter(item => item.isOnShoppingList);
  const itemsNotOnShoppingList = items.filter(item => !item.isOnShoppingList);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bevásárló lista</h1>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {itemsOnShoppingList.length} termék
        </div>
      </div>

      {/* Shopping List Items */}
      <div className="space-y-6">
        {/* Items TO BUY (on shopping list) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ShoppingCart size={20} className="mr-2 text-blue-600" />
            Megvásárlandó ({itemsOnShoppingList.length})
          </h2>

          {itemsOnShoppingList.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nincs termék a bevásárló listádon
            </p>
          ) : (
            <div className="space-y-2">
              {itemsOnShoppingList.map((item) => {
                const isUpdating = updatingItems.has(item.id || 0);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleToggleShoppingList(item.id || 0, item.isOnShoppingList)}
                        disabled={isUpdating}
                        className="w-6 h-6 border-2 border-red-400 rounded flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-50"
                        title="Eltávolítás a bevásárló listából"
                      >
                        {isUpdating && (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </button>
                      <span className="text-gray-900 font-medium">{item.name}</span>
                    </div>
                    <X size={16} className="text-red-400" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Items AVAILABLE (not on shopping list) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Check size={20} className="mr-2 text-green-600" />
            Elérhető ({itemsNotOnShoppingList.length})
          </h2>

          {itemsNotOnShoppingList.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Minden terméket meg kell vásárolni
            </p>
          ) : (
            <div className="space-y-2">
              {itemsNotOnShoppingList.map((item) => {
                const isUpdating = updatingItems.has(item.id || 0);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleToggleShoppingList(item.id || 0, item.isOnShoppingList)}
                        disabled={isUpdating}
                        className="w-6 h-6 bg-green-500 border-2 border-green-500 text-white rounded flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-50"
                        title="Hozzáadás a bevásárló listához"
                      >
                        {isUpdating ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Check size={16} />
                        )}
                      </button>
                      <span className="text-gray-900">{item.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Item Creation */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus size={20} className="mr-2 text-green-600" />
          Új termék hozzáadása
        </h2>

        <form onSubmit={handleCreateNewItem} className="flex space-x-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Termék neve"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isCreating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Plus size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
