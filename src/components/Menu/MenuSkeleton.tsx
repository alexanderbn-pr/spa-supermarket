'use client';

import { DAYS } from '@/types/menuApi.types';

export default function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {DAYS.map((day) => (
        <div key={day.name} className="flex flex-col gap-3 rounded-xl bg-white p-4">
          {/* Day label skeleton */}
          <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200" />

          {/* Comida selector skeleton */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-12 animate-pulse rounded-md bg-gray-200" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200" />
          </div>

          {/* Cena selector skeleton */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-10 animate-pulse rounded-md bg-gray-200" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}