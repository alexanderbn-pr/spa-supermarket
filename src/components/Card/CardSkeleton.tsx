export const CardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-[#f5f5f7] shadow-card animate-pulse">
      <div className="aspect-square bg-[#e5e5e7]" />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-6 w-3/4 rounded bg-[#e5e5e7]" />

        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-[#e5e5e7]" />
          <div className="h-4 w-2/3 rounded bg-[#e5e5e7]" />
        </div>

        <div className="mt-auto flex gap-2 pt-2">
          <div className="h-6 w-16 rounded-full bg-[#e5e5e7]" />
          <div className="h-6 w-16 rounded-full bg-[#e5e5e7]" />
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
