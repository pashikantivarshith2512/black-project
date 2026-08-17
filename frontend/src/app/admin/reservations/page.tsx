'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Users, Clock, Check, X } from 'lucide-react';
import { fetchApi } from '@/services/api';
import { Reservation, ReservationStatus } from '@/types';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadReservations = async () => {
    setLoading(true);
    const endpoint = statusFilter === 'ALL' ? '/reservations' : `/reservations?status=${statusFilter}`;
    const res = await fetchApi<Reservation[]>(endpoint);
    if (res.success && res.data) {
      setReservations(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReservations();
  }, [statusFilter]);

  const updateStatus = async (id: string, status: ReservationStatus) => {
    const res = await fetchApi(`/reservations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });

    if (res.success) {
      loadReservations();
    } else {
      alert(res.message || 'Failed to update reservation');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((st) => (
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
      ) : reservations.length === 0 ? (
        <div className="text-center py-16 bg-espresso-800/40 rounded-2xl border border-ikigai-border">
          <p className="text-xs text-ikigai-cream/60">No table reservations match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservations.map((res) => (
            <div key={res.id} className="p-6 rounded-2xl bg-espresso-800/60 border border-ikigai-border space-y-4">
              <div className="flex justify-between items-start border-b border-ikigai-border/60 pb-3">
                <div>
                  <span className="font-mono font-bold text-ikigai-gold text-sm">#{res.reservationNumber}</span>
                  <h3 className="font-serif font-bold text-base text-ikigai-cream">{res.name}</h3>
                  <p className="text-xs text-ikigai-cream/60">{res.phone} • {res.email}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase ${
                  res.status === 'CONFIRMED' ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' :
                  res.status === 'PENDING' ? 'text-amber-400 bg-amber-950/60 border-amber-500/30' :
                  'text-red-400 bg-red-950/60 border-red-500/30'
                }`}>
                  {res.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-ikigai-cream/80 bg-espresso-900 p-3 rounded-xl border border-ikigai-border/40 text-center">
                <div>
                  <span className="text-[10px] text-ikigai-cream/50 block">Date</span>
                  <span className="font-bold text-ikigai-gold">{res.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ikigai-cream/50 block">Time</span>
                  <span className="font-bold text-ikigai-gold">{res.time}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ikigai-cream/50 block">Guests</span>
                  <span className="font-bold text-ikigai-gold">{res.guests} Guests</span>
                </div>
              </div>

              {res.specialRequests && (
                <p className="text-xs text-ikigai-cream/70 italic bg-espresso-900/50 p-2.5 rounded-lg border border-ikigai-border/30">
                  Notes: "{res.specialRequests}"
                </p>
              )}

              <div className="flex space-x-2 pt-2">
                {res.status !== 'CONFIRMED' && (
                  <button
                    onClick={() => updateStatus(res.id, 'CONFIRMED')}
                    className="flex-1 py-2 rounded-lg bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-800"
                  >
                    Confirm Booking
                  </button>
                )}
                {res.status !== 'CANCELLED' && (
                  <button
                    onClick={() => updateStatus(res.id, 'CANCELLED')}
                    className="flex-1 py-2 rounded-lg bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-800"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
