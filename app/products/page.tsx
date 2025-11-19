"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchZoneProducts, getFullImageUrl, type ZoneProduct } from '@/lib/erpnext-api';
import { useWishlist } from '@/contexts/WishlistContext';
import { useDebounce } from '@/hooks/useDebounce';
import toast from 'react-hot-toast';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const [filterInStock, setFilterInStock] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const data = await fetchZoneProducts();
      return data.filter(p => p.disable === 0);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once for offline scenarios
    retryDelay: 1000,
  });
  
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category_list || 'Uncategorized'));
    return Array.from(cats).sort();
  }, [products]);
  
  const maxPrice = useMemo(() => {
    return Math.max(...products.map(p => p.price), 10000);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch = product.item_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                             (product.brand && product.brand.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
                             (product.category_list && product.category_list.toLowerCase().includes(debouncedSearch.toLowerCase()));
        const matchesStock = !filterInStock || product.total_stock_all_warehouses > 0;
        const matchesCategory = selectedCategories.length === 0 || 
                               selectedCategories.includes(product.category_list || 'Uncategorized');
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesSearch && matchesStock && matchesCategory && matchesPrice;
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
  }, [products, debouncedSearch, filterInStock, selectedCategories, priceRange, sortBy]);
  
  const handleWishlistToggle = (itemCode: string) => {
    if (isInWishlist(itemCode)) {
      removeFromWishlist(itemCode);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(itemCode);
      toast.success('Added to wishlist');
    }
  };
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilterInStock(false);
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setSortBy('name');
    toast.success('Filters cleared');
  };
  
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading products</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition"
            aria-label="Retry loading products"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold text-white mb-12 text-center glow-text-subtle">
          All Products
        </h1>

        {/* Filters Section */}
        <div className="mb-8 space-y-4">
          {/* Search and Sort Row */}
          <div className="flex flex-col md:flex-row gap-4 items-center bg-black border-2 border-white/20 rounded-2xl p-6">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                aria-label="Search products"
              />
              <svg
                className="absolute right-3 top-3.5 w-5 h-5 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/60"
              aria-label="Sort products"
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
                aria-label="Show only in-stock products"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="bg-black border-2 border-white/20 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      selectedCategories.includes(category)
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    aria-label={`Filter by ${category}`}
                    aria-pressed={selectedCategories.includes(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="bg-black border-2 border-white/20 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-3">Price Range</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="flex-1"
                aria-label="Maximum price filter"
              />
              <span className="text-white text-sm whitespace-nowrap">
                AED {priceRange[0]} - {priceRange[1]}
              </span>
            </div>
          </div>
        </div>

        {/* Results Count and Clear Filters */}
        <div className="mb-6 text-white/60 flex items-center justify-between">
          <span role="status" aria-live="polite">
            {isLoading ? 'Loading...' : `Showing ${filteredProducts.length} of ${products.length} products`}
          </span>
          {(selectedCategories.length > 0 || filterInStock || debouncedSearch || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
            <button
              onClick={clearFilters}
              className="text-sm text-white/80 hover:text-white underline transition"
              aria-label="Clear all filters"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="status" aria-label="Loading products">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list" aria-label="Product list">
            {filteredProducts.map((product) => (
              <article
                key={product.item_code}
                className="group relative bg-black border-2 border-white/20 rounded-xl p-4 hover:border-white/60 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
                role="listitem"
              >
                {/* Stock Badge */}
                {product.total_stock_all_warehouses === 0 && (
                  <div 
                    className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-full z-10"
                    role="status"
                    aria-label="Out of stock"
                  >
                    Out of Stock
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => handleWishlistToggle(product.item_code)}
                  className="absolute top-4 left-4 z-10 text-white hover:scale-110 transition"
                  aria-label={isInWishlist(product.item_code) ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-pressed={isInWishlist(product.item_code)}
                >
                  <svg
                    className="w-6 h-6"
                    fill={isInWishlist(product.item_code) ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
                  <div className="bg-white/10 rounded-lg h-40 mb-3 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    {product.image ? (
                      <img
                        src={getFullImageUrl(product.image)}
                        alt={product.item_name}
                        className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="space-y-1.5">
                  <div className="text-xs text-white/50 uppercase tracking-wider">
                    {product.category_list || 'General'}
                  </div>
                  <Link href={`/product/${product.item_code}`}>
                    <h3 className="text-sm font-bold text-white hover:text-white/80 transition line-clamp-2 min-h-[2.5rem]">
                      {product.item_name}
                    </h3>
                  </Link>
                  {product.brand && (
                    <p className="text-xs text-white/60">Brand: {product.brand}</p>
                  )}

                  {/* Zone Info */}
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>Zone {product.zone}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="text-lg font-bold text-white">
                      {product.price > 0 ? `AED ${product.price.toFixed(2)}` : 'Contact for price'}
                    </div>
                    <Link
                      href={`/product/${product.item_code}`}
                      className="px-3 py-1.5 bg-white text-black rounded-lg hover:bg-white/90 transition text-xs font-semibold"
                      aria-label={`View details for ${product.item_name}`}
                    >
                      View
                    </Link>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" aria-hidden="true">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-white/60 text-xl mb-2">No products found</p>
            <p className="text-white/40 text-sm">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
