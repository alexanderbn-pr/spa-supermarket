'use client';

import { useState } from 'react';
import { useShoppingList } from '@/hooks/useShoppingList';
import ShoppingItemRow from './ShoppingItemRow';

function LoadingSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm animate-pulse"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-5 h-5 rounded border-2 border-gray-200 bg-gray-200" />
            <div className="h-5 w-28 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="w-8 h-5 bg-gray-200 rounded" />
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="ml-2 w-8 h-8 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ShoppingList() {
  const {
    sortedItems,
    inputValue,
    loading,
    error,
    incrementQuantity,
    decrementQuantity,
    toggleChecked,
    removeItem,
    handleInputChange,
    handleAddSubmit,
    clearAll,
    clearing,
    refetch,
  } = useShoppingList();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearConfirm = async () => {
    const result = await clearAll();
    if (result.success) {
      setShowClearConfirm(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleAddSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <label htmlFor="ingredient-input" className="sr-only">
            Añadir ingrediente
          </label>
          <input
            id="ingredient-input"
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Añadir ingrediente..."
            className="flex-1 px-3 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-4 py-3 bg-emerald-600 w-full sm:w-auto hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Añadir
          </button>
        </div>
      </form>

      {/* Loading skeleton — only on first load */}
      {loading && sortedItems.length === 0 && <LoadingSkeleton />}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-12 text-red-500">
          <p className="text-lg font-medium">No se pudo cargar la lista</p>
          <p className="text-sm mt-1 text-gray-500">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && sortedItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Tu lista está vacía</p>
          <p className="text-sm mt-1">Añade ingredientes usando el campo de arriba</p>
        </div>
      )}

      {/* Item list */}
      {!loading && !error && sortedItems.length > 0 && (
        <>
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              disabled={clearing}
              className="text-sm text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
            >
              {clearing ? 'Borrando...' : 'Vaciar lista'}
            </button>
          </div>
          <div className="space-y-3">
            {sortedItems.map((item) => (
              <ShoppingItemRow
                key={item.id}
                item={item}
                onToggle={toggleChecked}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
                onDelete={removeItem}
              />
            ))}
          </div>
        </>
      )}

      {sortedItems.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          {sortedItems.filter((i) => i.checked).length} de {sortedItems.length}{' '}
          elementos comprados
        </div>
      )}

      {/* Clear Confirmation Bottom Sheet */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-dialog-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowClearConfirm(false)}
          />

          {/* Bottom Sheet */}
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 animate-slideUpSheet">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 id="clear-dialog-title" className="text-xl font-semibold text-[#1d1d1f] mb-2">
                ¿Vaciar la lista?
              </h3>
              <p className="text-gray-500 mb-6">
                Se eliminarán {sortedItems.length} elemento{sortedItems.length !== 1 ? 's' : ''} de tu lista de la compra.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-[#1d1d1f] font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleClearConfirm}
                  disabled={clearing}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {clearing ? 'Borrando...' : 'Vaciar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
