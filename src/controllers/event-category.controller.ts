import { NextFunction, Request, Response } from "express";
import { createEventCategoryService } from "../services/event-category/create-event-category.service";
import { getEventCategoriesService } from "../services/event-category/get-event-categories.service";

export const getEventCategoriesController = async (
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
    const events = await getEventCategoriesService(query);
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};
export const createEventCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createEventCategoryService(req.body);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};
