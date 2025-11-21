"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Hide header on scroll down, show on scroll up (mobile only)
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (window.innerWidth < 768) {
        setShowHeader(currentY < 50 || currentY < lastScrollY);
        setLastScrollY(currentY);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setIsMenuOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 transition-transform duration-300 md:translate-y-0 ${showHeader ? 'translate-y-0' : '-translate-y-full'} md:block`}
      style={{ willChange: 'transform' }}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/LEDWORLD-LOGO-2024-1-1.png" 
              alt="LED World" 
              className="h-10 w-auto brightness-0 invert"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/zones" className="text-white hover:text-white/70 transition">
              Zones
            </Link>
            <Link href="/planar-view" className="text-white hover:text-white/70 transition">
              Floor Plan
            </Link>
            <Link href="/products" className="text-white hover:text-white/70 transition">
              All Products
            </Link>
            {/* Search Bar (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="ml-4 flex items-center">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 w-48"
              />
              <button type="submit" className="ml-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/20 transition">
                Search
              </button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* User Info & Logout (Desktop) */}
            {user && (
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-white/70 text-sm">
                  {user.full_name || user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg border border-white/20 transition"
                >
                  Logout
                </button>
              </div>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-slide-up">
            <Link href="/zones" className="block text-white hover:text-white/70 transition">
              Zones
            </Link>
            <Link href="/planar-view" className="block text-white hover:text-white/70 transition">
              Floor Plan
            </Link>
            <Link href="/products" className="block text-white hover:text-white/70 transition">
              All Products
            </Link>
            {/* Search Bar (Mobile) */}
            <form onSubmit={handleSearchSubmit} className="pt-2 flex items-center">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 w-full"
              />
              <button type="submit" className="ml-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/20 transition">
                Search
              </button>
            </form>
            {user && (
              <>
                <div className="border-t border-white/20 pt-3 mt-3">
                  <span className="block text-white/70 text-sm mb-3">
                    {user.full_name || user.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg border border-white/20 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
