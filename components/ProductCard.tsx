"use client";

import { Product } from '@/types';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <div className="group relative bg-black border-2 border-white/20 rounded-2xl p-6 hover:border-white/60 transition-all duration-500 hover:scale-105 overflow-hidden">
      {/* Stock Badge */}
      {!product.inStock && (
        <div className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-full z-10">
          Out of Stock
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-4 left-4 z-10 text-white hover:scale-110 transition"
      >
        <svg
          className="w-6 h-6"
          fill={isInWishlist(product.id) ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Product Image Placeholder */}
      <div className="bg-white/10 rounded-xl h-48 mb-4 flex items-center justify-center group-hover:bg-white/20 transition">
        <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="text-xs text-white/50 uppercase tracking-wider">{product.category}</div>
        <h3 className="text-xl font-bold text-white">{product.name}</h3>
        <p className="text-sm text-white/60 line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-white' : 'text-white/20'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-white/50">({product.reviews})</span>
        </div>

        {/* Specs */}
        <div className="flex gap-2 text-xs text-white/50">
          <span>{product.brightness} lm</span>
          <span>•</span>
          <span>{product.wattage}W</span>
          <span>•</span>
          <span>{product.colorTemperature}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-center pt-4 border-t border-white/10">
          <div className="text-2xl font-bold text-white">${product.price}</div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      </div>
    </div>
  );
}
