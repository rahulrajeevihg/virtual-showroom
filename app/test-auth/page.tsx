"use client";

import { useState } from 'react';
import { fetchZoneProducts, getItemFullDetails } from '@/lib/erpnext-api';

export default function TestAuthPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testFetchProducts = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const products = await fetchZoneProducts();
      setResult({
        success: true,
        message: `Successfully fetched ${products.length} products`,
        sampleData: products.slice(0, 3), // Show first 3 products
        totalProducts: products.length
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const testFetchItemDetails = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // First get a product to test with
      const products = await fetchZoneProducts();
      if (products.length === 0) {
        setError('No products found to test with');
        setLoading(false);
        return;
      }

      const testItemCode = products[0].item_code;
      const details = await getItemFullDetails(testItemCode);
      
      if (details) {
        setResult({
          success: true,
          message: `Successfully fetched details for item: ${testItemCode}`,
          data: details
        });
      } else {
        setError('Failed to fetch item details');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch item details');
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPICall = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch(
        'https://erp.ihgind.com/api/method/qcshr.controller.api.zone_products_list',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setResult({
          success: true,
          status: response.status,
          statusText: response.statusText,
          message: `API call successful! Received ${data.message?.length || 0} products`,
          headers: {
            'content-type': response.headers.get('content-type'),
          }
        });
      } else {
        setError(`API Error: ${response.status} - ${response.statusText}`);
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
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">
          ERPNext Authentication Test
        </h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Token Info</h2>
          <div className="space-y-2 text-white/70 text-sm font-mono">
            <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_ERPNEXT_URL}</p>
            <p><strong>Token:</strong> {process.env.NEXT_PUBLIC_API_TOKEN?.substring(0, 20)}...</p>
          </div>
        </div>

        <div className="grid gap-4 mb-8">
          <button
            onClick={testDirectAPICall}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Testing...' : 'Test 1: Direct API Call'}
          </button>

          <button
            onClick={testFetchProducts}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Testing...' : 'Test 2: Fetch All Products'}
          </button>

          <button
            onClick={testFetchItemDetails}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Testing...' : 'Test 3: Fetch Item Details'}
          </button>
        </div>

        {loading && (
          <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4 mb-4">
            <p className="text-yellow-200 font-semibold">Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-600/20 border border-red-600 rounded-lg p-4 mb-4">
            <h3 className="text-red-200 font-semibold mb-2">Error:</h3>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

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
      </div>
    </div>
  );
}
