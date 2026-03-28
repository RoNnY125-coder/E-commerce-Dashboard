import { Router } from 'express';
import { CustomerService } from '../services/customer.service';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { sendSuccess } from '../utils/response';
import { z } from 'zod';

const router = Router();
const customerService = new CustomerService();

router.use(requireAuth);

const customerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    avatar_url: z.string().url().optional(),
    notes: z.string().optional(),
    is_blocked: z.boolean().optional()
  })
});

router.get('/', async (req, res, next) => {
  try {
    const result = await customerService.getCustomers(req.user!.orgId, req.query);
    sendSuccess(res, 200, { data: result.items, meta: result.meta });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const customer = await customerService.getCustomer(req.params.id, req.user!.orgId);
    sendSuccess(res, 200, { data: customer });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireRole(['OWNER', 'ADMIN', 'MANAGER']), validate(customerSchema), async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(req.user!.orgId, req.body);
    sendSuccess(res, 201, { data: customer });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireRole(['OWNER', 'ADMIN', 'MANAGER']), validate(customerSchema), async (req, res, next) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.user!.orgId, req.body);
    sendSuccess(res, 200, { data: customer });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireRole(['OWNER', 'ADMIN']), async (req, res, next) => {
  try {
    await customerService.deleteCustomer(req.params.id, req.user!.orgId);
    sendSuccess(res, 200, { data: null });
  } catch (error) {
    next(error);
  }
});

export default router;
