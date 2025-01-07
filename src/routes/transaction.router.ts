import { Router } from "express";
import { verifyToken } from "../lib/jwt";
import {
  createTransactionController,
  getTransactionController,
  PaymentProofController,
  updateTransactionController,
} from "../controllers/transaction.controller";
import { uploader } from "../lib/multer";
import { fileFilter } from "../lib/fileFilter";

const router = Router();

router.get("/:id", verifyToken, getTransactionController);
router.post("/create", verifyToken, createTransactionController);
router.patch(
  "/payment-proof/:id",
  verifyToken,
  uploader().single("paymentProof"),
  fileFilter,
  PaymentProofController
);
router.patch("/update", verifyToken, updateTransactionController);

export default router;
