'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ZonePolygon {
  id: number;
  name: string;
  // Polygon points as percentages [x%, y%] of image dimensions
  // Define the shape by connecting these points
  points: number[][];
  // Optional: center point for label display
  labelPosition?: [number, number];
}

export default function PlanarViewPage() {
  const router = useRouter();
  const imageRef = useRef<HTMLImageElement>(null);
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showClickHelper, setShowClickHelper] = useState(false);
  const [clickCoords, setClickCoords] = useState<{x: number, y: number} | null>(null);

  // Define zone areas as polygon coordinates (% of image width/height)
  // Each zone is defined by an array of [x%, y%] points that form its shape
  // Adjust these coordinates to match your actual planar-view.png layout
  const zoneAreas: ZonePolygon[] = [
    { 
      id: 1, 
      name: 'Zone 1', 
      points: [[5, 5], [30, 5], [30, 30], [5, 30]], // Top-left rectangular area
      labelPosition: [17.5, 17.5]
    },
    { 
      id: 2, 
      name: 'Zone 2', 
      points: [[35, 5], [60, 5], [60, 30], [35, 30]], // Top-center
      labelPosition: [47.5, 17.5]
    },
    { 
      id: 3, 
      name: 'Zone 3', 
      points: [[65, 5], [90, 5], [90, 30], [65, 30]], // Top-right
      labelPosition: [77.5, 17.5]
    },
    { 
      id: 4, 
      name: 'Zone 4', 
      points: [[5, 35], [30, 35], [30, 60], [5, 60]], // Middle-left
      labelPosition: [17.5, 47.5]
    },
    { 
      id: 5, 
      name: 'Zone 5', 
      points: [[35, 35], [60, 35], [60, 60], [35, 60]], // Center
      labelPosition: [47.5, 47.5]
    },
    { 
      id: 6, 
      name: 'Zone 6', 
      points: [[65, 35], [90, 35], [90, 60], [65, 60]], // Middle-right
      labelPosition: [77.5, 47.5]
    },
    { 
      id: 7, 
      name: 'Zone 7', 
      points: [[5, 65], [45, 65], [45, 90], [5, 90]], // Bottom-left
      labelPosition: [25, 77.5]
    },
    { 
      id: 8, 
      name: 'Zone 8', 
      points: [[50, 65], [90, 65], [90, 90], [50, 90]], // Bottom-right
      labelPosition: [70, 77.5]
    },
  ];

  // Point-in-polygon algorithm to check if click is inside a zone
  const isPointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
    const [x, y] = point;
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      
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

    // Show click coordinates for debugging (remove in production)
    if (showClickHelper) {
      setClickCoords({ x, y });
      console.log(`Clicked at: [${x.toFixed(2)}, ${y.toFixed(2)}]`);
      return;
    }

    // Check which zone was clicked using point-in-polygon
    const clickedZone = zoneAreas.find(zone => 
      isPointInPolygon([x, y], zone.points)
    );

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

            {/* SVG Overlay for Polygon Zones */}
            {imageLoaded && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {zoneAreas.map((zone) => {
                  const polygonPoints = zone.points
                    .map(([x, y]) => `${x},${y}`)
                    .join(' ');
                  
                  return (
                    <g key={zone.id}>
                      {/* Clickable polygon area */}
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
                      
                      {/* Zone label */}
                      {zone.labelPosition && hoveredZone === zone.id && (
                        <text
                          x={zone.labelPosition[0]}
                          y={zone.labelPosition[1]}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-white font-bold text-[4px] pointer-events-none drop-shadow-lg animate-scale-in"
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
            
            {/* Click coordinate helper (for adjusting zone positions) */}
            {showClickHelper && clickCoords && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${clickCoords.x}%`,
                  top: `${clickCoords.y}%`,
                }}
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-red-500 rounded-full -translate-x-2 -translate-y-2"></div>
                  <div className="absolute top-6 left-0 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    [{clickCoords.x.toFixed(2)}, {clickCoords.y.toFixed(2)}]
                  </div>
                </div>
              </div>
            )}

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

        {/* Coordinate Helper Toggle (for developers) */}
        <div className="text-center mt-8">
          <button
            onClick={() => {
              setShowClickHelper(!showClickHelper);
              setClickCoords(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showClickHelper
                ? 'bg-red-500/20 border-2 border-red-500 text-red-300'
                : 'bg-white/10 border-2 border-white/20 text-white/70 hover:bg-white/20'
            }`}
          >
            {showClickHelper ? '🔴 Click Helper ON (click image to see coordinates)' : '⚙️ Enable Click Helper'}
          </button>
          {showClickHelper && (
            <p className="text-white/50 text-xs mt-2">
              Click on the image to get coordinates. Use these to adjust zone polygon points in the code.
            </p>
          )}
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
