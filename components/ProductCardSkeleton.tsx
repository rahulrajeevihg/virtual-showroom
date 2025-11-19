export default function ProductCardSkeleton() {
  return (
    <div className="backdrop-blur-xl bg-white/5 border-2 border-white/20 rounded-xl p-4 animate-pulse">
      <div className="bg-white/10 rounded-lg h-48 mb-4"></div>
      <div className="h-4 bg-white/10 rounded mb-2"></div>
      <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-white/10 rounded w-1/2 mb-4"></div>
      <div className="flex items-center justify-between">
        <div className="h-6 bg-white/10 rounded w-1/3"></div>
        <div className="h-8 w-8 bg-white/10 rounded-full"></div>
      </div>
    </div>
  );
}
