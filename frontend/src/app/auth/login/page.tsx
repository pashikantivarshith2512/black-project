'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    const res = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.data) {
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      setError(res.message || 'Invalid login credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="p-8 rounded-3xl bg-espresso-800/80 border border-ikigai-border space-y-6 shadow-2xl glass-panel">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full border border-ikigai-gold bg-espresso-900 flex items-center justify-center mx-auto text-ikigai-gold">
            <LogIn size={24} />
          </div>
          <h1 className="font-serif text-2xl font-bold gold-gradient-text">Welcome Back</h1>
          <p className="text-xs text-ikigai-cream/70">Sign in to your IKIGAI Café account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs text-ikigai-cream/70 flex items-center space-x-1">
              <Mail size={12} className="text-ikigai-gold" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-3 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
              placeholder="e.g. admin@cafeikigai.com or customer@cafeikigai.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-ikigai-cream/70 flex items-center space-x-1">
              <Lock size={12} className="text-ikigai-gold" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-3 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center space-x-2">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gold-gradient-btn w-full py-3.5 rounded-xl font-bold text-xs shadow-lg disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-ikigai-border/40 text-xs text-ikigai-cream/60">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-ikigai-gold hover:underline font-semibold">
            Create One
          </Link>
        </div>

      </div>
    </div>
  );
}
