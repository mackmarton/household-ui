'use client';

import Link from 'next/link';
import { ChefHat, ShoppingCart, Utensils } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Háztartás</h1>
        <p className="text-gray-600">Receptek, bevásárlás és háztartási feladatok kezelése</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4">
        <Link
          href="/recipes"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <ChefHat size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Receptek</h2>
              <p className="text-gray-600">Receptek megtekintése és kezelése</p>
            </div>
          </div>
        </Link>

        <Link
          href="/shopping-cart"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <ShoppingCart size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Bevásárló lista</h2>
              <p className="text-gray-600">Bevásárló tételek kezelése</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dishwashing"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Utensils size={24} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Mosogatás</h2>
              <p className="text-gray-600">Mosogatási feladatok nyomon követése</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
