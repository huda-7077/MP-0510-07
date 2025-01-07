import { Router } from "express";

import { verifyToken } from "../lib/jwt";
import { getUsersDataController } from "../controllers/dashboard-admin.controller";

const router = Router();

router.get("/", verifyToken, getUsersDataController);

export default router;
