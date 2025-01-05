import { cloudinaryUpload } from "../../lib/cloudinary";
import { PrismaClient, TransactionStatus } from "@prisma/client";

const prisma = new PrismaClient();

interface UploadPaymentProofBody {
  transactionId: number;
  paymentProof: any; // or a more specific type if you know it, e.g., Express.Multer.File
}

export const PaymentProofService = async ({
  transactionId,
  paymentProof,
}: UploadPaymentProofBody) => {
  if (!transactionId || !paymentProof) {
    throw new Error("Transaction ID and payment proof are required.");
  }

  try {
    // Upload file to Cloudinary
    const { secure_url } = await cloudinaryUpload(paymentProof);

    if (!secure_url) {
      throw new Error("Failed to upload payment proof to Cloudinary.");
    }

    // Ensure the transaction with the given ID exists
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true, event: true },
    });

    if (!transaction) {
      throw new Error(`Transaction with ID ${transactionId} not found.`);
    }

    // Validate transaction status
    if (transaction.status !== TransactionStatus.WAITING_FOR_PAYMENT) {
      throw new Error("Only transactions waiting for payment can upload payment proof.");
    }

    // Update transaction with payment proof URL
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

