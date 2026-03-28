import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  constructor(public message: string, public statusCode: number = 500, public isOperational: boolean = true) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = null;

  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.errors.map(e => ({ path: e.path.join('.'), message: e.message }));
  } 
  // 2. Prisma Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400; // default for prisma validation/client errors
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'A record with this value already exists (Unique constraint violation).';
      errors = { target: err.meta?.target };
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found.';
    } else {
      message = `Database Error: ${err.message}`;
    }
  }
  // 3. Custom App Errors (e.g., manually thrown 401s or 403s)
  else if ('statusCode' in err) {
    statusCode = (err as AppError).statusCode || 500;
    message = err.message;
  }
  // 4. Standard Error
  else if (err instanceof Error) {
    message = err.message;
  }

  // Hide detailed internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong on the server.';
  }

  // Log error (in a real app, use Winston or Pino)
  if (process.env.NODE_ENV !== 'test' && statusCode >= 500) {
    console.error(`[ERROR] ${err.name}: ${err.message}\nStack: ${err.stack}`);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(errors && { details: errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};
