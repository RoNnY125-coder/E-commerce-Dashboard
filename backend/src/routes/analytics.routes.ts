import { Router } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { requireAuth } from '../middleware/auth';
import { sendSuccess } from '../utils/response';

const router = Router();
const analyticsService = new AnalyticsService();

router.use(requireAuth);

router.get('/dashboard', async (req, res, next) => {
  try {
    const dateRange = (req.query.range as string) || '12months';
    const data = await analyticsService.getDashboardData(req.user!.orgId, dateRange);
    
    sendSuccess(res, 200, { data });
  } catch (error) {
    next(error);
  }
});

// Since the frontend component splits these up, we can use the same generic query
router.get('/overview', async (req, res, next) => {
  try {
    const dateRange = (req.query.range as string) || '12months';
    const data = await analyticsService.getDashboardData(req.user!.orgId, dateRange);
    sendSuccess(res, 200, { data: data.overview });
  } catch (error) {
    next(error);
  }
});

router.get('/revenue', async (req, res, next) => {
  try {
    const dateRange = (req.query.range as string) || '12months';
    const data = await analyticsService.getDashboardData(req.user!.orgId, dateRange);
    sendSuccess(res, 200, { data: data.revenue });
  } catch (error) {
    next(error);
  }
});

router.get('/top-products', async (req, res, next) => {
  try {
    const dateRange = (req.query.range as string) || '12months';
    const data = await analyticsService.getDashboardData(req.user!.orgId, dateRange);
    sendSuccess(res, 200, { data: data.topProducts });
  } catch (error) {
    next(error);
  }
});

export default router;
