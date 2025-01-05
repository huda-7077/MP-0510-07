import { Router } from "express";
import {
  createReviewController,
  getReviewsController,
} from "../controllers/review.controller";
import { verifyToken } from "../lib/jwt";
import { validateCreateReview } from "../validators/review.validator";

const reviewRouter = Router();

reviewRouter.post(
  "/",
  verifyToken,
  validateCreateReview,
  createReviewController
);
reviewRouter.get("/:eventId", getReviewsController);

export default reviewRouter;
