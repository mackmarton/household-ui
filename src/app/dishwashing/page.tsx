'use client';

import React from 'react';
import { useDishwashing } from '@/hooks/useApi';
import { Utensils, User, Clock } from 'lucide-react';

export default function DishwashingPage() {
  const {
    events,
    whoseTurn,
    loading,
    error,
    addDishwashingForMarci,
    addDishwashingForReka
  } = useDishwashing();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
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
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mosogatás</h1>
        <Utensils size={32} className="mx-auto text-blue-600" />
      </div>

      {/* Whose Turn Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ki következik?</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <User size={24} className="text-blue-600" />
              <span className="text-2xl font-bold text-blue-800">
                {whoseTurn || 'Betöltés...'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={addDishwashingForMarci}
              className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Utensils size={20} className="mr-2" />
              Marci mosogatott
            </button>
            <button
              onClick={addDishwashingForReka}
              className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Utensils size={20} className="mr-2" />
              Reka mosogatott
            </button>
          </div>
        </div>
      </div>

      {/* Dishwashing History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock size={20} className="mr-2 text-gray-600" />
          Legutóbbi események
        </h2>

        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Még nincsenek rögzített mosogatási események
          </p>
        ) : (
          <div className="space-y-3">
            {events
              .filter(event => event.name) // Filter out events with null names first
              .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
              .slice(0, 10) // Show only the most recent 10 events
              .map((event) => (
                <div
                  key={event.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    event.name === 'Marci'
                      ? 'bg-purple-50 border-purple-200'
                      : 'bg-pink-50 border-pink-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        event.name === 'Marci' ? 'bg-purple-600' : 'bg-pink-600'
                      }`}
                    >
                      {event.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="font-medium text-gray-900">{event.name || 'Ismeretlen'}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(event.time)}
                  </span>
                </div>
              ))}
          </div>
        )}

        {events.length > 10 && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              A legutóbbi 10 esemény megjelenítése a(z) {events.length} összesből
            </p>
          </div>
        )}
      </div>

      {/* Stats Section */}
      {events.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Statisztikák</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Marci', 'Reka'].map(person => {
              const personEvents = events.filter(e => e.name === person);
              const percentage = events.length > 0 ? (personEvents.length / events.length * 100).toFixed(1) : 0;

              return (
                <div
                  key={person}
                  className={`text-center p-4 rounded-lg ${
                    person === 'Marci' ? 'bg-purple-50' : 'bg-pink-50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white text-lg font-bold mb-2 ${
                      person === 'Marci' ? 'bg-purple-600' : 'bg-pink-600'
                    }`}
                  >
                    {person[0]}
                  </div>
                  <p className="font-semibold text-gray-900">{person}</p>
                  <p className="text-2xl font-bold text-gray-900">{personEvents.length}</p>
                  <p className="text-sm text-gray-600">{percentage}% of total</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
