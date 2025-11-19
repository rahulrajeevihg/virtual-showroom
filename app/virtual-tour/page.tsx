"use client";

import { useState, useEffect } from 'react';
import { zones } from '@/lib/data';
import Link from 'next/link';

export default function VirtualTourPage() {
  const [currentZone, setCurrentZone] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentZone((prev) => (prev + 1) % zones.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  const currentZoneData = zones[currentZone];

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-bold text-white mb-12 text-center glow-text-subtle">
          Virtual Showroom Tour
        </h1>

        {/* Tour Controls */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setCurrentZone((prev) => (prev - 1 + zones.length) % zones.length)}
            className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition"
          >
            ← Previous
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-8 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition font-semibold"
          >
            {isPlaying ? '⏸ Pause Tour' : '▶ Start Auto Tour'}
          </button>
          <button
            onClick={() => setCurrentZone((prev) => (prev + 1) % zones.length)}
            className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition"
          >
            Next →
          </button>
        </div>

        {/* Zone Display */}
        <div className="bg-black border-2 border-white/20 rounded-3xl p-12 mb-8 relative overflow-hidden animate-fade-in">
          {/* Background Effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="light-ray light-ray-1"></div>
            <div className="light-ray light-ray-2"></div>
          </div>

          <div className="relative z-10 text-center">
            <div className="text-8xl font-extrabold text-white mb-6 glow-text">
              Zone {currentZoneData.id}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">{currentZoneData.name}</h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              {currentZoneData.description}
            </p>

            {/* Zone Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-white mb-1">{currentZoneData.productCount}</div>
                <div className="text-sm text-white/60">Products</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-white mb-1">{currentZone + 1}/5</div>
                <div className="text-sm text-white/60">Zone Number</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-white mb-1">★ 4.8</div>
                <div className="text-sm text-white/60">Avg Rating</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-white mb-1">✓</div>
                <div className="text-sm text-white/60">In Stock</div>
              </div>
            </div>

            <Link
              href={`/zone/${currentZoneData.id}`}
              className="inline-block px-8 py-4 bg-white text-black rounded-lg hover:bg-white/90 transition font-semibold text-lg"
            >
              Explore Zone {currentZoneData.id}
            </Link>
          </div>
        </div>

        {/* Zone Navigation Dots */}
        <div className="flex justify-center gap-3">
          {zones.map((zone, index) => (
            <button
              key={zone.id}
              onClick={() => setCurrentZone(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentZone
                  ? 'bg-white w-12'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to Zone ${zone.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
