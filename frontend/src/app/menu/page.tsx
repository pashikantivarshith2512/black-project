'use client';

import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, Filter, Check, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/services/api';
import { MenuItem, Category } from '@/types';
import { useCart } from '@/context/CartContext';

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      setError(null);

      let url = '/menu?';
      if (activeCategory !== 'ALL') url += `category=${encodeURIComponent(activeCategory)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}`;

      const res = await fetchApi(url);
      if (res.success && res.data) {
        setItems(res.data.items || []);
        if (res.data.categories) setCategories(res.data.categories);
      } else {
        setError(res.message || 'Failed to load menu items');
      }
      setLoading(false);
    }

    const timer = setTimeout(() => {
      loadMenu();
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const defaultCategories = ['ALL', 'COFFEE', 'FOOD', 'DESSERTS', 'DRINKS'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold text-ikigai-gold tracking-widest uppercase">Database Driven Gastronomy</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold gold-gradient-text">Artisanal IKIGAI Menu</h1>
        <p className="text-sm sm:text-base text-ikigai-cream/70 max-w-xl mx-auto">
          Single-origin coffees, wok-tossed Schezwan noodles, truffle dim sums, wood-fired pizzas, and Venetian desserts.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-ikigai-border">
        
        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {defaultCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all shrink-0 ${
                activeCategory === cat
                  ? 'gold-gradient-btn shadow-md'
                  : 'bg-espresso-800/80 text-ikigai-cream/80 hover:text-ikigai-gold border border-ikigai-border/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-3 text-ikigai-cream/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cappuccino, pizza, tiramisu..."
            className="w-full bg-espresso-800 border border-ikigai-border rounded-xl pl-9 pr-4 py-2 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
          />
        </div>
      </div>

      {/* Loading / Error / Empty States */}
      {loading ? (
        <div className="text-center py-20 space-y-3">
          <div className="w-8 h-8 border-2 border-ikigai-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-ikigai-cream/60">Fetching fresh menu items from database...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/30 text-center space-y-2 max-w-md mx-auto">
          <AlertCircle className="mx-auto text-red-400" size={32} />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 space-y-3 bg-espresso-800/30 rounded-2xl border border-ikigai-border">
          <p className="text-ikigai-cream/60 text-sm">No menu items match your search or filter.</p>
          <button
            onClick={() => {
              setActiveCategory('ALL');
              setSearchQuery('');
            }}
            className="text-xs text-ikigai-gold hover:underline font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Menu Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-espresso-800/60 rounded-2xl border border-ikigai-border overflow-hidden hover:border-ikigai-gold/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.isSpecialty && (
                    <span className="absolute top-3 left-3 bg-ikigai-gold text-espresso-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      Specialty
                    </span>
                  )}
                  {!item.availability && (
                    <span className="absolute top-3 right-3 bg-red-900/90 text-red-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                      Sold Out
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-xl font-bold text-ikigai-cream">{item.name}</h3>
                    <span className="text-ikigai-gold font-bold text-lg">₹{item.price}</span>
                  </div>
                  <p className="text-xs text-ikigai-cream/70 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  disabled={!item.availability}
                  onClick={() => addToCart(item)}
                  className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                    item.availability
                      ? 'gold-gradient-btn shadow-lg hover:shadow-gold-glow'
                      : 'bg-espresso-700 text-ikigai-cream/40 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag size={14} />
                  <span>{item.availability ? 'Add to Cart' : 'Currently Unavailable'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
