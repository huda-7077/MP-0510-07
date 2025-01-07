import { NextFunction, Request, Response } from "express";
import { getTransactionsDataService } from "../services/dasboard-organizer/get-transactions-data.service";
import { getEventsByOrganizerIdService } from "../services/dasboard-organizer/get-events-by-organizer-id.service";
import { getTransactionsByOrganizerIdService } from "../services/dasboard-organizer/get-transactions-by-organizer.service";
import { TransactionStatus } from "@prisma/client";
import { getAttendeesByEventIdService } from "../services/dasboard-organizer/get-attendee-by-event.service";

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
export const getEventsByOrganizerIdController = async (
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
    const results = await getEventsByOrganizerIdService(
      res.locals.user.id,
      query
    );
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
};

export const getTransactionsByOrganizerIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 10,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "updatedAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
      status: req.query.status
        ? req.query.status === "ALL"
          ? undefined
          : (req.query.status as TransactionStatus)
        : undefined,
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
export const getAttendeesByEventIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 10,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "updatedAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
    };
    const id = Number(req.params.id);
    const results = await getAttendeesByEventIdService(
      id,
      res.locals.user.id,
      query
    );
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
};
