import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import AiChatbot from '@/components/ai/AiChatbot';

export const metadata: Metadata = {
  title: 'IKIGAI Café | Japanese Minimalist Coffee & Kitchen Hyderabad',
  description: 'Find your moment at IKIGAI Café in Kondapur Gachibowli Hyderabad. Artisanal coffee, wood-fired pizza, truffle dim sum & Venetian desserts. Rated 4.4⭐.',
  keywords: ['IKIGAI Cafe', 'Cafe in Kondapur', 'Gachibowli Coffee Shop', 'Japanese Cafe Hyderabad', 'Table Reservation Cafe', 'Best Cappuccino Hyderabad'],
  openGraph: {
    title: 'IKIGAI Café | Japanese Minimalist Coffee & Kitchen',
    description: 'Where coffee, food and conversations create unforgettable experiences.',
    url: 'https://cafeikigai.com',
    siteName: 'IKIGAI Café',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'IKIGAI Cafe Interior',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'IKIGAI Café',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    '@id': 'https://cafeikigai.com',
    url: 'https://cafeikigai.com',
    telephone: '098490 00120',
    priceRange: '₹400–1400',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ground Floor of M.R PRIME Building (LEEWAY), Kondapur, Laxmi Cyber City, Whitefields, Gachibowli',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500084',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.4601,
      longitude: 78.3658,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '23:00',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.4',
      reviewCount: '671',
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <AiChatbot />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
