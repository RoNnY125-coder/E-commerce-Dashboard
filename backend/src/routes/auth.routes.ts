import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { validate } from '../middleware/validation';
import { sendSuccess } from '../utils/response';
import { requireAuth } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { z } from 'zod';

const router = Router();
const authService = new AuthService();

// Validation Schemas
const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    orgName: z.string().min(2, 'Organization name must be at least 2 characters'),
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })
});

router.post('/register', authRateLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    
    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    sendSuccess(res, 201, { data: { user: result.user, org: result.organization, accessToken: result.accessToken } });
  } catch (error) {
    next(error);
  }
});

router.post('/login', authRateLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    const result = await authService.login(req.body, ipAddress, userAgent);
    
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    sendSuccess(res, 200, { data: { user: result.user, org: result.organization, accessToken: result.accessToken } });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', requireAuth, async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken && req.user) {
      await authService.logout(req.user.userId, refreshToken);
    }
    
    res.clearCookie('refreshToken');
    sendSuccess(res, 200, { data: { message: 'Logged out successfully' } });
  } catch (error) {
    next(error);
  }
});

export default router;
