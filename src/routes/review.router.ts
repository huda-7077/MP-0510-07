import { Router } from 'express';
import { 
  createReviewController,
  getEventReviewsController,
  getUserReviewsController,
  getReviewByIdController
} from '../controllers/review.controller';
import { verifyToken } from '../lib/jwt';

const router = Router();

router.post('/', verifyToken, createReviewController);
router.get('/event/:eventId', getEventReviewsController);
router.get('/user',verifyToken, getUserReviewsController);
router.get('/:reviewId', getReviewByIdController);

export default router;