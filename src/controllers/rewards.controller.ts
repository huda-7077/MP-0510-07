import { NextFunction, Request, Response } from "express";
import { updateRewardsService } from "../services/rewards/update-rewards.service";
import { createRewardsService } from "../services/rewards/create-rewards.service";
import { getRewardsService } from "../services/rewards/get-rewards.service";

export const getRewardsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getRewardsService(res.locals.user.id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createRewardsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createRewardsService(res.locals.user.id, req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateRewardsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await updateRewardsService(res.locals.user.id, req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
