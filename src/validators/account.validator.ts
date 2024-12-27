import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateChangePassword = [
  body("password").notEmpty().withMessage("Password is required"),
  body("newPassword").notEmpty().withMessage("New Password is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];

export const validateApplyAsOrganizer = [
  body("companyName").notEmpty().withMessage("Company name is required"),
  body("companyWebsite").notEmpty().withMessage("Company website is required"),
  body("companyAddress").notEmpty().withMessage("Company address is required"),
  body("companyRole").notEmpty().withMessage("Company role is required"),
  body("details").notEmpty().withMessage("Details is required"),
  body("governmentId").custom((value, { req }) => {
    if (!req.files || !req.files.governmentId) {
      throw new Error("Government ID is required");
    }
    return true;
  }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ message: errors.array()[0].msg });
      return;
    }

    next();
  },
];
