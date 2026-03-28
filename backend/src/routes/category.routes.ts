import { Router } from 'express';

// Category and Notifications are placeholders to not break the app router
const router = Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});

export default router;
