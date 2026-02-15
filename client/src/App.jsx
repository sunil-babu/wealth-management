import React, { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function App() {
  const [prompt, setPrompt] = useState('Analyze my portfolio allocation');
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function callVertex() {
    setError(null);
    setResp(null);
    setLoading(true);
    
    try {
      if (!prompt.trim()) {
        throw new Error('Please enter a prompt');
      }
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${API_BASE}/vertex`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `API error: ${response.status}`);
      }
      
      const data = await response.json();
      setResp(data);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.message || 'Failed to call AI service');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Wealth Management</h1>
          <p className="text-slate-300">AI-powered financial analysis platform</p>
        </header>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Question</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask about your finances, investments, or portfolio..."
            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={callVertex}
            disabled={loading}
            className={`mt-4 px-6 py-2 rounded-lg font-medium text-white transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? 'Analyzing...' : 'Get AI Analysis'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800"><strong>Error:</strong> {error}</p>
          </div>
        )}
        
        {resp && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Result</h2>
            <pre className="bg-slate-50 p-4 rounded text-sm overflow-auto max-h-96 text-slate-700">
              {JSON.stringify(resp, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>API Base: {API_BASE} | Environment: {import.meta.env.MODE}</p>
        </div>
      </div>
    </div>
  )
}

