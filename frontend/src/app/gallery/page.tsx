'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/services/api';
import { GalleryItem } from '@/types';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const categories = ['ALL', 'AMBIENCE', 'FOOD', 'COFFEE', 'EVENTS', 'CUSTOMER_MOMENTS'];

  useEffect(() => {
    async function loadGallery() {
      setLoading(true);
      const endpoint = activeCategory === 'ALL' ? '/gallery' : `/gallery?category=${activeCategory}`;
      const res = await fetchApi<GalleryItem[]>(endpoint);
      if (res.success && res.data) {
        setItems(res.data);
      }
      setLoading(false);
    }
    loadGallery();
  }, [activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold text-ikigai-gold tracking-widest uppercase">Instagram Aesthetics</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold gold-gradient-text">IKIGAI Photo Gallery</h1>
        <p className="text-sm text-ikigai-cream/70 max-w-md mx-auto">
          Explore serene interior architecture, artisanal coffee pours, signature dishes & guest moments.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all shrink-0 ${
              activeCategory === cat
                ? 'gold-gradient-btn shadow-md'
                : 'bg-espresso-800/80 text-ikigai-cream/80 hover:text-ikigai-gold border border-ikigai-border/60'
            }`}
          >
            {cat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-ikigai-gold border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative h-72 rounded-2xl overflow-hidden border border-ikigai-border shadow-lg"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/90 via-espresso-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 space-y-1">
                <span className="text-[10px] text-ikigai-gold uppercase tracking-widest font-semibold">
                  {item.category.replace(/_/g, ' ')}
                </span>
                <h3 className="font-serif text-lg font-bold text-ikigai-cream">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
