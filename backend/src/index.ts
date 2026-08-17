import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import menuRoutes from './routes/menu.routes';
import orderRoutes from './routes/orders.routes';
import reservationRoutes from './routes/reservations.routes';
import reviewRoutes from './routes/reviews.routes';
import galleryRoutes from './routes/gallery.routes';
import newsletterRoutes from './routes/newsletter.routes';
import loyaltyRoutes from './routes/loyalty.routes';
import aiRoutes from './routes/ai.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

// Enable CORS for all incoming production origins (Vercel, Localhost, etc.)
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    brand: 'IKIGAI Café',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '5000', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`☕ IKIGAI Café Backend API running on port ${PORT} (0.0.0.0)`);
});

export default app;
