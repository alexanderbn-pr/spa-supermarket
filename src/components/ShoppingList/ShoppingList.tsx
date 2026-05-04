'use client';

import { useShoppingList } from '@/hooks/useShoppingList';
import ShoppingItemRow from './ShoppingItemRow';
export default function ShoppingList() {
  const {
    items,
    inputValue,
    incrementQuantity,
    decrementQuantity,
    toggleChecked,
    handleInputChange,
    handleAddSubmit,
  } = useShoppingList();

  //Transformar el onSubmit a action
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleAddSubmit} className="mb-6">
        <div className="flex gap-2">
          <label htmlFor="ingredient-input" className="sr-only">
            Añadir ingrediente
          </label>
          <input
            id="ingredient-input"
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Añadir ingrediente..."
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Añadir
          </button>
        </div>
      </form>

      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Tu lista está vacía</p>
          <p className="text-sm mt-1">Añade ingredientes usando el campo de arriba</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <ShoppingItemRow
              key={item.id}
              item={item}
              onToggle={toggleChecked}
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
            />
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          {items.filter((i) => i.checked).length} de {items.length} elementos
          comprados
        </div>
      )}
    </div>
  );
}