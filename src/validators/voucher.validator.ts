import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const validateCreateVoucher = [
  body("code").notEmpty().withMessage("Code is required"),
  body("discountValue").notEmpty().withMessage("Discount value is required"),
  body("startDate").notEmpty().withMessage("Start date is required"),
  body("endDate").notEmpty().withMessage("End date is required"),
  body("eventId").notEmpty().withMessage("Event ID is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
