'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ShoppingBag, Utensils, Star, MapPin, ArrowRight, Award, Coffee, Sparkles, Heart } from 'lucide-react';
import { fetchApi } from '@/services/api';
import { MenuItem, Review, GalleryItem } from '@/types';
import { useCart } from '@/context/CartContext';

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadHomeData() {
      const [menuRes, reviewRes, galleryRes] = await Promise.all([
        fetchApi('/menu'),
        fetchApi('/reviews'),
        fetchApi('/gallery'),
      ]);

      if (menuRes.success && menuRes.data?.items) {
        setFeaturedItems(menuRes.data.items.slice(0, 4));
      }
      if (reviewRes.success && reviewRes.data) {
        setReviews(reviewRes.data.slice(0, 3));
      }
      if (galleryRes.success && galleryRes.data) {
        setGallery(galleryRes.data.slice(0, 6));
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Slow Zoom Animation */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2000&q=80"
            alt="IKIGAI Cafe Ambience"
            className="w-full h-full object-cover scale-105 animate-[zoom_25s_infinite_alternate]"
            style={{
              animationDuration: '30s',
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/70 to-espresso-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 pt-12">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-ikigai-gold/40 text-ikigai-gold text-xs font-semibold tracking-widest uppercase">
            <Sparkles size={14} />
            <span>Japanese Philosophy • Modern Coffee Culture</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ikigai-cream leading-[1.1]">
            Find Your Moment at <span className="gold-gradient-text">IKIGAI</span>
          </h1>

          <p className="text-lg sm:text-xl text-ikigai-cream/80 max-w-2xl mx-auto font-light leading-relaxed">
            Where coffee, food and conversations create unforgettable experiences.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/reservations"
              className="gold-gradient-btn px-8 py-4 rounded-xl text-base font-bold flex items-center space-x-3 w-full sm:w-auto justify-center shadow-xl"
            >
              <Calendar size={18} />
              <span>Reserve a Table</span>
            </Link>

            <Link
              href="/menu"
              className="px-8 py-4 rounded-xl text-base font-semibold border border-ikigai-gold text-ikigai-gold hover:bg-ikigai-gold/10 transition-colors w-full sm:w-auto justify-center flex items-center space-x-2"
            >
              <ShoppingBag size={18} />
              <span>Order Online</span>
            </Link>

            <Link
              href="/menu"
              className="px-8 py-4 rounded-xl text-base font-medium text-ikigai-cream/80 hover:text-ikigai-gold transition-colors flex items-center space-x-2"
            >
              <span>Explore Menu</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Quick Rating Badge */}
          <div className="pt-8 flex items-center justify-center space-x-6 text-xs text-ikigai-cream/70 border-t border-ikigai-border/40 max-w-md mx-auto">
            <div className="flex items-center space-x-1 text-ikigai-gold">
              <Star className="fill-ikigai-gold" size={14} />
              <span className="font-bold text-sm">4.4</span>
              <span className="text-ikigai-cream/60">(671+ Reviews)</span>
            </div>
            <span>•</span>
            <div>Kondapur, Hyderabad</div>
            <span>•</span>
            <div>₹400–1400 / person</div>
          </div>

        </div>
      </section>

      {/* ABOUT IKIGAI STORYTELLING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="text-xs font-semibold text-ikigai-gold tracking-widest uppercase flex items-center space-x-2">
              <Coffee size={14} />
              <span>The Philosophy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ikigai-cream leading-tight">
              "At IKIGAI Café, we believe every cup of coffee carries a story."
            </h2>

            <p className="text-ikigai-cream/80 text-base leading-relaxed">
              Inspired by Japanese philosophy, we create a space where people connect, relax and enjoy meaningful moments. From our slow-drip Kyoto cold brews to artisanal wood-fired pizzas and truffle dim sums, every detail is crafted with intention.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-4 rounded-xl bg-espresso-800/50 border border-ikigai-border space-y-1">
                <div className="text-ikigai-gold font-serif text-2xl font-bold">Purpose</div>
                <p className="text-xs text-ikigai-cream/60">Crafting artisanal coffee with pure devotion.</p>
              </div>

              <div className="p-4 rounded-xl bg-espresso-800/50 border border-ikigai-border space-y-1">
                <div className="text-ikigai-gold font-serif text-2xl font-bold">Balance</div>
                <p className="text-xs text-ikigai-cream/60">Harmonious blend of flavors & serene interior.</p>
              </div>

              <div className="p-4 rounded-xl bg-espresso-800/50 border border-ikigai-border space-y-1">
                <div className="text-ikigai-gold font-serif text-2xl font-bold">Calmness</div>
                <p className="text-xs text-ikigai-cream/60">A tranquil sanctuary away from city rush.</p>
              </div>

              <div className="p-4 rounded-xl bg-espresso-800/50 border border-ikigai-border space-y-1">
                <div className="text-ikigai-gold font-serif text-2xl font-bold">Joy</div>
                <p className="text-xs text-ikigai-cream/60">Memorable moments shared over great food.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden border border-ikigai-gold/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80"
                alt="IKIGAI Coffee Pour"
                className="w-full h-[480px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 z-20 glass-panel p-6 rounded-2xl border border-ikigai-gold/40 shadow-xl max-w-xs">
              <p className="font-serif text-sm font-semibold text-ikigai-gold italic">
                "Where hospitality meets mindful living."
              </p>
              <span className="text-[11px] text-ikigai-cream/60 block mt-1">— IKIGAI Artisanal Kitchen</span>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED MENU PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-ikigai-gold tracking-widest uppercase">Gastronomy</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ikigai-cream mt-1">
              Curated Specialty Menu
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-ikigai-gold hover:underline flex items-center space-x-2 text-sm font-semibold"
          >
            <span>View Full Menu</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="bg-espresso-800/60 rounded-2xl border border-ikigai-border overflow-hidden hover:border-ikigai-gold/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.isSpecialty && (
                    <span className="absolute top-3 left-3 bg-ikigai-gold text-espresso-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Specialty
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-lg font-bold text-ikigai-cream">{item.name}</h3>
                    <span className="text-ikigai-gold font-bold text-base">₹{item.price}</span>
                  </div>
                  <p className="text-xs text-ikigai-cream/70 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => addToCart(item)}
                  className="w-full py-2.5 rounded-lg border border-ikigai-gold/40 text-ikigai-gold text-xs font-semibold hover:bg-ikigai-gold hover:text-espresso-900 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag size={14} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="bg-espresso-950 py-20 border-y border-ikigai-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="flex justify-center items-center space-x-1 text-ikigai-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="fill-ikigai-gold" size={18} />
              ))}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ikigai-cream">
              Loved by 671+ Coffee Enthusiasts
            </h2>
            <p className="text-sm text-ikigai-cream/70">
              Read authentic guest experiences from our Kondapur café.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-espresso-900 border border-ikigai-border space-y-4 relative"
              >
                <div className="flex text-ikigai-gold space-x-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="fill-ikigai-gold" size={14} />
                  ))}
                </div>
                <p className="text-sm text-ikigai-cream/80 italic leading-relaxed">
                  "{rev.comment}"
                </p>
                <div className="pt-2 border-t border-ikigai-border/40 text-xs font-serif font-semibold text-ikigai-gold">
                  — {rev.name}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/reviews"
              className="text-xs uppercase tracking-widest text-ikigai-gold hover:underline border border-ikigai-gold/30 px-6 py-3 rounded-xl inline-block"
            >
              Write a Review / View All Reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* INSTAGRAM GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-ikigai-gold tracking-widest uppercase">@cafeikigai</span>
          <h2 className="font-serif text-3xl font-bold text-ikigai-cream">Moments at IKIGAI</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {gallery.map((g) => (
            <div key={g.id} className="relative group overflow-hidden rounded-xl h-40 border border-ikigai-border">
              <img
                src={g.imageUrl}
                alt={g.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-espresso-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                <span className="text-[10px] font-serif font-semibold text-ikigai-gold">{g.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION & ADDRESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-espresso-800/80 rounded-3xl border border-ikigai-border p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs font-semibold text-ikigai-gold tracking-widest uppercase">Visit Us</span>
            <h2 className="font-serif text-3xl font-bold text-ikigai-cream">Location & Contact</h2>
            
            <div className="space-y-3 text-sm text-ikigai-cream/80">
              <div className="flex items-start space-x-3">
                <MapPin className="text-ikigai-gold shrink-0 mt-1" size={20} />
                <span>
                  Ground Floor of M.R PRIME Building (LEEWAY), Kondapur, Laxmi Cyber City, Whitefields, Gachibowli, Hyderabad, Telangana 500084
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="https://maps.google.com/?q=IKIGAI+Cafe+Kondapur+Hyderabad"
                target="_blank"
                rel="noopener noreferrer"
                className="gold-gradient-btn px-6 py-3 rounded-xl text-xs font-bold"
              >
                Get Directions
              </a>
              <a
                href="tel:09849000120"
                className="px-6 py-3 rounded-xl border border-ikigai-gold text-ikigai-gold text-xs font-semibold hover:bg-ikigai-gold/10"
              >
                Call 098490 00120
              </a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-ikigai-border h-64 bg-espresso-950 flex items-center justify-center relative">
            <iframe
              title="IKIGAI Cafe Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.273181829285!2d78.3658!3d17.4601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI3JzM2LjQiTiA3OMKwMjEnNTYuOSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              className="w-full h-full border-0 filter opacity-80 contrast-125"
              loading="lazy"
            />
          </div>

        </div>
      </section>

    </div>
  );
}
