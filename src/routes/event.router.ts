import { Router } from "express";
import {
  createEventController,
  deleteEventController,
  editEventController,
  getEventController,
  getEventsByOrganizerIdController,
  getEventsController,
} from "../controllers/event.controller";
import { fileFilter } from "../lib/fileFilter";
import { verifyToken } from "../lib/jwt";
import { uploader } from "../lib/multer";
import { validateCreateEvent } from "../validators/event.validator";

const eventRouter = Router();

eventRouter.get("/", getEventsController);
eventRouter.get("/event-lists", verifyToken, getEventsByOrganizerIdController);
eventRouter.get("/:id", getEventController);
eventRouter.post(
  "/",
  verifyToken,
  uploader().fields([{ name: "thumbnail", maxCount: 1 }]),
  fileFilter,
  validateCreateEvent,
  createEventController
);
eventRouter.patch(
  "/:id",
  verifyToken,
  uploader().fields([{ name: "thumbnail", maxCount: 1 }]),
  fileFilter,
  validateCreateEvent,
  editEventController
);
eventRouter.delete("/:id", verifyToken, deleteEventController);

export default eventRouter;
