import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import {
  createRewardsController,
  getRewardsController,
  updateRewardsController,
} from "../controllers/rewards.controller";
import { validateChangeRewards } from "../validators/rewards.validator";

const router = Router();

router.get("/", verifyToken, getRewardsController);
router.post("/", verifyToken, validateChangeRewards, createRewardsController);
router.patch("/", verifyToken, validateChangeRewards, updateRewardsController);

export default router;
