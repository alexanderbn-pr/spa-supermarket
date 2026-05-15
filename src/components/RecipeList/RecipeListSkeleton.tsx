import { CardSkeleton } from '@/components/Card/CardSkeleton';

interface RecipeListSkeletonProps {
  count?: number;
}

export function RecipeListSkeleton({ count = 8 }: RecipeListSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      role="status"
      aria-label="Cargando recetas..."
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export default RecipeListSkeleton;