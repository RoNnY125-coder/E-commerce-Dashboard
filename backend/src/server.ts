import dotenv from 'dotenv';
// Load environment variables before anything else
dotenv.config();

import app from './app';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma
export const prisma = new PrismaClient();

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log('✅ Connected to database');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down server...');
      server.close(() => {
        console.log('Express server closed.');
      });
      await prisma.$disconnect();
      console.log('Database connection closed.');
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
