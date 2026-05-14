'use client';

import { useCallback } from 'react';

interface FavoriteCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function FavoriteCheckbox({ checked, onChange }: FavoriteCheckboxProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    },
    [onChange]
  );

  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
      />
      <span className={checked ? 'text-amber-600' : ''}>
        {checked ? '★' : '☆'}
      </span>
      <span>Solo favoritos</span>
    </label>
  );
}