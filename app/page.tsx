"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ZonePolygon {
  id: number;
  name: string;
  points: number[][];
  labelPosition?: [number, number];
}

export default function Home() {
  const router = useRouter();
  const imageRef = useRef<HTMLImageElement>(null);
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showClickHelper, setShowClickHelper] = useState(false);
  const [clickCoords, setClickCoords] = useState<{x: number, y: number} | null>(null);

  const zoneAreas: ZonePolygon[] = [
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

  const isPointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
    const [x, y] = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const handleZoneClick = (zoneId: number) => {
    router.push(`/zone/${zoneId}`);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (showClickHelper) {
      setClickCoords({ x, y });
      console.log(`Clicked at: [${x.toFixed(2)}, ${y.toFixed(2)}]`);
      return;
    }
    const clickedZone = zoneAreas.find(zone => isPointInPolygon([x, y], zone.points));
    if (clickedZone) handleZoneClick(clickedZone.id);
  };

  return (
    <div className="min-h-screen py-4 md:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
            LED World Showroom
          </h1>
          <p className="text-white/70 text-sm md:text-lg">
            Click on any zone to explore products
          </p>
        </div>

        {/* Planar View Image with Interactive Zones */}
        <div className="relative max-w-4xl mx-auto">
          <div 
            className="relative group cursor-pointer"
            onClick={handleImageClick}
          >
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-xl md:rounded-2xl animate-pulse flex items-center justify-center">
                <div className="text-white/50 text-sm">Loading floor plan...</div>
              </div>
            )}

            {/* Main Image */}
            <img
              ref={imageRef}
              src="/planar-view.png"
              alt="Showroom Floor Plan"
              className={`w-full h-auto rounded-xl md:rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 ${
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
              >
                {zoneAreas.map((zone) => {
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
                        onMouseEnter={() => setHoveredZone(zone.id)}
                        onMouseLeave={() => setHoveredZone(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleZoneClick(zone.id);
                        }}
                      />
                      {zone.labelPosition && hoveredZone === zone.id && (
                        <text
                          x={zone.labelPosition[0]}
                          y={zone.labelPosition[1]}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-white font-bold text-[4px] pointer-events-none drop-shadow-lg"
                          style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}
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

        {/* Quick Links */}
        <div className="text-center mt-6 md:mt-12 flex flex-wrap justify-center gap-3 md:gap-4">
          <Link
            href="/zones"
            className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/10 hover:bg-white/20 text-white text-sm md:text-base rounded-lg md:rounded-xl border border-white/20 backdrop-blur-xl transition-all"
          >
            <span>View All Zones</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/10 hover:bg-white/20 text-white text-sm md:text-base rounded-lg md:rounded-xl border border-white/20 backdrop-blur-xl transition-all"
          >
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
