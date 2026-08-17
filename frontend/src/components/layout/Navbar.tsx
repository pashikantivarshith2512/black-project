'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Calendar, User as UserIcon, Menu as MenuIcon, X, Sun, Moon, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Reservations', href: '/reservations' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Loyalty Rewards', href: '/loyalty' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-ikigai-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full border border-ikigai-gold flex items-center justify-center bg-espresso-900 group-hover:scale-105 transition-transform">
              <span className="text-ikigai-gold font-serif font-bold text-xl">生き</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wider gold-gradient-text">IKIGAI</span>
              <span className="text-[10px] tracking-[0.25em] text-ikigai-gold uppercase -mt-1 font-sans">Café • Hyderabad</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm tracking-wide transition-colors ${
                    isActive
                      ? 'text-ikigai-gold font-semibold border-b-2 border-ikigai-gold pb-1'
                      : 'text-ikigai-cream/80 hover:text-ikigai-gold'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Theme Toggle, Cart, Auth, Table Reservation */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-ikigai-border text-ikigai-cream hover:text-ikigai-gold transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Cart Icon Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full border border-ikigai-border text-ikigai-cream hover:text-ikigai-gold transition-colors"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-ikigai-gold text-espresso-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth / Admin Button */}
            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 rounded text-xs font-semibold bg-ikigai-gold/20 text-ikigai-gold border border-ikigai-gold hover:bg-ikigai-gold hover:text-espresso-900 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-sm text-ikigai-cream">
                    <UserIcon size={18} className="text-ikigai-gold" />
                    <span>{user.name.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-espresso-900 border border-ikigai-border rounded-lg shadow-xl py-2 hidden group-hover:block z-50">
                    <div className="px-4 py-2 text-xs text-ikigai-cream/60 border-b border-ikigai-border">
                      Signed in as <span className="font-semibold text-ikigai-gold">{user.email}</span>
                    </div>
                    <Link href="/loyalty" className="block px-4 py-2 text-sm text-ikigai-cream hover:bg-espresso-800">
                      My Loyalty Account
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-espresso-800"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm text-ikigai-cream/90 hover:text-ikigai-gold transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Quick Reserve CTA */}
            <Link
              href="/reservations"
              className="gold-gradient-btn px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 shadow-md"
            >
              <Calendar size={16} />
              <span>Reserve Table</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-ikigai-cream"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-ikigai-gold text-espresso-900 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ikigai-cream"
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-espresso-900 border-b border-ikigai-border px-4 pt-2 pb-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base text-ikigai-cream hover:text-ikigai-gold py-1"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-ikigai-border flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ikigai-cream">Theme</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded border border-ikigai-border text-ikigai-cream"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            {user ? (
              <>
                <div className="text-xs text-ikigai-gold">Signed in as {user.name}</div>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 bg-ikigai-gold/20 text-ikigai-gold border border-ikigai-gold rounded font-medium text-sm"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-red-400 border border-red-500/30 rounded text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 border border-ikigai-border text-ikigai-cream rounded text-sm"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/reservations"
              onClick={() => setMobileMenuOpen(false)}
              className="gold-gradient-btn text-center py-2.5 rounded-lg text-sm font-semibold block"
            >
              Reserve a Table
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
