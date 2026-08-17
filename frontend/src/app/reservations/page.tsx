'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle, AlertCircle, Phone, Mail, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/services/api';
import { Reservation } from '@/types';

export default function ReservationsPage() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  const [loading, setLoading] = useState(false);
  const [successReservation, setSuccessReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  const timeSlots = [
    '08:30', '09:30', '10:30', '11:30', '12:30',
    '13:30', '14:30', '16:00', '17:30', '19:00',
    '20:00', '21:00', '22:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date || !time) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetchApi<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        phone,
        date,
        time,
        guests: Number(guests),
        specialRequests,
      }),
    });

    if (res.success && res.data) {
      setSuccessReservation(res.data);
    } else {
      setError(res.message || 'Failed to complete table reservation.');
    }
    setLoading(false);
  };

  if (successReservation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full border-2 border-ikigai-gold bg-espresso-800 flex items-center justify-center mx-auto text-ikigai-gold">
          <CheckCircle size={48} />
        </div>

        <span className="text-xs font-semibold text-ikigai-gold uppercase tracking-widest">Reservation Received</span>
        <h1 className="font-serif text-3xl font-bold text-ikigai-cream">
          Table Reserved, {successReservation.name}!
        </h1>

        <div className="p-6 rounded-2xl bg-espresso-800/80 border border-ikigai-border text-left space-y-3 max-w-md mx-auto">
          <div className="flex justify-between border-b border-ikigai-border/60 pb-2">
            <span className="text-xs text-ikigai-cream/60">Booking Reference</span>
            <span className="font-mono font-bold text-ikigai-gold">#{successReservation.reservationNumber}</span>
          </div>
          <div className="flex justify-between border-b border-ikigai-border/60 pb-2">
            <span className="text-xs text-ikigai-cream/60">Date & Time</span>
            <span className="text-xs font-bold text-ikigai-cream">{successReservation.date} at {successReservation.time}</span>
          </div>
          <div className="flex justify-between border-b border-ikigai-border/60 pb-2">
            <span className="text-xs text-ikigai-cream/60">Guests</span>
            <span className="text-xs font-bold text-ikigai-cream">{successReservation.guests} Guests</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-ikigai-cream/60">Status</span>
            <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              {successReservation.status}
            </span>
          </div>
        </div>

        <p className="text-xs text-ikigai-cream/70 max-w-sm mx-auto">
          We look forward to hosting your moment at IKIGAI Café. Confirmation details have been logged.
        </p>

        <button
          onClick={() => setSuccessReservation(null)}
          className="gold-gradient-btn px-8 py-3 rounded-xl font-bold text-sm"
        >
          Book Another Table
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold text-ikigai-gold tracking-widest uppercase">Zen Hospitality</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold gold-gradient-text">Reserve a Table</h1>
        <p className="text-sm text-ikigai-cream/70 max-w-md mx-auto">
          Book your serene coffee experience or dining table at IKIGAI Café Kondapur.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-espresso-800/60 border border-ikigai-border space-y-8 glass-panel">
        
        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          <div className="space-y-1">
            <label className="text-xs text-ikigai-cream/70 flex items-center space-x-1">
              <User size={14} className="text-ikigai-gold" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-3 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
              placeholder="e.g. Aarav Sharma"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-ikigai-cream/70 flex items-center space-x-1">
              <Phone size={14} className="text-ikigai-gold" />
              <span>Phone Number *</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-3 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
              placeholder="e.g. 09849000120"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-ikigai-cream/70 flex items-center space-x-1">
              <Mail size={14} className="text-ikigai-gold" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-3 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
              placeholder="e.g. aarav@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-ikigai-cream/70 flex items-center space-x-1">
              <Users size={14} className="text-ikigai-gold" />
              <span>Number of Guests *</span>
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-3 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-ikigai-cream/70 flex items-center space-x-1">
              <Calendar size={14} className="text-ikigai-gold" />
              <span>Preferred Date *</span>
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-3 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-ikigai-cream/70 flex items-center space-x-1">
              <Clock size={14} className="text-ikigai-gold" />
              <span>Preferred Time Slot *</span>
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-3 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs text-ikigai-cream/70">Special Requests / Seating Preference</label>
            <textarea
              rows={3}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full bg-espresso-900 border border-ikigai-border rounded-xl p-3 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
              placeholder="e.g. Quiet corner table, anniversary decoration, high chair..."
            />
          </div>

        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="gold-gradient-btn px-10 py-4 rounded-xl font-bold text-sm shadow-xl hover:shadow-gold-glow disabled:opacity-50"
          >
            {loading ? 'Submitting Reservation...' : 'Reserve My Table'}
          </button>
        </div>

      </form>

    </div>
  );
}
