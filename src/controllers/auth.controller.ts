import { NextFunction, Request, Response } from "express";
import { loginService } from "../services/auth/login.service";


export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await loginService(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
