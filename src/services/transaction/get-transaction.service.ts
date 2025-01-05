import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTransactionService = async (id: number) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        user: { 
          select: { 
            fullname: true, 
            totalPoints: true 
          } 
        },
        voucher: { 
          select: { 
            code: true, 
            discountValue: true 
          } 
        },
        coupon: { 
          select: { 
            code: true, 
            discountValue: true 
          } 
        },
        event: { 
          select: { 
            title: true 
          } 
        },
      },
    });

    if (!transaction) {
      throw new Error("Invalid transaction id");
    }

    return transaction;
  } catch (error) {
    console.error("Error in getTransactionService:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred."
    );
  }
};

