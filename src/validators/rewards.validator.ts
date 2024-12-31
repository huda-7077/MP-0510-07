import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateChangeRewards = [
  body("pointsValue").notEmpty().withMessage("Points value is required"),
  body("couponsValue").notEmpty().withMessage("Coupons value is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
