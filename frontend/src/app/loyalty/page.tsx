'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Award, Gift, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';
import { fetchApi } from '@/services/api';
import { LoyaltyAccount } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function LoyaltyPage() {
  const { user } = useAuth();
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLoyalty() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await fetchApi<LoyaltyAccount>('/loyalty/me');
      if (res.success && res.data) {
        setAccount(res.data);
      }
      setLoading(false);
    }
    loadLoyalty();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold text-ikigai-gold tracking-widest uppercase">Privilege Circle</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold gold-gradient-text">IKIGAI Loyalty Rewards</h1>
        <p className="text-sm text-ikigai-cream/70 max-w-md mx-auto">
          Earn points on every coffee & dining experience. Redeem points for artisanal beverages & exclusive perks.
        </p>
      </div>

      {!user ? (
        <div className="p-10 rounded-3xl bg-espresso-800/60 border border-ikigai-border text-center space-y-6 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full border border-ikigai-gold bg-espresso-900 flex items-center justify-center mx-auto text-ikigai-gold">
            <Gift size={32} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-ikigai-cream">Sign In to View Rewards</h2>
          <p className="text-xs text-ikigai-cream/70">
            Create an account today and instantly receive <strong>50 Welcome Bonus Points</strong>!
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/login" className="gold-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold">
              Sign In
            </Link>
            <Link href="/auth/register" className="px-6 py-2.5 rounded-xl border border-ikigai-gold text-ikigai-gold text-xs font-semibold hover:bg-ikigai-gold/10">
              Create Account
            </Link>
          </div>
        </div>
      ) : loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-ikigai-gold border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Account Balance Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-espresso-800 via-espresso-850 to-espresso-900 border border-ikigai-gold/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-semibold text-ikigai-gold uppercase tracking-widest">Active Balance</span>
              <div className="font-serif text-5xl font-bold text-ikigai-cream">
                {account?.points || 0} <span className="text-xl text-ikigai-gold font-sans font-medium">Points</span>
              </div>
              <p className="text-xs text-ikigai-cream/60">Total points earned so far: {account?.totalEarned || 0}</p>
            </div>

            <div className="p-4 rounded-2xl bg-espresso-950/80 border border-ikigai-border space-y-2 text-xs text-ikigai-cream/80 max-w-xs">
              <div className="flex items-center space-x-2 text-ikigai-gold font-bold">
                <ShieldCheck size={16} />
                <span>Earning Rule</span>
              </div>
              <p>Earn 1 Loyalty Point for every ₹10 spent on online orders or dine-in reservations!</p>
            </div>
          </div>

          {/* History */}
          <div className="p-6 rounded-2xl bg-espresso-800/60 border border-ikigai-border space-y-4">
            <h3 className="font-serif text-xl font-bold text-ikigai-gold">Points Transaction History</h3>
            
            {account?.history.length === 0 ? (
              <p className="text-xs text-ikigai-cream/60 py-4">No points transactions recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {account?.history.map((tx) => (
                  <div key={tx.id} className="p-3.5 rounded-xl bg-espresso-900 border border-ikigai-border/60 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${tx.type === 'EARNED' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                        {tx.type === 'EARNED' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      </div>
                      <div>
                        <div className="font-semibold text-ikigai-cream">{tx.description}</div>
                        <div className="text-[10px] text-ikigai-cream/50">{new Date(tx.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <span className={`font-mono font-bold text-sm ${tx.type === 'EARNED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {tx.type === 'EARNED' ? `+${tx.points}` : tx.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
