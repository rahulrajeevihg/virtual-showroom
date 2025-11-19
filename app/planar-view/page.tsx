'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PlanarViewPage() {
  const router = useRouter();
  const imageRef = useRef<HTMLImageElement>(null);
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Define zone areas as percentages of the image (adjust based on actual planar-view.png layout)
  // Format: [x%, y%, width%, height%]
  const zoneAreas = [
    { id: 1, name: 'Zone 1', coords: [10, 10, 35, 35] },
    { id: 2, name: 'Zone 2', coords: [50, 10, 35, 35] },
    { id: 3, name: 'Zone 3', coords: [10, 50, 35, 35] },
    { id: 4, name: 'Zone 4', coords: [50, 50, 35, 35] },
    { id: 5, name: 'Zone 5', coords: [10, 90, 35, 35] },
    { id: 6, name: 'Zone 6', coords: [50, 90, 35, 35] },
    { id: 7, name: 'Zone 7', coords: [10, 130, 35, 35] },
    { id: 8, name: 'Zone 8', coords: [50, 130, 35, 35] },
  ];

  const handleZoneClick = (zoneId: number) => {
    router.push(`/zone/${zoneId}`);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Check which zone was clicked
    const clickedZone = zoneAreas.find(zone => {
      const [zoneX, zoneY, zoneWidth, zoneHeight] = zone.coords;
      return x >= zoneX && x <= zoneX + zoneWidth && 
             y >= zoneY && y <= zoneY + zoneHeight;
    });

    if (clickedZone) {
      handleZoneClick(clickedZone.id);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Showroom Planar View
          </h1>
          <p className="text-white/70 text-lg">
            Click on any zone to explore products
          </p>
        </div>

        {/* Planar View Image with Interactive Zones */}
        <div className="relative max-w-6xl mx-auto">
          <div 
            className="relative group cursor-pointer"
            onClick={handleImageClick}
          >
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl animate-pulse flex items-center justify-center">
                <div className="text-white/50">Loading planar view...</div>
              </div>
            )}

            {/* Main Image */}
            <img
              ref={imageRef}
              src="/planar-view.png"
              alt="Showroom Planar View"
              className={`w-full h-auto rounded-2xl border-2 border-white/20 shadow-2xl transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Interactive Overlay Zones */}
            {imageLoaded && zoneAreas.map((zone) => (
              <div
                key={zone.id}
                className={`absolute transition-all duration-300 cursor-pointer ${
                  hoveredZone === zone.id 
                    ? 'bg-white/30 backdrop-blur-sm border-2 border-white' 
                    : 'bg-white/0 border-2 border-white/0 hover:bg-white/20 hover:border-white/50'
                }`}
                style={{
                  left: `${zone.coords[0]}%`,
                  top: `${zone.coords[1]}%`,
                  width: `${zone.coords[2]}%`,
                  height: `${zone.coords[3]}%`,
                }}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoneClick(zone.id);
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`text-white font-bold text-xl transition-all duration-300 ${
                    hoveredZone === zone.id ? 'scale-150' : 'scale-0'
                  }`}>
                    {zone.name}
                  </div>
                </div>
              </div>
            ))}

            {/* Instruction overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center pointer-events-none">
              <div className="text-white text-xl font-semibold">
                Click on any zone to explore
              </div>
            </div>
          </div>

          {/* Zone Legend */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {zoneAreas.map((zone) => (
              <button
                key={zone.id}
                onClick={() => handleZoneClick(zone.id)}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                className={`p-4 rounded-xl backdrop-blur-xl border-2 transition-all duration-300 ${
                  hoveredZone === zone.id
                    ? 'bg-white/20 border-white scale-105'
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40'
                }`}
              >
                <div className="text-3xl font-bold text-white mb-2">
                  {zone.id}
                </div>
                <div className="text-sm text-white/70">
                  {zone.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 backdrop-blur-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
