import jwt from 'jsonwebtoken';
import { User, Organization } from '@prisma/client';

export interface TokenPayload {
  userId: string;
  orgId: string;
  role: string;
}

export const signAccessToken = (user: User, org: Organization): string => {
  const payload: TokenPayload = {
    userId: user.id,
    orgId: org.id,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
};

export const signRefreshToken = (user: User, org: Organization): string => {
  const payload: TokenPayload = {
    userId: user.id,
    orgId: org.id,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
};
