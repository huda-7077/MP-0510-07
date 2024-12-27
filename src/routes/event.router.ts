import { Router } from "express";
import { getEventsController } from "../controllers/event.controller";

const eventRouter = Router();

eventRouter.get("/", getEventsController);

export default eventRouter;

