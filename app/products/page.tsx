"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchZoneProducts, getFullImageUrl, type ZoneProduct } from '@/lib/erpnext-api';
import { useWishlist } from '@/contexts/WishlistContext';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const [filterInStock, setFilterInStock] = useState(false);
  const [products, setProducts] = useState<ZoneProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchZoneProducts();
    setProducts(data.filter(p => p.disable === 0));
    setLoading(false);
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (product.category_list && product.category_list.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStock = !filterInStock || product.total_stock_all_warehouses > 0;
      return matchesSearch && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.item_name.localeCompare(b.item_name);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold text-white mb-12 text-center glow-text-subtle">
          All Products
        </h1>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-black border-2 border-white/20 rounded-2xl p-6">
          {/* Search */}
          <div className="relative flex-1 w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
            />
            <svg
              className="absolute right-3 top-3.5 w-5 h-5 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/60"
          >
            <option value="name">Sort by Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          {/* In Stock Filter */}
          <label className="flex items-center gap-2 text-white cursor-pointer">
            <input
              type="checkbox"
              checked={filterInStock}
              onChange={(e) => setFilterInStock(e.target.checked)}
              className="w-5 h-5 rounded"
            />
            <span>In Stock Only</span>
          </label>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-white/60">
          {loading ? 'Loading...' : `Showing ${filteredProducts.length} products`}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.item_code}
                className="group relative bg-black border-2 border-white/20 rounded-2xl p-6 hover:border-white/60 transition-all duration-500 hover:scale-105 overflow-hidden"
              >
                {/* Stock Badge */}
                {product.total_stock_all_warehouses === 0 && (
                  <div className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-full z-10">
                    Out of Stock
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => {
                    if (isInWishlist(product.item_code)) {
                      removeFromWishlist(product.item_code);
                    } else {
                      addToWishlist(product.item_code);
                    }
                  }}
                  className="absolute top-4 left-4 z-10 text-white hover:scale-110 transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill={isInWishlist(product.item_code) ? "currentColor" : "none"}
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

                {/* Product Image */}
                <Link href={`/product/${product.item_code}`}>
                  <div className="bg-white/10 rounded-xl h-48 mb-4 flex items-center justify-center group-hover:bg-white/20 transition overflow-hidden">
                    {product.image ? (
                      <img
                        src={getFullImageUrl(product.image)}
                        alt={product.item_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="space-y-2">
                  <div className="text-xs text-white/50 uppercase tracking-wider">
                    {product.category_list || 'General'}
                  </div>
                  <Link href={`/product/${product.item_code}`}>
                    <h3 className="text-base font-bold text-white hover:text-white/80 transition line-clamp-2">
                      {product.item_name}
                    </h3>
                  </Link>
                  {product.brand && (
                    <p className="text-sm text-white/60">Brand: {product.brand}</p>
                  )}

                  {/* Zone Info */}
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>Zone {product.zone}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="text-2xl font-bold text-white">
                      {product.price > 0 ? `AED ${product.price.toFixed(2)}` : 'Contact for price'}
                    </div>
                    <Link
                      href={`/product/${product.item_code}`}
                      className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition text-sm font-semibold"
                    >
                      View
                    </Link>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/60 text-xl">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
