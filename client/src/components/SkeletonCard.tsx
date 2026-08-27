export function SkeletonCard({ type = 'grid' }: { type?: 'grid' | 'detail' | 'list' }) {
  if (type === 'detail') {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="w-full h-80 bg-gray-200 rounded-3xl" />
        <div className="h-8 bg-gray-200 rounded-xl w-2/3" />
        <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
        <div className="space-y-3 pt-4">
          <div className="h-4 bg-gray-200 rounded-lg w-full" />
          <div className="h-4 bg-gray-200 rounded-lg w-5/6" />
          <div className="h-4 bg-gray-200 rounded-lg w-4/6" />
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="w-full bg-white p-5 rounded-2xl border border-gray-150 shadow-sm animate-pulse flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
        <div className="w-24 h-8 bg-gray-200 rounded-lg shrink-0" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-150 animate-pulse flex flex-col h-full">
      <div className="w-full h-52 bg-gray-200 relative" />
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
          <div className="h-3.5 bg-gray-200 rounded-md w-1/2" />
          <div className="space-y-1.5 pt-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-4/5" />
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, type = 'grid' }: { count?: number; type?: 'grid' | 'list' }) {
  return (
    <div className={type === 'list' ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} type={type} />
      ))}
    </div>
  );
}
