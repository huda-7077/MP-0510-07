import { Router } from "express";
import {
  createEventCategoriesController,
  getEventCategoriesController,
} from "../controllers/event-category.controller";
import { verifyToken } from "../lib/jwt";
import { validateCreateEventCategories } from "../validators/event-category.validator";

const eventCategoryRouter = Router();

eventCategoryRouter.get("/", getEventCategoriesController);
eventCategoryRouter.post(
  "/",
  verifyToken,
  validateCreateEventCategories,
  createEventCategoriesController
);

export default eventCategoryRouter;
