'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-espresso-900 border-l border-ikigai-border text-ikigai-cream shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-ikigai-border flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="text-ikigai-gold" size={22} />
              <h2 className="font-serif text-xl font-bold gold-gradient-text">Your Order Cart</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-ikigai-cream/70 hover:text-ikigai-gold transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full border border-ikigai-border flex items-center justify-center mx-auto text-ikigai-cream/40">
                  <ShoppingBag size={32} />
                </div>
                <p className="text-ikigai-cream/60 text-sm">Your cart is currently empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="gold-gradient-btn px-6 py-2 rounded-lg text-sm font-semibold inline-block"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.menuItem.id}
                  className="flex items-center space-x-4 p-3 rounded-lg bg-espresso-800/60 border border-ikigai-border/60"
                >
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-16 h-16 rounded-md object-cover border border-ikigai-border"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-semibold text-ikigai-cream truncate">
                      {item.menuItem.name}
                    </h4>
                    <p className="text-xs text-ikigai-gold font-medium mt-0.5">
                      ₹{item.menuItem.price} each
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                        className="p-1 rounded bg-espresso-700 hover:bg-espresso-600 text-ikigai-cream"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-semibold px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="p-1 rounded bg-espresso-700 hover:bg-espresso-600 text-ikigai-cream"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <span className="text-sm font-bold text-ikigai-cream">
                      ₹{item.menuItem.price * item.quantity}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.menuItem.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-ikigai-border bg-espresso-950 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-ikigai-cream/70">Subtotal</span>
                <span className="font-bold text-ikigai-cream text-base">₹{subtotal}</span>
              </div>
              <p className="text-[11px] text-ikigai-cream/50">
                Taxes & pickup/delivery details calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="gold-gradient-btn w-full py-3 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
