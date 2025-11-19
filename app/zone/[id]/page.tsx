"use client";

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { zones } from '@/lib/data';
import Link from 'next/link';
import { getCategoriesByZone, getBrandsByZoneAndCategory, getProductsByZoneCategoryBrand, type CategorySummary, type BrandSummary, type ZoneProduct } from '@/lib/erpnext-api';

export default function ZonePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const zoneId = (params.id as string).toUpperCase();
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

  // Load brands when category is selected
  useEffect(() => {
    if (selectedCategory && !selectedBrand) {
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

  // Load products when brand is selected
  useEffect(() => {
    if (selectedCategory && selectedBrand) {
      setLoading(true);
      getProductsByZoneCategoryBrand(zoneId, selectedCategory, selectedBrand)
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

  if (!zone) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Zone Not Found</h1>
          <Link href="/" className="text-white/60 hover:text-white transition">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Breadcrumb
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: `Zone ${zoneId}`, href: `/zone/${zoneId}` },
  ];
  if (selectedCategory) {
    breadcrumbs.push({ label: selectedCategory, href: `/zone/${zoneId}?category=${encodeURIComponent(selectedCategory)}` });
  }
  if (selectedBrand) {
    breadcrumbs.push({ label: selectedBrand, href: '#' });
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
              Zone {zoneId}
            </h1>
            <p className="text-2xl text-white/80 mb-2">{zone.description}</p>
            {!selectedCategory && (
              <p className="text-white/60">{categories.length} Categories Available</p>
            )}
            {selectedCategory && !selectedBrand && (
              <p className="text-white/60">{brands.length} Brands in {selectedCategory}</p>
            )}
            {selectedCategory && selectedBrand && (
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
            )}

            {/* Brands View */}
            {selectedCategory && !selectedBrand && brands.length > 0 && (
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
            )}

            {/* Products View */}
            {selectedCategory && selectedBrand && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <div
                    key={product.item_code}
                    className="backdrop-blur-xl bg-white/5 border-2 border-white/20 rounded-2xl p-6 hover:border-white/60 hover:bg-white/10 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Product Image */}
                    <div className="bg-white/10 rounded-xl h-48 mb-4 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img src={product.image.startsWith('http') ? product.image : `https://erp.ihgind.com${product.image.startsWith('/') ? product.image : '/' + product.image}`} alt={product.item_name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <h3 className="text-base font-bold text-white mb-1 line-clamp-2">{product.item_name}</h3>
                    <p className="text-sm text-white/60 mb-2">{product.item_code}</p>
                    <p className="text-xs text-white/50 mb-4">{product.brand}</p>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-4">
                      <Link 
                        href={`/product/${product.item_code}`}
                        className="text-2xl font-bold text-white hover:text-white/80 transition"
                      >
                        AED {product.price.toFixed(2)}
                      </Link>
                      {product.total_stock_all_warehouses > 0 ? (
                        <span className="text-xs px-3 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                          Available
                        </span>
                      ) : (
                        <span className="text-xs px-3 py-1 bg-red-500/20 text-red-300 rounded-full border border-red-500/30">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Barcode */}
                    {product.primary_barcode && (
                      <p className="text-xs text-white/40 mt-3 font-mono">{product.primary_barcode}</p>
                    )}
                    
                    {/* View Details Button */}
                    <Link
                      href={`/product/${product.item_code}`}
                      className="block mt-4 w-full text-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition text-sm font-semibold"
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
