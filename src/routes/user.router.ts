import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import {
  getUserListsController,
  rejectUserRoleRequestController,
  updateUserRoleController,
} from "../controllers/user.controller";

const router = Router();

router.get("/user-lists", verifyToken, getUserListsController);
router.patch("/user-lists", verifyToken, updateUserRoleController);
router.post("/reject", verifyToken, rejectUserRoleRequestController);

export default router;
