"use client";

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { zones } from '@/lib/data';
import Link from 'next/link';
import { getCategoriesByZone, getBrandsByZoneAndCategory, getProductsByZoneCategoryBrand, getProductsByZone, getProductsByZoneAndCategory, type CategorySummary, type BrandSummary, type ZoneProduct } from '@/lib/erpnext-api';

export default function ZonePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const zoneId = params.id as string;
  const zone = zones.find(z => z.id === zoneId);
  
  const selectedCategory = searchParams.get('category');
  const selectedBrand = searchParams.get('brand');
  
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [brands, setBrands] = useState<BrandSummary[]>([]);
  const [products, setProducts] = useState<ZoneProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories when zone changes
  useEffect(() => {
    if (!selectedCategory) {
      setLoading(true);
      getCategoriesByZone(zoneId)
        .then(data => {
          setCategories(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading categories:', err);
          setLoading(false);
        });
    }
  }, [zoneId, selectedCategory]);

  // Load brands when category is selected (skip if category is "all")
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all' && !selectedBrand) {
      setLoading(true);
      getBrandsByZoneAndCategory(zoneId, selectedCategory)
        .then(data => {
          setBrands(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading brands:', err);
          setLoading(false);
        });
    }
  }, [zoneId, selectedCategory, selectedBrand]);

  // Load products when brand is selected or "all" is chosen
  useEffect(() => {
    if (selectedCategory && selectedBrand) {
      setLoading(true);
      
      let productPromise;
      if (selectedCategory === 'all') {
        // Browse all products in zone
        productPromise = getProductsByZone(zoneId);
      } else if (selectedBrand === 'all') {
        // Browse all products in category
        productPromise = getProductsByZoneAndCategory(zoneId, selectedCategory);
      } else {
        // Browse products by specific brand
        productPromise = getProductsByZoneCategoryBrand(zoneId, selectedCategory, selectedBrand);
      }
      
      productPromise
        .then(data => {
          setProducts(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading products:', err);
          setLoading(false);
        });
    }
  }, [zoneId, selectedCategory, selectedBrand]);

  // Use zone data if available, otherwise create fallback
  const zoneName = zone?.name || `Zone ${zoneId}`;
  const zoneDescription = zone?.description || 'LED Lighting Solutions';

  // Breadcrumb
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: `Zone ${zoneId}`, href: `/zone/${zoneId}` },
  ];
  if (selectedCategory && selectedCategory !== 'all') {
    breadcrumbs.push({ label: selectedCategory, href: `/zone/${zoneId}?category=${encodeURIComponent(selectedCategory)}` });
  }
  if (selectedBrand && selectedBrand !== 'all') {
    breadcrumbs.push({ label: selectedBrand, href: '#' });
  }
  if (selectedCategory === 'all' || selectedBrand === 'all') {
    breadcrumbs.push({ label: 'All Products', href: '#' });
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="light-ray light-ray-1"></div>
          <div className="light-ray light-ray-2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8 flex-wrap">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-white/40">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-white">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-white/60 hover:text-white transition">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4 glow-text">
              {zoneName}
            </h1>
            <p className="text-2xl text-white/80 mb-2">{zoneDescription}</p>
            {!selectedCategory && (
              <p className="text-white/60">{categories.length} Categories Available</p>
            )}
            {selectedCategory === 'all' && (
              <p className="text-white/60">{products.length} Products in Zone</p>
            )}
            {selectedCategory && selectedCategory !== 'all' && !selectedBrand && (
              <p className="text-white/60">{brands.length} Brands in {selectedCategory}</p>
            )}
            {selectedBrand === 'all' && (
              <p className="text-white/60">{products.length} Products in {selectedCategory}</p>
            )}
            {selectedCategory && selectedBrand && selectedBrand !== 'all' && (
              <p className="text-white/60">{products.length} Products - {selectedBrand}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            <p className="text-white/60 mt-4">Loading...</p>
          </div>
        ) : (
          <>
            {/* Categories View */}
            {!selectedCategory && categories.length > 0 && (
              <>
                {/* Browse All Products in Zone Button */}
                <div className="mb-8">
                  <Link
                    href={`/zone/${zoneId}?category=all`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Browse All Products in Zone {zoneId}
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <Link
                    key={category.category}
                    href={`/zone/${zoneId}?category=${encodeURIComponent(category.category)}`}
                    className="group backdrop-blur-xl bg-white/5 border-2 border-white/20 rounded-2xl p-8 hover:border-white/60 hover:bg-white/10 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0 block"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:glow-text transition-all">
                          {category.category}
                        </h3>
                        <p className="text-white/60 text-sm">
                          {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}
                        </p>
                      </div>
                      <svg className="w-6 h-6 text-white/40 group-hover:text-white transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    {category.brands.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {category.brands.slice(0, 3).map((brand, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded">
                            {brand}
                          </span>
                        ))}
                        {category.brands.length > 3 && (
                          <span className="text-xs px-2 py-1 text-white/50">
                            +{category.brands.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
              </>
            )}

            {/* Brands View */}
            {selectedCategory && !selectedBrand && brands.length > 0 && (
              <>
                {/* Browse All Products in Category Button */}
                <div className="mb-8">
                  <Link
                    href={`/zone/${zoneId}?category=${encodeURIComponent(selectedCategory)}&brand=all`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Browse All Products in {selectedCategory}
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {brands.map((brand, index) => (
                  <Link
                    key={brand.brand}
                    href={`/zone/${zoneId}?category=${encodeURIComponent(selectedCategory)}&brand=${encodeURIComponent(brand.brand)}`}
                    className="group backdrop-blur-xl bg-white/5 border-2 border-white/20 rounded-2xl p-6 hover:border-white/60 hover:bg-white/10 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0 block text-center"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:glow-text transition-all">
                      {brand.brand}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {brand.productCount} {brand.productCount === 1 ? 'Product' : 'Products'}
                    </p>
                  </Link>
                ))}
              </div>
              </>
            )}

            {/* Products View */}
            {selectedCategory && selectedBrand && products.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product, index) => (
                  <div
                    key={product.item_code}
                    className="backdrop-blur-xl bg-white/5 border-2 border-white/20 rounded-xl p-3 hover:border-white/60 hover:bg-white/10 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Product Image */}
                    <div className="bg-white/10 rounded-lg h-32 mb-2 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img src={product.image.startsWith('http') ? product.image : `https://erp.ihgind.com${product.image.startsWith('/') ? product.image : '/' + product.image}`} alt={product.item_name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{product.item_name}</h3>
                    <p className="text-xs text-white/60 mb-1">{product.item_code}</p>
                    <p className="text-xs text-white/50 mb-2">{product.brand}</p>

                    {/* Price */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                      <Link 
                        href={`/product/${product.item_code}`}
                        className="text-base md:text-lg font-bold text-white hover:text-white/80 transition truncate"
                      >
                        AED {product.price.toFixed(2)}
                      </Link>
                      {product.total_stock_all_warehouses > 0 ? (
                        <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full border border-green-500/30 whitespace-nowrap flex-shrink-0">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full border border-red-500/30 whitespace-nowrap flex-shrink-0">
                          Out
                        </span>
                      )}
                    </div>
                    
                    {/* View Details Button */}
                    <Link
                      href={`/product/${product.item_code}`}
                      className="block mt-2 w-full text-center px-3 py-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition text-xs font-semibold"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && (
              <>
                {!selectedCategory && categories.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-white/60 text-xl">No categories available in this zone yet.</p>
                  </div>
                )}
                {selectedCategory && !selectedBrand && brands.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-white/60 text-xl">No brands available in this category.</p>
                  </div>
                )}
                {selectedCategory && selectedBrand && products.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-white/60 text-xl">No products available for this brand.</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
