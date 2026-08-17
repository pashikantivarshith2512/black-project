'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full border border-ikigai-border flex items-center justify-center mx-auto text-ikigai-cream/30">
          <ShoppingBag size={40} />
        </div>
        <h1 className="font-serif text-3xl font-bold text-ikigai-cream">Your Cart is Empty</h1>
        <p className="text-ikigai-cream/60 text-sm max-w-sm mx-auto">
          Explore our artisanal coffee, handcrafted pizza, truffle dim sums and desserts to start your order.
        </p>
        <Link
          href="/menu"
          className="gold-gradient-btn px-8 py-3 rounded-xl text-sm font-bold inline-block"
        >
          Explore IKIGAI Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-ikigai-border pb-6">
        <h1 className="font-serif text-3xl font-bold gold-gradient-text">Shopping Cart ({totalItems} items)</h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-400 hover:underline flex items-center space-x-1"
        >
          <Trash2 size={14} />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.menuItem.id}
              className="p-4 rounded-2xl bg-espresso-800/60 border border-ikigai-border flex items-center space-x-4"
            >
              <img
                src={item.menuItem.image}
                alt={item.menuItem.name}
                className="w-20 h-20 rounded-xl object-cover border border-ikigai-border shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base font-bold text-ikigai-cream truncate">
                  {item.menuItem.name}
                </h3>
                <p className="text-xs text-ikigai-gold font-semibold mt-0.5">₹{item.menuItem.price}</p>
                
                <div className="flex items-center space-x-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                    className="p-1 rounded bg-espresso-700 hover:bg-espresso-600 text-ikigai-cream"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-bold px-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                    className="p-1 rounded bg-espresso-700 hover:bg-espresso-600 text-ikigai-cream"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-3">
                <span className="font-bold text-base text-ikigai-cream">
                  ₹{item.menuItem.price * item.quantity}
                </span>
                <button
                  onClick={() => removeFromCart(item.menuItem.id)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="p-6 rounded-2xl bg-espresso-950 border border-ikigai-border space-y-6 h-fit sticky top-28">
          <h2 className="font-serif text-xl font-bold text-ikigai-gold">Order Summary</h2>

          <div className="space-y-3 text-sm border-b border-ikigai-border pb-4">
            <div className="flex justify-between text-ikigai-cream/80">
              <span>Subtotal</span>
              <span className="font-semibold text-ikigai-cream">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-ikigai-cream/80">
              <span>Estimated Taxes & Packaging</span>
              <span className="font-semibold text-ikigai-cream">₹0</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-base font-bold">
            <span className="text-ikigai-cream">Total</span>
            <span className="text-ikigai-gold text-xl">₹{subtotal}</span>
          </div>

          <Link
            href="/checkout"
            className="gold-gradient-btn w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} />
          </Link>

          <div className="flex items-center justify-center space-x-2 text-[11px] text-ikigai-cream/50 pt-2">
            <ShieldCheck size={14} className="text-ikigai-gold" />
            <span>Development / Test mode Checkout supported</span>
          </div>
        </div>

      </div>
    </div>
  );
}
