import { TransactionStatus } from "@prisma/client";
import prisma from "./prisma";
import cron from "node-cron";

// Function to expire transactions that haven't uploaded payment proof after 2 hours
const expireTransactions = async () => {
  const expiredTransactions = await prisma.transaction.findMany({
    where: {
      status: TransactionStatus.WAITING_FOR_PAYMENT,
      createdAt: {
        lt: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    },
  });

  for (const transaction of expiredTransactions) {
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: TransactionStatus.EXPIRED,
      },
    });

    // Restore available seats and rollback points
    await prisma.event.update({
      where: { id: transaction.eventId },
      data: { avaliableSeats: { increment: 1 } },
    });

    // Rollback points if used
    // Assuming you have a points system in your app
    // You can integrate point rollback here if needed
  }

  // console.log(`Expired ${expiredTransactions.length} transactions.`);
};

// Function to cancel transactions that haven't been confirmed within 3 days
const cancelUnconfirmedTransactions = async () => {
  const unconfirmedTransactions = await prisma.transaction.findMany({
    where: {
      status: TransactionStatus.WAITING_FOR_ADMIN_CONFIRMATION,
      createdAt: {
        lt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    },
  });

  for (const transaction of unconfirmedTransactions) {
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: TransactionStatus.CANCELED,
      },
    });

    // Restore available seats and rollback points
    await prisma.event.update({
      where: { id: transaction.eventId },
      data: { avaliableSeats: { increment: 1 } },
    });

    // Rollback points if used
    // Assuming you have a points system in your app
    // You can integrate point rollback here if needed
  }

  // console.log(
  //   `Cancelled ${unconfirmedTransactions.length} unconfirmed transactions.`
  // );
};

// Scheduler to run every minute
cron.schedule("* * * * *", async () => {
  // console.log("Running scheduled tasks...");

  // Call functions to expire and cancel transactions
  await expireTransactions();
  await cancelUnconfirmedTransactions();
});
