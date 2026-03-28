import { Response } from 'express';

interface ResponsePayload<T> {
  data?: T;
  meta?: any;
}

export const sendSuccess = <T>(res: Response, statusCode: number = 200, payload: ResponsePayload<T>) => {
  return res.status(statusCode).json({
    success: true,
    ...payload
  });
};
