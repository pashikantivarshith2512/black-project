'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { fetchApi } from '@/services/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setNewsletterMsg(null);
    const res = await fetchApi('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (res.success) {
      setNewsletterMsg({ text: res.message || 'Subscribed!', isError: false });
      setEmail('');
    } else {
      setNewsletterMsg({ text: res.message || 'Subscription failed', isError: true });
    }
    setSubmitting(false);
  };

  return (
    <footer className="bg-espresso-900 text-ikigai-cream border-t border-ikigai-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand Story */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border border-ikigai-gold flex items-center justify-center bg-espresso-800">
                <span className="text-ikigai-gold font-serif font-bold text-xl">生き</span>
              </div>
              <span className="font-serif text-2xl font-bold gold-gradient-text">IKIGAI Café</span>
            </div>
            <p className="text-sm text-ikigai-cream/70 leading-relaxed">
              IKIGAI represents the Japanese philosophy of finding purpose, balance, and joy in everyday moments. Where coffee, food and conversations create unforgettable experiences.
            </p>
            <div className="pt-2 text-xs text-ikigai-gold uppercase tracking-widest">
              4.4 ⭐ (671+ Verified Reviews)
            </div>
          </div>

          {/* Column 2: Hours & Contact */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-ikigai-gold">Operating Hours & Contact</h3>
            <ul className="space-y-3 text-sm text-ikigai-cream/80">
              <li className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-ikigai-gold shrink-0 mt-0.5" />
                <span>Monday – Sunday: 8:00 AM – 11:00 PM</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-ikigai-gold shrink-0 mt-0.5" />
                <a href="tel:09849000120" className="hover:text-ikigai-gold transition-colors">098490 00120</a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-ikigai-gold shrink-0 mt-0.5" />
                <span>concierge@cafeikigai.com</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Location */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-ikigai-gold">Café Location</h3>
            <div className="flex items-start space-x-3 text-sm text-ikigai-cream/80">
              <MapPin className="w-5 h-5 text-ikigai-gold shrink-0 mt-0.5" />
              <span>
                Ground Floor of M.R PRIME Building (LEEWAY), Kondapur, Laxmi Cyber City, Whitefields, Gachibowli, Hyderabad, Telangana 500084
              </span>
            </div>
            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=IKIGAI+Cafe+Kondapur+Hyderabad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs uppercase tracking-wider text-ikigai-gold hover:underline border border-ikigai-gold/30 px-3 py-1.5 rounded"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-ikigai-gold">The IKIGAI Journal</h3>
            <p className="text-sm text-ikigai-cream/70">
              Subscribe for seasonal coffee menu reveals, Japanese culinary notes & exclusive rewards.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-espresso-800 border border-ikigai-border rounded-lg px-4 py-2.5 text-sm text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="absolute right-1 top-1 bottom-1 bg-ikigai-gold text-espresso-900 px-3 rounded-md font-semibold hover:bg-ikigai-goldHover transition-colors flex items-center justify-center"
                >
                  <Send size={14} />
                </button>
              </div>
              {newsletterMsg && (
                <p className={`text-xs ${newsletterMsg.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                  {newsletterMsg.text}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-ikigai-border/50 flex flex-col md:flex-row items-center justify-between text-xs text-ikigai-cream/50 space-y-4 md:space-y-0">
          <div>
            © {new Date().getFullYear()} IKIGAI Café. All Rights Reserved. Japanese Minimalist Luxury Coffee & Cuisine.
          </div>
          <div className="flex space-x-6">
            <Link href="/menu" className="hover:text-ikigai-gold">Online Menu</Link>
            <Link href="/reservations" className="hover:text-ikigai-gold">Book Table</Link>
            <Link href="/loyalty" className="hover:text-ikigai-gold">Loyalty Program</Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Order / Contact Button */}
      <a
        href="https://wa.me/919849000120?text=Hello%20IKIGAI%20Café%2C%20I%20would%20like%20to%20inquire%20about%20ordering%2Freservations."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center space-x-2 border border-emerald-400/40"
        title="Chat on WhatsApp with IKIGAI Café"
      >
        <MessageCircle size={24} />
        <span className="hidden sm:inline text-xs font-semibold pr-1">WhatsApp Order</span>
      </a>
    </footer>
  );
}
