import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

// Import routes (we will create these later)
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import orgRoutes from './routes/organization.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import customerRoutes from './routes/customer.routes';
import orderRoutes from './routes/order.routes';
import analyticsRoutes from './routes/analytics.routes';
import notificationRoutes from './routes/notification.routes';

const app = express();

// Security headers
app.use(helmet());

// CORS configuration (allow frontend origin)
const origin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: origin,
  credentials: true, // Required for cookies (refresh token)
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global Rate Limiting
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok', time: new Date().toISOString() } });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: 'Route not found' } });
});

// Global Error Handler
app.use(errorHandler);

export default app;
