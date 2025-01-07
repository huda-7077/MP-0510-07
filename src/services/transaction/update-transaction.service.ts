import { TransactionStatus } from "@prisma/client";
import prisma from "../../lib/prisma";
import { sendTransactionEmail } from "../../lib/handlebars";

interface UpdateTransactionsBody {
  transactionId: number;
  isAccepted: boolean;
  isRejected: boolean;
}
export const updateTransactionService = async (
  userId: number,
  body: UpdateTransactionsBody
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    if (user.role !== "ORGANIZER") {
      throw new Error("You are not an organizer");
    }

    const { isAccepted, isRejected, transactionId } = body;

    if (!transactionId) {
      throw new Error("Transaction id cannot be empty");
    }

    if (isAccepted === undefined && isRejected === undefined) {
      throw new Error("You need to accept or reject the transaction");
    }

    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId },
    });

    const event = await prisma.event.findFirst({
      where: { id: transaction?.eventId },
    });

    if (event?.userId !== userId) {
      throw new Error("You are not an organizer of this event");
    }

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction?.status === TransactionStatus.WAITING_FOR_PAYMENT) {
      return {
        message: "Transaction waiting for payment",
      };
    }

    if (transaction?.status === TransactionStatus.DONE) {
      return {
        message: "Transaction already accepted",
      };
    }

    if (transaction?.status === TransactionStatus.REJECTED) {
      return {
        message: "Transaction already rejected",
      };
    }

    if (transaction?.status === TransactionStatus.CANCELED) {
      return {
        message: "Transaction already canceled",
      };
    }

    if (transaction?.status === TransactionStatus.EXPIRED) {
      return {
        message: "Transaction expired",
      };
    }

    let result;

    const existingUser = await prisma.user.findFirst({
      where: { id: transaction?.userId },
    });

    if (!existingUser) {
      throw new Error("Can't find user to send email");
    }

    if (isRejected) {
      result = await prisma.$transaction(async (prisma) => {
        await prisma.transaction.update({
          where: { id: transactionId },
          data: {
            status: TransactionStatus.REJECTED,
          },
        });

        const couponId = transaction?.couponId;
        if (couponId) {
          await prisma.coupon.update({
            where: { id: couponId },
            data: {
              isUsed: false,
            },
          });
        }

        await prisma.event.update({
          where: { id: transaction?.eventId },
          data: { avaliableSeats: { increment: transaction?.quantity } },
        });

        await prisma.user.update({
          where: { id: transaction?.userId },
          data: { totalPoints: { increment: transaction?.pointsUsed } },
        });

        const totalPriceBeforeDiscount =
          Number(transaction.quantity) * Number(event.price);
        const totalDiscount =
          totalPriceBeforeDiscount - Number(transaction?.totalPrice);

        await sendTransactionEmail({
          email: existingUser?.email,
          name: existingUser?.fullname,
          transactionStatus: "Rejected",
          ticketQuantity: String(Math.round(transaction?.quantity)),
          totalDiscount: totalDiscount.toFixed(2),
          total: Number(transaction?.totalPrice).toFixed(2),
          totalPrice: totalPriceBeforeDiscount.toFixed(2),
        });

        return {
          message: "Transaction rejected",
        };
      });
    }

    if (isAccepted) {
      result = await prisma.$transaction(async (prisma) => {
        await prisma.transaction.update({
          where: { id: transactionId },
          data: {
            status: TransactionStatus.DONE,
            acceptedAt: new Date(),
          },
        });

        const totalPriceBeforeDiscount =
          Number(transaction.quantity) * Number(event.price);
        const totalDiscount =
          totalPriceBeforeDiscount - Number(transaction?.totalPrice);

        await sendTransactionEmail({
          email: existingUser?.email,
          name: existingUser?.fullname,
          transactionStatus: "Accepted",
          ticketQuantity: String(Math.round(transaction?.quantity)),
          totalDiscount: totalDiscount.toFixed(2),
          total: Number(transaction?.totalPrice).toFixed(2),
          totalPrice: totalPriceBeforeDiscount.toFixed(2),
        });

        return {
          message: "Transaction accepted",
        };
      });
    }

    return result;
  } catch (error) {
    throw error;
  }
};
