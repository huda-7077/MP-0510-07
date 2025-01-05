import { Request, Response, NextFunction } from "express";
import { createVoucherService } from "../services/voucher/create-voucher.service";
import { getVoucherService } from "../services/voucher/get-voucher.service";

export const getVoucherController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await getVoucherService(id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
export const createVoucherController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createVoucherService(req.body);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};
