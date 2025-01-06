import { NextFunction, Request, Response } from "express";
import { CreateReviewService } from "../services/review/create-review.service";
import { GetReviewService } from "../services/review/get-reviews.service";

const createReviewService = new CreateReviewService();
const getReviewService = new GetReviewService();

export const createReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewData = {
      userId: res.locals.user.id,
      eventId: Number(req.body.eventId),
      rating: Number(req.body.rating),
      comment: req.body.comment
    };

    const result = await createReviewService.execute(reviewData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getEventReviewsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = Number(req.params.eventId);
    const result = await getReviewService.getReviewsByEvent(eventId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserReviewsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const result = await getReviewService.getReviewsByUser(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getReviewByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewId = Number(req.params.reviewId);
    const result = await getReviewService.getReviewById(reviewId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};