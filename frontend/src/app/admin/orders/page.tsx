'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Clock, CheckCircle } from 'lucide-react';
import { fetchApi } from '@/services/api';
import { Order, OrderStatus } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const loadOrders = async () => {
    setLoading(true);
    const endpoint = statusFilter === 'ALL' ? '/orders' : `/orders?status=${statusFilter}`;
    const res = await fetchApi<Order[]>(endpoint);
    if (res.success && res.data) {
      setOrders(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const res = await fetchApi(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.success) {
      loadOrders();
    } else {
      alert(res.message || 'Status update failed.');
    }
  };

  const statuses: (OrderStatus | 'ALL')[] = ['ALL', 'PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="space-y-6">
      
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider shrink-0 transition-all ${
              statusFilter === st
                ? 'gold-gradient-btn shadow'
                : 'bg-espresso-800 text-ikigai-cream/70 border border-ikigai-border'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-ikigai-gold border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-espresso-800/40 rounded-2xl border border-ikigai-border">
          <p className="text-xs text-ikigai-cream/60">No orders found for selected status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="p-6 rounded-2xl bg-espresso-800/60 border border-ikigai-border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ikigai-border/60 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-ikigai-gold text-sm">#{ord.orderNumber}</span>
                  <span className="text-xs font-semibold text-ikigai-cream">{ord.customerName}</span>
                  <span className="text-[10px] text-ikigai-cream/50">({ord.customerPhone})</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-ikigai-gold font-bold">Total: ₹{ord.totalAmount}</span>
                  <select
                    value={ord.status}
                    onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                    className="bg-espresso-950 border border-ikigai-border text-ikigai-gold rounded-lg px-3 py-1.5 font-semibold focus:outline-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="PREPARING">PREPARING</option>
                    <option value="READY">READY</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-ikigai-cream/80">
                <div>
                  <span className="text-ikigai-gold font-semibold">Service Option: </span>
                  {ord.deliveryOption.replace(/_/g, ' ')}
                  {ord.address && <p className="text-[11px] text-ikigai-cream/60 mt-1">Addr: {ord.address}</p>}
                </div>
                <div>
                  <span className="text-ikigai-gold font-semibold">Ordered Items: </span>
                  <ul className="list-disc list-inside text-[11px] text-ikigai-cream/70 mt-1">
                    {ord.items.map((i) => (
                      <li key={i.id}>
                        {i.quantity}x {i.menuItem?.name || 'Item'} (₹{i.price})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
