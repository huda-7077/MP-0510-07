import { cloudinaryUpload } from "../../lib/cloudinary";
import { PrismaClient, TransactionStatus } from "@prisma/client";

const prisma = new PrismaClient();

interface UploadPaymentProofBody {
  transactionId: number;
  paymentProof: any; 
}

export const PaymentProofService = async ({
  transactionId,
  paymentProof,
}: UploadPaymentProofBody) => {
  if (!transactionId || !paymentProof) {
    throw new Error("Transaction ID and payment proof are required.");
  }

  try {
    const { secure_url } = await cloudinaryUpload(paymentProof);

    if (!secure_url) {
      throw new Error("Failed to upload payment proof to Cloudinary.");
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true, event: true },
    });

    if (!transaction) {
      throw new Error(`Transaction with ID ${transactionId} not found.`);
    }

    if (transaction.status !== TransactionStatus.WAITING_FOR_PAYMENT) {
      throw new Error("Only transactions waiting for payment can upload payment proof.");
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentProof: secure_url,
        status: TransactionStatus.WAITING_FOR_ADMIN_CONFIRMATION,
      },
    });

    return updatedTransaction;
  } catch (error) {
    console.error("Error in PaymentProofService:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred."
    );
  }
};

