import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateEvent = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price").notEmpty().withMessage("Price is required"),
  body("startDate").notEmpty().withMessage("Start date is required"),
  body("endDate").notEmpty().withMessage("End date is required"),
  body("avaliableSeats").notEmpty().withMessage("Avaliable seats is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("eventCategory").notEmpty().withMessage("Event category is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
