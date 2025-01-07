import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import { createVoucherController, getVoucherController, getVouchersController } from "../controllers/voucher.controller";
import { validateCreateVoucher } from "../validators/voucher.validator";

const promotionRouter = Router();

promotionRouter.get("/:id", getVoucherController);
promotionRouter.post("/", verifyToken,validateCreateVoucher, createVoucherController);
promotionRouter.get("/", getVouchersController);

export default promotionRouter;

