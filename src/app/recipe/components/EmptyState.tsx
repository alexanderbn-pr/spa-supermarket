export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <svg
          className="h-8 w-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <p className="mt-4 text-lg font-medium text-gray-700">No hay recetas que coincidan con la búsqueda</p>
      <p className="mt-2 text-sm text-gray-500">Prueba a ampliar los filtros o buscar otro término</p>
    </div>
  );
}