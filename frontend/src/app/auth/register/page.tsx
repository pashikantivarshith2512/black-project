'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/services/api';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    setError(null);

    const res = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
    });

    if (res.success && res.data) {
      login(res.data.token, res.data.user);
      router.push('/loyalty');
    } else {
      setError(res.message || 'Registration failed.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="p-8 rounded-3xl bg-espresso-800/80 border border-ikigai-border space-y-6 shadow-2xl glass-panel">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full border border-ikigai-gold bg-espresso-900 flex items-center justify-center mx-auto text-ikigai-gold">
            <UserPlus size={24} />
          </div>
          <h1 className="font-serif text-2xl font-bold gold-gradient-text">Join IKIGAI Circle</h1>
          <p className="text-xs text-ikigai-cream/70">Create an account & get 50 Welcome Loyalty Points</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs text-ikigai-cream/70 flex items-center space-x-1">
              <User size={12} className="text-ikigai-gold" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-2.5 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
              placeholder="e.g. Aarav Sharma"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-ikigai-cream/70 flex items-center space-x-1">
              <Mail size={12} className="text-ikigai-gold" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-2.5 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
              placeholder="e.g. aarav@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-ikigai-cream/70 flex items-center space-x-1">
              <Phone size={12} className="text-ikigai-gold" />
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-2.5 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
              placeholder="e.g. 09876543210"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-ikigai-cream/70 flex items-center space-x-1">
              <Lock size={12} className="text-ikigai-gold" />
              <span>Password *</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-2.5 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
              placeholder="At least 6 characters"
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
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-ikigai-border/40 text-xs text-ikigai-cream/60">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-ikigai-gold hover:underline font-semibold">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
