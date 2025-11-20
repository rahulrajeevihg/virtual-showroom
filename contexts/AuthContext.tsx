"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  full_name: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('ledworld_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Ensure cookie is set if user exists
        document.cookie = 'ledworld_auth=true; path=/; max-age=86400';
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('ledworld_user');
        document.cookie = 'ledworld_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
      localStorage.setItem('ledworld_user', JSON.stringify(data.user));
      // Set auth cookie for middleware
      document.cookie = 'ledworld_auth=true; path=/; max-age=86400'; // 24 hours
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('ledworld_user');
      // Remove auth cookie
      document.cookie = 'ledworld_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
