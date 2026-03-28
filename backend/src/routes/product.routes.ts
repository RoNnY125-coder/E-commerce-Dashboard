import { Router } from 'express';
import { ProductService } from '../services/product.service';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { sendSuccess } from '../utils/response';
import multer from 'multer';
import { z } from 'zod';

const router = Router();
const productService = new ProductService();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.use(requireAuth);

const productSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    sku: z.string().min(2),
    price: z.number().positive(),
    category_id: z.string().optional(),
    description: z.string().optional(),
    inventory_qty: z.number().int().min(0).optional(),
    status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).optional()
  })
});

const listParams = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    status: z.string().optional(),
    categoryId: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
  })
});

router.get('/', validate(listParams), async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.user!.orgId, req.query);
    sendSuccess(res, 200, { data: result.items, meta: result.meta });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await productService.getProduct(req.params.id, req.user!.orgId);
    sendSuccess(res, 200, { data: product });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireRole(['OWNER', 'ADMIN', 'MANAGER']), validate(productSchema), async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.user!.orgId, req.body);
    sendSuccess(res, 201, { data: product });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireRole(['OWNER', 'ADMIN', 'MANAGER']), validate(productSchema), async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.user!.orgId, req.body);
    sendSuccess(res, 200, { data: product });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireRole(['OWNER', 'ADMIN', 'MANAGER']), async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id, req.user!.orgId);
    sendSuccess(res, 200, { data: { message: 'Product archived' } });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/images', requireRole(['OWNER', 'ADMIN', 'MANAGER']), upload.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      throw new Error('No files provided');
    }
    const product = await productService.uploadImages(req.params.id, req.user!.orgId, req.files as Express.Multer.File[]);
    sendSuccess(res, 200, { data: product });
  } catch (error) {
    next(error);
  }
});

export default router;
