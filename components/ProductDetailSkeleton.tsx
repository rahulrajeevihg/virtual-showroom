export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="h-4 bg-white/10 rounded w-64 mb-4 animate-pulse"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-white/5 border-2 border-white/20 rounded-xl p-4 animate-pulse">
            <div className="bg-white/10 rounded-lg aspect-square"></div>
          </div>
          
          <div className="space-y-4">
            <div className="h-8 bg-white/10 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-white/10 rounded w-1/3 animate-pulse"></div>
            
            <div className="backdrop-blur-xl bg-white/5 border-2 border-white/20 rounded-xl p-4 animate-pulse">
              <div className="h-8 bg-white/10 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-1/4"></div>
            </div>
            
            <div className="h-12 bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
