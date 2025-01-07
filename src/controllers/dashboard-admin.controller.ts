import { NextFunction, Request, Response } from "express";
import { getUsersDataService } from "../services/dashboard-admin/get-users-data.service";

export const getUsersDataController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      orderBy: (req.query.orderBy as string) || "1y",
      year: parseInt(req.query.year as string) || 2025,
    };

    const results = await getUsersDataService(query, res.locals.user.id);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
};
