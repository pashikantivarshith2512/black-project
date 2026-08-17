'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, DollarSign, Users, Calendar, Star, UtensilsCrossed, Clock } from 'lucide-react';
import { fetchApi } from '@/services/api';
import { AdminStats } from '@/types';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const res = await fetchApi<AdminStats>('/admin/stats');
      if (res.success && res.data) {
        setStats(res.data);
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-2 border-ikigai-gold border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const statCards = [
    { title: "Total Revenue", value: `₹${stats?.totalRevenue || 0}`, icon: DollarSign, color: "text-emerald-400" },
    { title: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "text-ikigai-gold" },
    { title: "Today's Orders", value: stats?.todayOrders || 0, icon: Clock, color: "text-amber-400" },
    { title: "Total Customers", value: stats?.totalCustomers || 0, icon: Users, color: "text-blue-400" },
    { title: "Reservations", value: stats?.totalReservations || 0, icon: Calendar, color: "text-purple-400" },
    { title: "Pending Bookings", value: stats?.pendingReservations || 0, icon: Clock, color: "text-amber-400" },
    { title: "Pending Reviews", value: stats?.pendingReviews || 0, icon: Star, color: "text-red-400" },
    { title: "Menu Items", value: stats?.totalMenuItems || 0, icon: UtensilsCrossed, color: "text-ikigai-gold" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-espresso-800/60 border border-ikigai-border space-y-2"
            >
              <div className="flex justify-between items-center text-ikigai-cream/60 text-xs">
                <span>{card.title}</span>
                <Icon size={18} className={card.color} />
              </div>
              <div className="font-serif text-3xl font-bold text-ikigai-cream">{card.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
