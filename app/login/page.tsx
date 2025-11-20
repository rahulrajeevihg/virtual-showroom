"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 bg-black">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Image
              src="/LEDWORLD-LOGO-2024-1-1.png"
              alt="LED World"
              width={180}
              height={54}
              className="brightness-0 invert h-10 sm:h-12 w-auto"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-white/70">
            Sign in to access LED World Showroom
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-200 text-xs sm:text-sm">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-white/90 text-xs sm:text-sm font-medium mb-2">
                Username / Email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username or email"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-white/90 text-xs sm:text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition"
                required
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-white text-black font-semibold py-2.5 sm:py-3 px-6 text-sm sm:text-base rounded-lg hover:bg-white/90 disabled:bg-white/50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <p className="text-center text-white/50 text-xs sm:text-sm mt-4 sm:mt-6">
          Use your ERPNext credentials to sign in
        </p>
      </div>
    </div>
  );
}
