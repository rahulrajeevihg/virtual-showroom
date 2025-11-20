"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getItemFullDetails, type ItemFullDetails } from '@/lib/erpnext-api';
import { useWishlist } from '@/contexts/WishlistContext';
import { QRCodeSVG } from 'qrcode.react';

export default function ProductDetailPage() {
  const params = useParams();
  const itemCode = params.id as string;
  
  const [product, setProduct] = useState<ItemFullDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string>('');
  
  const { addToWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (itemCode) {
      setLoading(true);
      getItemFullDetails(itemCode)
        .then(data => {
          setProduct(data);
          if (data?.zones_available && data.zones_available.length > 0) {
            setSelectedZone(data.zones_available[0].zone);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading product:', err);
          setLoading(false);
        });
    }
  }, [itemCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="text-white/60">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Product Not Found</h1>
          <Link href="/" className="text-white/60 hover:text-white transition">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToWishlist = () => {
    addToWishlist(product.item_code);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative py-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="light-ray light-ray-1"></div>
          <div className="light-ray light-ray-2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-4 flex-wrap">
            <Link href="/" className="text-white/60 hover:text-white transition">Home</Link>
            <span className="text-white/40">/</span>
            <Link href="/products" className="text-white/60 hover:text-white transition">Products</Link>
            <span className="text-white/40">/</span>
            <span className="text-white">{product.item_code}</span>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Product Image */}
            <div className="backdrop-blur-xl bg-white/5 border-2 border-white/20 rounded-xl p-4 hover:border-white/40 transition-all">
              <div className="bg-white/10 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.item_name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-20 h-20 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 glow-text leading-tight">{product.item_name}</h1>
                <p className="text-white/60 text-sm">{product.item_code}</p>
                {product.brand && (
                  <p className="text-white/80 text-base mt-1">Brand: <span className="font-semibold">{product.brand}</span></p>
                )}
                {product.category_list && (
                  <p className="text-white/60 text-sm mt-1">Category: {product.category_list}</p>
                )}
              </div>

              {/* Price */}
              <div className="backdrop-blur-xl bg-white/5 border-2 border-white/20 rounded-xl p-4">
                <div className="text-2xl font-bold text-white mb-1">AED {product.selling_price.toFixed(2)}</div>
                <div className="text-white/60 text-sm">Price per {product.stock_uom}</div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToWishlist}
                  className={`px-6 py-3 rounded-lg border-2 transition flex items-center gap-2 text-sm ${
                    isInWishlist(product.item_code)
                      ? 'bg-white text-black border-white'
                      : 'border-white/20 text-white hover:border-white/60'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isInWishlist(product.item_code) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{isInWishlist(product.item_code) ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* QR Codes */}
              {product.all_barcodes.length > 0 && (
                <div className="backdrop-blur-xl bg-white/5 border-2 border-white/20 rounded-xl p-4">
                  <h3 className="text-base font-semibold text-white mb-2">QR Codes</h3>
                  <div className="flex flex-wrap gap-4">
                    {product.all_barcodes.map((barcode, index) => (
                      <div key={index} className="bg-white p-2 rounded-lg">
                        <QRCodeSVG 
                          value={barcode} 
                          size={80}
                          level="M"
                          includeMargin={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="backdrop-blur-xl bg-white/5 border-2 border-white/20 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Description</h2>
              <div 
                className="text-white/80 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {/* Related Items */}
          {product.related_items.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6 text-center">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {product.related_items.map((item) => (
                  <Link
                    key={item.item_code}
                    href={`/product/${item.item_code}`}
                    className="backdrop-blur-xl bg-white/5 border-2 border-white/20 rounded-xl p-4 hover:border-white/60 hover:bg-white/10 transition-all duration-500 hover:scale-105 block"
                  >
                    <div className="bg-white/10 rounded-lg h-32 mb-3 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.item_name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-2">{item.item_name}</h3>
                    {item.brand && <p className="text-xs text-white/60 mb-2">{item.brand}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-white">AED {item.price.toFixed(2)}</span>
                      <span className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded">{item.type}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
