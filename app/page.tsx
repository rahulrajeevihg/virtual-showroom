"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([]);
  const [shootingStars, setShootingStars] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  const zones = [
    { id: '1', name: 'Zone 1' },
    { id: '2', name: 'Zone 2' },
    { id: '3', name: 'Zone 3' },
    { id: '4', name: 'Zone 4' },
    { id: '5', name: 'Zone 5' },
    { id: '6', name: 'Zone 6' },
    { id: '7', name: 'Zone 7' },
    { id: '8', name: 'Zone 8' },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    // Generate stars for universe background with varied properties
    const newStars = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 3, // Vary duration more
    }));
    setStars(newStars);

    // Generate shooting stars with varied trajectories
    const newShootingStars = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 50,
      delay: Math.random() * 15 + 2, // More spread out timing
    }));
    setShootingStars(newShootingStars);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Universe Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Deep Space Background - Much Darker */}
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-950" />
        
        {/* Milky Way Effect */}
        <div 
          className="absolute top-0 left-1/4 w-[200%] h-32 bg-gradient-to-r from-transparent via-white to-transparent opacity-5 blur-3xl animate-milky-way"
          style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
        />
        <div 
          className="absolute top-1/3 right-0 w-[180%] h-40 bg-gradient-to-l from-transparent via-purple-300 to-transparent opacity-5 blur-3xl animate-milky-way"
          style={{ transform: 'rotate(-50deg)', animationDelay: '20s', animationDuration: '100s' }}
        />
        
        {/* Stars - Twinkling effect */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              boxShadow: '0 0 4px rgba(255,255,255,0.8)',
            }}
          />
        ))}

        {/* Shooting Stars */}
        {shootingStars.map((star) => (
          <div
            key={`shooting-${star.id}`}
            className="absolute animate-shooting-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDelay: `${star.delay}s`,
            }}
          >
            <div className="w-1 h-1 bg-white rounded-full" style={{
              boxShadow: '0 0 20px 2px rgba(255,255,255,0.8), 0 0 40px 4px rgba(200,200,255,0.4)',
            }} />
            <div className="absolute w-24 h-[2px] bg-gradient-to-r from-white to-transparent -translate-y-[1px]" style={{
              opacity: 0.6,
            }} />
          </div>
        ))}

        {/* Additional bright stars (planets/distant stars) */}
        <div className="absolute top-[15%] left-[20%] w-2 h-2 rounded-full bg-blue-100 animate-twinkle-fast" style={{ boxShadow: '0 0 10px 2px rgba(200,220,255,0.6)', animationDelay: '0.5s' }} />
        <div className="absolute top-[40%] right-[25%] w-2.5 h-2.5 rounded-full bg-yellow-50 animate-twinkle-fast" style={{ boxShadow: '0 0 12px 3px rgba(255,250,200,0.6)', animationDelay: '1.2s' }} />
        <div className="absolute bottom-[30%] left-[15%] w-1.5 h-1.5 rounded-full bg-purple-100 animate-twinkle-fast" style={{ boxShadow: '0 0 8px 2px rgba(220,200,255,0.6)', animationDelay: '2s' }} />
        <div className="absolute top-[60%] right-[40%] w-2 h-2 rounded-full bg-red-50 animate-twinkle-fast" style={{ boxShadow: '0 0 10px 2px rgba(255,200,200,0.5)', animationDelay: '0.8s' }} />
        
        {/* Nebula clouds */}
        <div className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full bg-purple-500 opacity-5 blur-[100px] animate-drift" style={{ animationDuration: '60s' }} />
        <div className="absolute bottom-[25%] left-[15%] w-80 h-80 rounded-full bg-blue-500 opacity-5 blur-[120px] animate-drift" style={{ animationDuration: '80s', animationDelay: '10s' }} />
        
        {/* Spotlight effect following cursor */}
        <div
          className="absolute w-96 h-96 rounded-full pointer-events-none"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
            transition: 'left 0.3s ease-out, top 0.3s ease-out',
          }}
        />
      </div>

      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <img 
              src="/LEDWORLD-LOGO-2024-1-1.png" 
              alt="LED World" 
              className="h-24 md:h-32 w-auto mx-auto animate-fade-in brightness-0 invert"
              style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(255,255,255,0.5))' }}
            />
          </div>
          <p className="text-2xl text-white animate-slide-up opacity-0 animation-delay-200 font-light tracking-wide">
            <span className="glow-text-subtle">Virtual Showroom Assistant</span>
          </p>
          <p className="text-lg text-white/70 mt-2 animate-slide-up opacity-0 animation-delay-300">
            Illuminate Your Space - Select a Zone to Explore
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {zones.map((zone, index) => (
            <Link
              href={`/zone/${zone.id}`}
              key={zone.id}
              className="group relative text-white p-10 rounded-3xl border-2 border-white/30 backdrop-blur-xl bg-white/5 transform transition-all duration-700 hover:scale-110 hover:bg-white/10 hover:border-white/60 animate-slide-up opacity-0 overflow-hidden shadow-2xl shadow-white/10 block"
              style={{ animationDelay: `${index * 150 + 500}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent animate-shimmer"></div>
                <div className="absolute inset-0 shadow-glow"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="text-6xl font-extrabold mb-3 transition-all duration-700 group-hover:scale-125">
                  {zone.id}
                </div>
                <div className="text-2xl font-semibold tracking-wide mb-4">{zone.name}</div>
                
                {/* Animated border line */}
                <div className="relative h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </div>

                {/* Corner accents */}
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 group-hover:animate-ripple border-2 border-white"></div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-20 animate-fade-in opacity-0 animation-delay-1200">
          <p className="text-white/60 text-sm tracking-widest uppercase mb-6">
            Experience Premium Lighting Solutions
          </p>
          <div className="flex justify-center gap-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full animate-glow-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </main>

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-black opacity-60"></div>
    </div>
  );
}
