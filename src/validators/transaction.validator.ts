import { NextFunction , Request, Response} from "express";
import { body, validationResult } from "express-validator";

export const validateCreateTransaction = [
  body("eventId").notEmpty().withMessage("Event ID is required"),
  body("couponId").optional().isInt().withMessage("Coupon ID must be an integer"),
  body("voucherId").optional().isInt().withMessage("Voucher ID must be an integer"),
  body("quantity").notEmpty().withMessage("Quantity is required").isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
  body("totalPrice").notEmpty().withMessage("Total price is required").isInt({ min: 1 }).withMessage("Total price must be a positive integer"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
