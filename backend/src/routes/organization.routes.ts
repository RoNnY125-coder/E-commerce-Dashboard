import { Router } from 'express';
import { OrganizationRepository } from '../repositories/organization.repository';
import { requireAuth, requireRole } from '../middleware/auth';
import { sendSuccess } from '../utils/response';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();
const orgRepo = new OrganizationRepository();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const org = await orgRepo.findById(req.user!.orgId);
    sendSuccess(res, 200, { data: org });
  } catch (error) {
    next(error);
  }
});

const updateOrgSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    billing_email: z.string().email().optional(),
    logo_url: z.string().url().optional()
  })
});

router.put('/', requireRole(['OWNER', 'ADMIN']), validate(updateOrgSchema), async (req, res, next) => {
  try {
    const org = await orgRepo.update(req.user!.orgId, req.body);
    sendSuccess(res, 200, { data: org });
  } catch (error) {
    next(error);
  }
});

router.get('/members', async (req, res, next) => {
  try {
    const members = await orgRepo.getMembers(req.user!.orgId);
    sendSuccess(res, 200, { data: members });
  } catch (error) {
    next(error);
  }
});

export default router;
