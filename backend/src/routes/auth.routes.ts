import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { validate } from '../middleware/validation';
import { sendSuccess } from '../utils/response';
import { requireAuth } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { verifyRefreshToken, signAccessToken } from '../utils/jwt';
import { UserRepository } from '../repositories/user.repository';
import { OrganizationRepository } from '../repositories/organization.repository';
import { z } from 'zod';

const router = Router();
const authService = new AuthService();
const userRepo = new UserRepository();
const orgRepo = new OrganizationRepository();

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

// GET /me — Return current authenticated user + org
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await userRepo.findById(req.user!.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }

    const { password_hash, organization, ...userWithoutPassword } = user as any;

    sendSuccess(res, 200, {
      data: {
        user: userWithoutPassword,
        org: organization,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /refresh — Use httpOnly refresh token cookie to issue a new access token
router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, error: { message: 'No refresh token provided' } });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await userRepo.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: { message: 'User not found' } });
    }

    const org = await orgRepo.findById(user.organization_id);
    if (!org) {
      return res.status(401).json({ success: false, error: { message: 'Organization not found' } });
    }

    const newAccessToken = signAccessToken(user, org);

    sendSuccess(res, 200, { data: { accessToken: newAccessToken } });
  } catch (error) {
    return res.status(401).json({ success: false, error: { message: 'Invalid or expired refresh token' } });
  }
});

export default router;

