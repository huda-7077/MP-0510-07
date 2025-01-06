import { Router } from "express";
import { getTransactionsDataController } from "../controllers/dashboard-organizer.controller";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.get("/", verifyToken, getTransactionsDataController);

export default router;
