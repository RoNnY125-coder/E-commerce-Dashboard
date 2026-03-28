import { Router } from 'express';
import { OrderService } from '../services/order.service';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { sendSuccess } from '../utils/response';
import { z } from 'zod';

const router = Router();
const orderService = new OrderService();

router.use(requireAuth);

const orderSchema = z.object({
  body: z.object({
    customer_id: z.string().uuid(),
    payment_method: z.string().optional(),
    shipping_address: z.any().optional(),
    billing_address: z.any().optional(),
    notes: z.string().optional(),
    items: z.array(z.object({
      product_id: z.string().uuid(),
      quantity: z.number().int().positive(),
      variant_info: z.any().optional()
    })).min(1, 'Order must contain at least one item')
  })
});

const statusUpdateSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'])
  })
});

router.get('/', async (req, res, next) => {
  try {
    const result = await orderService.getOrders(req.user!.orgId, req.query);
    sendSuccess(res, 200, { data: result.items, meta: result.meta });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const order = await orderService.getOrder(req.params.id, req.user!.orgId);
    sendSuccess(res, 200, { data: order });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireRole(['OWNER', 'ADMIN', 'MANAGER']), validate(orderSchema), async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user!.orgId, req.body);
    sendSuccess(res, 201, { data: order });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', requireRole(['OWNER', 'ADMIN', 'MANAGER']), validate(statusUpdateSchema), async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.user!.orgId, req.body.status);
    sendSuccess(res, 200, { data: order });
  } catch (error) {
    next(error);
  }
});

export default router;
