import { Router } from "express";
import {
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

export default router;
