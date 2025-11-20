"use client";

import { useState } from 'react';

export default function TestLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test login with ERPNext
      const response = await fetch('https://erp.ihgind.com/api/method/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usr: username,
          pwd: password,
        }),
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          status: response.status,
          message: 'Login successful!',
          userData: data,
          cookies: document.cookie, // Show received cookies
        });
      } else {
        setError(`Login failed: ${data.message || response.statusText}`);
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Network error during login');
    } finally {
      setLoading(false);
    }
  };

  const testLogout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://erp.ihgind.com/api/method/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setResult({
          success: true,
          message: 'Logout successful!',
        });
      } else {
        setError('Logout failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error during logout');
    } finally {
      setLoading(false);
    }
  };

  const testAuthenticatedCall = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch products with session cookies
      const response = await fetch(
        'https://erp.ihgind.com/api/method/qcshr.controller.api.zone_products_list',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Use session cookies
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `Authenticated call successful! Fetched ${data.message?.length || 0} products`,
          productsCount: data.message?.length || 0,
        });
      } else {
        setError(`API call failed: ${response.status}`);
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-8">
          ERPNext Login Test
        </h1>

        {/* Login Form */}
        <form onSubmit={testLogin} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Login Credentials</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-white/70 text-sm mb-2">
                Username / Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username or email"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                required
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Testing Login...' : 'Test Login'}
          </button>
        </form>

        {/* Additional Test Buttons */}
        <div className="grid gap-4 mb-8">
          <button
            onClick={testAuthenticatedCall}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Testing...' : 'Test Authenticated API Call'}
          </button>

          <button
            onClick={testLogout}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Testing...' : 'Test Logout'}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4 mb-4">
            <p className="text-yellow-200 font-semibold">Processing...</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-600/20 border border-red-600 rounded-lg p-4 mb-4">
            <h3 className="text-red-200 font-semibold mb-2">Error:</h3>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Success Display */}
        {result && (
          <div className={`${result.success ? 'bg-green-600/20 border-green-600' : 'bg-red-600/20 border-red-600'} border rounded-lg p-4`}>
            <h3 className={`${result.success ? 'text-green-200' : 'text-red-200'} font-semibold mb-2`}>
              {result.success ? '✓ Success' : '✗ Failed'}
            </h3>
            <div className="text-white/80 text-sm space-y-2">
              {result.message && <p className="font-semibold">{result.message}</p>}
              <pre className="bg-black/30 p-3 rounded overflow-auto max-h-96 text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white/5 rounded-lg p-4 mt-6">
          <h3 className="text-white font-semibold mb-2">How to Test:</h3>
          <ol className="text-white/70 text-sm space-y-2 list-decimal list-inside">
            <li>Enter your ERPNext username/email and password</li>
            <li>Click &quot;Test Login&quot; to authenticate</li>
            <li>If successful, you&apos;ll see session cookies and user data</li>
            <li>Click &quot;Test Authenticated API Call&quot; to verify the session works</li>
            <li>Click &quot;Test Logout&quot; to end the session</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
