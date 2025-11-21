"use client";

import { useState, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface ZonePolygon {
  id: number;
  name: string;
  points: number[][];
  labelPosition?: [number, number];
}

// Move static data outside component to prevent recreation
const ZONE_AREAS: ZonePolygon[] = [
  { id: 1, name: 'Zone 1', points: [[1.02, 1.05], [33.18, 1.17], [33.35, 15.24], [0.68, 15.37]], labelPosition: [15.91, 7.08] },
  { id: 2, name: 'Zone 2', points: [[1.02, 15.95], [33.35, 15.83], [33.35, 41.58], [0.85, 41.58]], labelPosition: [14.22, 27.01] },
  { id: 3, name: 'Zone 3', points: [[33.35, 58.53], [33.52, 42.08], [0.51, 42.33], [0.85, 58.41]], labelPosition: [15.58, 50.87] },
  { id: 4, name: 'Zone 4', points: [[0.68, 59.08], [38.60, 59.33], [38.94, 98.52], [1.02, 98.39]], labelPosition: [16.93, 75.62] },
  { id: 5, name: 'Zone 5', points: [[97.80, 98], [97.97, 81], [58.48, 81.10], [58.13, 97.96]], labelPosition: [77, 89] },
  { id: 6, name: 'Zone 6', points: [[98.23, 80.46], [97.74, 64.35], [58.24, 64.35], [58.58, 80.18]], labelPosition: [78.89, 73.40] },
  { id: 7, name: 'Zone 7', points: [[97.86, 63.52], [97.86, 19.68], [58.18, 19.64], [58.58, 63.10]], labelPosition: [76.52, 42.62] },
  { id: 8, name: 'Zone 8', points: [[97.69, 19.05], [97.63, 1.47], [34.31, 1.47], [34.20, 18.80]], labelPosition: [61.63, 9.42] },
  { id: 9, name: 'Zone 9', points: [[39.11, 98.35], [57.90, 98.60], [57.22, 19.97], [34.20, 19.72],[34.20,58.79],[39.28,59.04]], labelPosition: [47.74, 50.75] },
];

export default function Home() {
  const router = useRouter();
  const imageRef = useRef<HTMLImageElement>(null);
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Memoize point-in-polygon check
  const isPointInPolygon = useCallback((point: [number, number], polygon: number[][]): boolean => {
    const [x, y] = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }, []);

  const handleZoneClick = useCallback((zoneId: number) => {
    router.push(`/zone/${zoneId}`);
  }, [router]);

  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const clickedZone = ZONE_AREAS.find(zone => isPointInPolygon([x, y], zone.points));
    if (clickedZone) handleZoneClick(clickedZone.id);
  }, [isPointInPolygon, handleZoneClick]);

  return (
    <div className="min-h-screen py-4 md:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            LED World Showroom
          </h1>
          <p className="text-white/70 text-sm md:text-base">
            Click on any zone on the map or use buttons below
          </p>
        </div>

        {/* Zone Labels Above Image */}
        <div className="max-w-4xl mx-auto mb-3">
          <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm text-white/60">
            {ZONE_AREAS.map((zone) => (
              <span key={zone.id} className="px-2 py-1">
                Zone {zone.id}
              </span>
            ))}
          </div>
        </div>

        {/* Planar View Image with Interactive Zones */}
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto">
          <div 
            className="relative group cursor-pointer"
            onClick={handleImageClick}
          >
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-white/5 rounded-xl md:rounded-2xl animate-pulse flex items-center justify-center">
                <div className="text-white/50 text-sm">Loading floor plan...</div>
              </div>
            )}

            {/* Main Image */}
            <Image
              ref={imageRef as any}
              src="/planar-view.png"
              alt="Showroom Floor Plan"
              width={1920}
              height={1080}
              priority
              quality={90}
              className={`w-full h-auto rounded-xl md:rounded-2xl border border-white/20 shadow-2xl transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />

            {/* SVG Overlay for Polygon Zones */}
            {imageLoaded && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ willChange: 'transform' }}
              >
                {ZONE_AREAS.map((zone, index) => {
                  const polygonPoints = zone.points.map(([x, y]) => `${x},${y}`).join(' ');
                  return (
                    <g key={zone.id}>
                      <polygon
                        points={polygonPoints}
                        className={`cursor-pointer transition-all duration-300 pointer-events-auto ${
                          hoveredZone === zone.id
                            ? 'fill-white/30 stroke-white stroke-[0.5]'
                            : 'fill-white/0 stroke-white/0 hover:fill-white/20 hover:stroke-white/50 hover:stroke-[0.3]'
                        }`}
                        style={{ willChange: 'fill, stroke' }}
                        onMouseEnter={() => setHoveredZone(zone.id)}
                        onMouseLeave={() => setHoveredZone(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleZoneClick(zone.id);
                        }}
                      />
                      {/* Always show labels with animation */}
                      {zone.labelPosition && (
                        <text
                          x={zone.labelPosition[0]}
                          y={zone.labelPosition[1]}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={`fill-white font-bold text-[3px] md:text-[4px] pointer-events-none drop-shadow-lg transition-all duration-300 ${
                            hoveredZone === zone.id ? 'opacity-100' : 'opacity-70'
                          }`}
                          style={{ 
                            textShadow: '0 0 10px rgba(0,0,0,0.8)',
                            animation: `fadeInScale 0.5s ease-out ${index * 0.1}s backwards`,
                            transformOrigin: 'center',
                            transform: hoveredZone === zone.id ? 'scale(1.15)' : 'scale(1)'
                          }}
                        >
                          {zone.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
        </div>

        {/* Zone Buttons Below Image */}
        <div className="max-w-4xl mx-auto mt-6 md:mt-8">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {ZONE_AREAS.map((zone) => (
              <button
                key={zone.id}
                onClick={() => handleZoneClick(zone.id)}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                className={`p-3 md:p-4 rounded-lg backdrop-blur-sm border-2 transition-all duration-300 ${
                  hoveredZone === zone.id
                    ? 'bg-white/20 border-white scale-105'
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40'
                }`}
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {zone.id}
                </div>
                <div className="text-xs md:text-sm text-white/70">
                  {zone.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Quick Links */}
        <div className="text-center mt-8 md:mt-12 flex flex-wrap justify-center gap-3 md:gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/10 hover:bg-white/20 text-white text-sm md:text-base rounded-lg md:rounded-xl border border-white/20 backdrop-blur-sm transition-all"
          >
            <span>Browse All Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
