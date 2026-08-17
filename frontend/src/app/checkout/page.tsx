'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, CheckCircle, ShieldAlert, Truck, Utensils, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/services/api';
import { DeliveryOption, Order } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('DINE_IN');
  const [address, setAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    setError(null);

    const payload = {
      customerName,
      customerEmail,
      customerPhone,
      deliveryOption,
      address: deliveryOption === 'NO_CONTACT_DELIVERY' ? address : undefined,
      specialInstructions,
      items: cart.map((i) => ({
        menuItemId: i.menuItem.id,
        quantity: i.quantity,
        specialNotes: i.specialNotes,
      })),
    };

    const res = await fetchApi<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.success && res.data) {
      setConfirmedOrder(res.data);
      clearCart();
    } else {
      setError(res.message || 'Failed to place order.');
    }
    setLoading(false);
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full border-2 border-ikigai-gold bg-espresso-800 flex items-center justify-center mx-auto text-ikigai-gold">
          <CheckCircle size={48} />
        </div>

        <span className="text-xs font-semibold text-ikigai-gold uppercase tracking-widest">Order Placed</span>
        <h1 className="font-serif text-3xl font-bold text-ikigai-cream">
          Thank you, {confirmedOrder.customerName}!
        </h1>
        
        <div className="p-6 rounded-2xl bg-espresso-800/80 border border-ikigai-border text-left space-y-4 max-w-lg mx-auto">
          <div className="flex justify-between border-b border-ikigai-border/60 pb-3">
            <span className="text-xs text-ikigai-cream/60">Order Reference</span>
            <span className="font-mono font-bold text-ikigai-gold">#{confirmedOrder.orderNumber}</span>
          </div>
          <div className="flex justify-between border-b border-ikigai-border/60 pb-3">
            <span className="text-xs text-ikigai-cream/60">Service Option</span>
            <span className="text-xs font-semibold text-ikigai-cream">{confirmedOrder.deliveryOption.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex justify-between border-b border-ikigai-border/60 pb-3">
            <span className="text-xs text-ikigai-cream/60">Total Amount</span>
            <span className="font-bold text-ikigai-gold">₹{confirmedOrder.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-ikigai-cream/60">Status</span>
            <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              {confirmedOrder.status}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-300/80 max-w-md mx-auto">
          ⚠️ <strong>Development Checkout Notice:</strong> Payment status set to TEST_MODE_PENDING. Production integration readiness prepared for Razorpay.
        </div>

        <button
          onClick={() => router.push('/menu')}
          className="gold-gradient-btn px-8 py-3 rounded-xl font-bold text-sm"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-ikigai-gold tracking-widest uppercase">Direct Dining & Pickup</span>
        <h1 className="font-serif text-3xl font-bold gold-gradient-text">Checkout</h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Customer Information & Service Options */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Delivery Option Selector */}
          <div className="p-6 rounded-2xl bg-espresso-800/60 border border-ikigai-border space-y-4">
            <h3 className="font-serif text-lg font-bold text-ikigai-gold">1. Select Dining / Delivery Option</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label
                onClick={() => setDeliveryOption('DINE_IN')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                  deliveryOption === 'DINE_IN'
                    ? 'border-ikigai-gold bg-ikigai-gold/10 text-ikigai-gold font-bold'
                    : 'border-ikigai-border/60 bg-espresso-900 text-ikigai-cream/70'
                }`}
              >
                <Utensils size={20} />
                <span className="text-xs">Dine-In Table</span>
              </label>

              <label
                onClick={() => setDeliveryOption('KERBSIDE_PICKUP')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                  deliveryOption === 'KERBSIDE_PICKUP'
                    ? 'border-ikigai-gold bg-ikigai-gold/10 text-ikigai-gold font-bold'
                    : 'border-ikigai-border/60 bg-espresso-900 text-ikigai-cream/70'
                }`}
              >
                <Package size={20} />
                <span className="text-xs">Kerbside Pickup</span>
              </label>

              <label
                onClick={() => setDeliveryOption('NO_CONTACT_DELIVERY')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                  deliveryOption === 'NO_CONTACT_DELIVERY'
                    ? 'border-ikigai-gold bg-ikigai-gold/10 text-ikigai-gold font-bold'
                    : 'border-ikigai-border/60 bg-espresso-900 text-ikigai-cream/70'
                }`}
              >
                <Truck size={20} />
                <span className="text-xs">No-Contact Delivery</span>
              </label>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-6 rounded-2xl bg-espresso-800/60 border border-ikigai-border space-y-4">
            <h3 className="font-serif text-lg font-bold text-ikigai-gold">2. Contact Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-ikigai-cream/70">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-2.5 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
                  placeholder="e.g. Aarav Sharma"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ikigai-cream/70">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-2.5 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
                  placeholder="e.g. 09876543210"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-ikigai-cream/70">Email Address *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-2.5 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
                  placeholder="e.g. aarav@example.com"
                />
              </div>

              {deliveryOption === 'NO_CONTACT_DELIVERY' && (
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs text-ikigai-cream/70">Delivery Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-espresso-900 border border-ikigai-border rounded-xl p-3 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
                    placeholder="Apartment, Street name, Kondapur landmark..."
                  />
                </div>
              )}

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-ikigai-cream/70">Special Requests / Preparation Notes</label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-espresso-900 border border-ikigai-border rounded-xl px-4 py-2.5 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
                  placeholder="e.g. Less sugar in Cappuccino, Extra dip..."
                />
              </div>
            </div>
          </div>

        </div>

        {/* Order Summary & Submit */}
        <div className="p-6 rounded-2xl bg-espresso-950 border border-ikigai-border space-y-6 h-fit sticky top-28">
          <h3 className="font-serif text-xl font-bold text-ikigai-gold">Summary</h3>

          <div className="space-y-3 text-xs border-b border-ikigai-border pb-4 max-h-48 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.menuItem.id} className="flex justify-between text-ikigai-cream/80">
                <span>{item.quantity}x {item.menuItem.name}</span>
                <span className="font-bold text-ikigai-cream">₹{item.menuItem.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-base font-bold">
            <span className="text-ikigai-cream">Total Payable</span>
            <span className="text-ikigai-gold text-xl">₹{subtotal}</span>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 p-3 rounded-lg border border-red-500/20">{error}</p>
          )}

          <div className="p-3 rounded-xl bg-espresso-900 border border-ikigai-border/60 text-[11px] text-ikigai-cream/60 space-y-1">
            <div className="flex items-center space-x-1.5 text-ikigai-gold font-semibold">
              <ShieldAlert size={14} />
              <span>Development / Test Checkout</span>
            </div>
            <p>Razorpay integration hook ready. Orders will immediately sync to IKIGAI Admin Dashboard.</p>
          </div>

          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="gold-gradient-btn w-full py-4 rounded-xl font-bold text-sm shadow-xl hover:shadow-gold-glow disabled:opacity-50"
          >
            {loading ? 'Processing Order...' : 'Confirm Order'}
          </button>
        </div>

      </form>
    </div>
  );
}
