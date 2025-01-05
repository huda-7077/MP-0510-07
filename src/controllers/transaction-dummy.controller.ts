import { NextFunction, Request, Response } from "express";
import { getTransactionsByOrganizerIdService } from "../services/transactions_dummy/get-transactions-by-organizer.service";

export const getTransactionsByOrganizerIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 10,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
    };
    const results = await getTransactionsByOrganizerIdService(
      res.locals.user.id,
      query
    );
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
};
