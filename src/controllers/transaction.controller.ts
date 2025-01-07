import { Request, Response, NextFunction } from "express";
import { createTransaction } from "../services/transaction/create-transaction.service";
import { getTransactionService } from "../services/transaction/get-transaction.service";
import { PaymentProofService } from "../services/transaction/payment-proof.service";
import { PrismaClient } from "@prisma/client";
import { updateTransactionService } from "../services/transaction/update-transaction.service";

const prisma = new PrismaClient();

export const createTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userIdFromToken = res.locals.user.id;
    const {
      eventId,
      quantity,
      pointsUsed,
      voucherCode,
      couponCode,
      paymentProof,
    } = req.body;
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

    if (!transactionId || isNaN(transactionId)) {
      res.status(400).json({ error: "Invalid transaction ID." });
      return;
    }

    if (!proofFile) {
      res.status(400).json({ error: "Payment proof is required." });
      return;
    }

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

export const updateTransactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await updateTransactionService(res.locals.user.id, req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
