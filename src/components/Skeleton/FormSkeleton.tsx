/**
 * Skeleton para formularios de carga
 * Diseño animado estilo Apple
 */
interface FormSkeletonProps {
  title?: string;
  subtitle?: string;
  fields?: number;
  showActions?: boolean;
}

export function FormSkeleton({
  subtitle,
  fields = 5,
  showActions = true,
}: FormSkeletonProps) {
  return (
    <div className="flex flex-col gap-8 rounded-2xl bg-white p-8 shadow-md animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="h-8 w-48 rounded-lg bg-gray-200" />
        {subtitle && <div className="h-4 w-64 rounded-lg bg-gray-100" />}
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            {/* Label */}
            <div className="h-4 w-24 rounded-lg bg-gray-100" />
            {/* Input */}
            <div className="h-12 w-full rounded-xl bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-4 pt-4">
          <div className="h-10 w-24 rounded-full bg-gray-200" />
          <div className="h-10 w-32 rounded-full bg-[#0071e3]/20" />
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton para el formulario de creación de recetas
 */
export function CreateRecipeFormSkeleton() {
  return (
    <div className="flex flex-col gap-8 rounded-2xl bg-white p-8 shadow-md">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="h-8 w-40 rounded-lg bg-gray-200" />
        <div className="h-4 w-56 rounded-lg bg-gray-100" />
      </div>

      {/* Nombre y descripción */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-20 rounded-lg bg-gray-100" />
          <div className="h-12 w-full rounded-xl bg-gray-100" />
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="h-4 w-24 rounded-lg bg-gray-100" />
          <div className="h-24 w-full rounded-xl bg-gray-100" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="h-4 w-16 rounded-lg bg-gray-100" />
          <div className="h-12 w-full rounded-xl bg-gray-100" />
        </div>
      </div>

      {/* Selects row */}
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-16 rounded-lg bg-gray-100" />
          <div className="h-12 w-full rounded-xl bg-gray-100" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-20 rounded-lg bg-gray-100" />
          <div className="h-12 w-full rounded-xl bg-gray-100" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-20 rounded-lg bg-gray-100" />
          <div className="h-12 w-full rounded-xl bg-gray-100" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-24 rounded-lg bg-gray-100" />
          <div className="h-12 w-full rounded-xl bg-gray-100" />
        </div>
      </div>

      {/* Ingredientes - Special section */}
      <div className="flex flex-col gap-2">
        <div className="h-5 w-32 rounded-lg bg-gray-100" />
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-24 rounded-full bg-gray-100" />
          <div className="h-8 w-20 rounded-full bg-gray-100" />
          <div className="h-8 w-28 rounded-full bg-gray-100" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <div className="h-10 w-28 rounded-full bg-gray-200" />
        <div className="h-10 w-40 rounded-full bg-[#0071e3]" />
      </div>
    </div>
  );
}

export default FormSkeleton;