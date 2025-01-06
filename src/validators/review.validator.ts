// src/validators/review.validator.ts
import { Request, Response, NextFunction } from "express";

export const validateCreateReview = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({
        status: "error",
        message: "Rating must be a number between 1 and 5"
      });
    }

    if (!comment || typeof comment !== 'string' || comment.trim() === '') {
      return res.status(400).json({
        status: "error",
        message: "Comment is required and must be a non-empty string"
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};