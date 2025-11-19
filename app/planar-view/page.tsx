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
      points: [[1.02, 1.05], [33.18, 1.17], [33.35, 15.24], [0.68, 15.37]], // Top-left rectangular area
      labelPosition: [15.91, 7.08]
    },
    { 
      id: 2, 
      name: 'Zone 2', 
      points: [[1.02, 15.95], [33.35, 15.83], [33.35, 41.58], [0.85, 41.58]], // Top-center
      labelPosition: [14.22, 27.01]
    },
    { 
      id: 3, 
      name: 'Zone 3', 
      points: [[33.35, 58.53], [33.52, 42.08], [0.51, 42.33], [0.85, 58.41]], // Top-right
      labelPosition: [15.58, 50.87]
    },
    { 
      id: 4, 
      name: 'Zone 4', 
      points: [[0.68, 59.08], [38.60, 59.33], [38.94, 98.52], [1.02, 98.39]], // Middle-left
      labelPosition: [16.93, 75.62]
    },
    { 
      id: 5, 
      name: 'Zone 5', 
      points: [[97.80, 98], [97.97, 81], [58.48, 81.10], [58.13, 97.96]], // Center
      labelPosition: [77, 89]
    },
    { 
      id: 6, 
      name: 'Zone 6', 
      points: [[98.23, 80.46], [97.74, 64.35], [58.24, 64.35], [58.58, 80.18]], // Middle-right
      labelPosition: [78.89, 73.40]
    },
    { 
      id: 7, 
      name: 'Zone 7', 
      points: [[97.86, 63.52], [97.86, 19.68], [58.18, 19.64], [58.58, 63.10]], // Bottom-left
      labelPosition: [76.52, 42.62]
    },
    { 
      id: 8, 
      name: 'Zone 8', 
      points: [[97.69, 19.05], [97.63, 1.47], [34.31, 1.47], [34.20, 18.80]], // Bottom-right
      labelPosition: [61.63, 9.42]
    },
    { 
      id: 9, 
      name: 'Zone 9', 
      points: [[39.11, 98.35], [57.90, 98.60], [57.22, 19.97], [34.20, 19.72],[34.20,58.79],[39.28,59.04]], // Bottom-right
      labelPosition: [47.74, 50.75]
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
