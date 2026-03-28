import { Router } from 'express';
import { ProfileService } from '../services/profile.service';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { sendSuccess } from '../utils/response';
import multer from 'multer';
import { z } from 'zod';

const router = Router();
const profileService = new ProfileService();

// Config multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

router.use(requireAuth);

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    timezone: z.string().optional(),
    language: z.string().optional(),
    notification_prefs: z.any().optional()
  })
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8)
  })
});

router.get('/', async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user!.userId);
    sendSuccess(res, 200, { data: profile });
  } catch (error) {
    next(error);
  }
});

router.put('/update', validate(updateProfileSchema), async (req, res, next) => {
  try {
    const profile = await profileService.updateProfile(req.user!.userId, req.body);
    sendSuccess(res, 200, { data: profile });
  } catch (error) {
    next(error);
  }
});

router.put('/change-password', validate(changePasswordSchema), async (req, res, next) => {
  try {
    await profileService.changePassword(req.user!.userId, req.body);
    sendSuccess(res, 200, { data: { message: 'Password changed successfully' } });
  } catch (error) {
    next(error);
  }
});

router.post('/avatar', upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) throw new Error('No file provided');
    const result = await profileService.uploadAvatar(req.user!.userId, req.file.buffer);
    sendSuccess(res, 200, { data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/sessions', async (req, res, next) => {
  try {
    const sessions = await profileService.getActiveSessions(req.user!.userId);
    sendSuccess(res, 200, { data: sessions });
  } catch (error) {
    next(error);
  }
});

router.delete('/sessions/:id', async (req, res, next) => {
  try {
    await profileService.revokeSession(req.user!.userId, req.params.id);
    sendSuccess(res, 200, { data: { message: 'Session revoked' } });
  } catch (error) {
    next(error);
  }
});

export default router;
