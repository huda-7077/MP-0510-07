import { Router } from "express";
import { getTransactionsByOrganizerIdController } from "../controllers/transaction-dummy.controller";
import { verifyToken } from "../lib/jwt";

const router = Router();

router.get("/", verifyToken, getTransactionsByOrganizerIdController);

export default router;
