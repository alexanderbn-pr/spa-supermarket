'use client';

import { ShoppingItem } from '@/hooks/useShoppingList';

function ShoppingItemRow({ item, onToggle, onIncrement, onDecrement }: {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm transition-all duration-200 animate-fadeIn ${
        item.checked ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onToggle(item.id)}
          className="w-5 h-5 rounded border-2 border-gray-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer transition-colors"
        />
        <span
          className={`text-lg transition-all duration-200 ${
            item.checked ? 'line-through text-gray-400' : 'text-gray-800'
          }`}
        >
          {item.name}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onDecrement(item.id)}
          disabled={item.quantity <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <span className="text-lg font-medium">−</span>
        </button>

        <span className="w-8 text-center font-semibold text-gray-800">
          {item.quantity}
        </span>

        <button
          onClick={() => onIncrement(item.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          aria-label="Increase quantity"
        >
          <span className="text-lg font-medium">+</span>
        </button>
      </div>
    </div>
  );
}

export default ShoppingItemRow;