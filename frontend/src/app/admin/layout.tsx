'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Calendar, Star, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/auth/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ikigai-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-espresso-800 border border-ikigai-border text-center space-y-4">
        <ShieldAlert size={36} className="mx-auto text-amber-400" />
        <h2 className="font-serif text-xl font-bold text-ikigai-cream">Admin Access Required</h2>
        <p className="text-xs text-ikigai-cream/70">
          Please sign in with administrator credentials (e.g. admin@cafeikigai.com).
        </p>
        <Link href="/auth/login" className="gold-gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs inline-block">
          Go to Sign In
        </Link>
      </div>
    );
  }

  const adminLinks = [
    { name: 'Overview Stats', href: '/admin', icon: LayoutDashboard },
    { name: 'Menu Management', href: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Order Management', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Reservations', href: '/admin/reservations', icon: Calendar },
    { name: 'Review Moderation', href: '/admin/reviews', icon: Star },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ikigai-border pb-6">
        <div>
          <div className="flex items-center space-x-2 text-ikigai-gold text-xs font-semibold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>IKIGAI Management Portal</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-ikigai-cream">Admin Dashboard</h1>
        </div>

        <Link
          href="/"
          className="text-xs text-ikigai-cream/70 hover:text-ikigai-gold flex items-center space-x-1 border border-ikigai-border px-3 py-1.5 rounded-lg w-fit"
        >
          <ArrowLeft size={14} />
          <span>Back to Live Website</span>
        </Link>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-ikigai-border/40 no-scrollbar">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider flex items-center space-x-2 shrink-0 transition-all ${
                isActive
                  ? 'gold-gradient-btn shadow-md'
                  : 'bg-espresso-800/80 text-ikigai-cream/80 hover:text-ikigai-gold border border-ikigai-border/60'
              }`}
            >
              <Icon size={14} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Admin Content View */}
      <div>{children}</div>

    </div>
  );
}
