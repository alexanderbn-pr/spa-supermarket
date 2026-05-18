'use client';

import React from 'react';
import { ShoppingItem } from '@/hooks/useShoppingList';

function ShoppingItemRow({ item, onToggle, onIncrement, onDecrement, onDelete }: {
  item: ShoppingItem;
  onToggle: (id: number) => void;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onDelete: (id: number) => void;
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

        <button
          onClick={() => onDelete(item.id)}
          className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default React.memo(ShoppingItemRow);