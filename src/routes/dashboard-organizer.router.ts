import { Router } from "express";
import {
  getAttendeesByEventIdController,
  getEventsByOrganizerIdController,
  getTransactionsByOrganizerIdController,
  getTransactionsDataController,
} from "../controllers/dashboard-organizer.controller";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.get("/", verifyToken, getTransactionsDataController);
router.get(
  "/transactions",
  verifyToken,
  getTransactionsByOrganizerIdController
);
router.get("/event-lists", verifyToken, getEventsByOrganizerIdController);
router.get("/attendees/:id", verifyToken, getAttendeesByEventIdController);

export default router;
