import { NextFunction, Request, Response } from "express";
import { getTransactionsDataService } from "../services/dasboard-organizer/get-transactions-data.service";

export const getTransactionsDataController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      orderBy: (req.query.orderBy as string) || "30d",
      year: parseInt(req.query.year as string) || 2025,
    };

    const results = await getTransactionsDataService(query, res.locals.user.id);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
};
