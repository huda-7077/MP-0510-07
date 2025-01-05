import { Request, Response, NextFunction } from "express";
import { createTransaction } from "../services/transaction/create-transaction.service";
import { getTransactionService } from "../services/transaction/get-transaction.service";
import { PaymentProofService } from "../services/transaction/payment-proof.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get userId from res.locals.user (set by auth middleware)
    const userIdFromToken = res.locals.user.id;

    // Get other fields from the request body
    const {
      eventId,
      quantity,
      pointsUsed,
      voucherCode,
      couponCode,
      paymentProof,
    } = req.body;

    // Call createTransaction service with verified userId
    const result = await createTransaction({
      userId: userIdFromToken,
      eventId,
      quantity,
      pointsUsed,
      voucherCode,
      couponCode,
      paymentProof,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await getTransactionService(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const PaymentProofController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const proofFile = req.file as Express.Multer.File;
    const transactionId = Number(req.params.id);

    // Input validation
    if (!transactionId || isNaN(transactionId)) {
      res.status(400).json({ error: "Invalid transaction ID." });
      return;
    }

    if (!proofFile) {
      res.status(400).json({ error: "Payment proof is required." });
      return;
    }

    // Call service to update transaction
    const updatedTransaction = await PaymentProofService({
      transactionId,
      paymentProof: proofFile,
    });

    res.status(200).json({
      message: "Payment proof uploaded successfully.",
      data: updatedTransaction,
    });
  } catch (error) {
    next(error);
  }
};

