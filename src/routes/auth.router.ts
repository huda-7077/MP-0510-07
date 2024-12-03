import { Router } from "express";
import { loginController } from "../controllers/auth.controller";

const router = Router();

router.get("/", loginController);

export default router;
