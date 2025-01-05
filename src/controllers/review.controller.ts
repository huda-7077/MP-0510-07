import { Request, Response, NextFunction } from 'express';
import { createReviewService } from '../services/review/create-review.service';
import { getReviewsService } from '../services/review/get-reviews.service';

export const getReviewsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = Number(req.params.eventId);
    const result = await getReviewsService(eventId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
export const createReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, eventId, rating, comment } = req.body;
    const result = await createReviewService({
      userId,
      eventId,
      rating,
      comment,
    });
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};
