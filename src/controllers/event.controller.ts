import { NextFunction, Request, Response } from "express";
import { createEventService } from "../services/event/create-event.service";
import { getEventsService } from "../services/event/get-events.service";
import { getEventService } from "../services/event/get-event.service";
import { deleteEventService } from "../services/event/delete-event.service";
import { getEventsByOrganizerIdService } from "../services/event/get-events-by-organizer-id.service";
import { editEventService } from "../services/event/edit-event.service";

export const getEventsController = async (
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
      category: (req.query.category as string) || "",
      location: (req.query.location as string) || "",
    };
    const events = await getEventsService(query);
    res.status(200).json(events);
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
export const getEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await getEventService(id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
export const createEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };
    const result = await createEventService(
      req.body,
      files.thumbnail?.[0],
      res.locals.user.id
    );
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};
export const editEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };
    const result = await editEventService(
      req.body,
      files.thumbnail?.[0],
      res.locals.user.id,
      Number(req.params.id)
    );

    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};
export const deleteEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(res.locals.user.id);
    const result = await deleteEventService(id, userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
