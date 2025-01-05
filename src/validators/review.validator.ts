import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateReview = [
  body("userId").notEmpty().withMessage("User ID is required").isInt(),
  body("eventId").notEmpty().withMessage("Event ID is required").isInt(),
  body("rating").notEmpty().withMessage("Rating is required").isInt({ min: 1, max: 5 }),
  body("comment").notEmpty().withMessage("Comment is required").isString(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
