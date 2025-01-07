import { TransactionStatus } from "@prisma/client";
import prisma from "./prisma";
import cron from "node-cron";

// Function untuk mengexpire transaksi yang belum upload bukti pembayaran setelah 2 jam
const expireTransactions = async () => {
  try {
    const expiredTransactions = await prisma.transaction.findMany({
      where: {
        status: TransactionStatus.WAITING_FOR_PAYMENT,
        expiresAt: {
          lt: new Date(), // Gunakan expiresAt daripada createdAt
        },
      },
      include: {
        user: true, // Include user untuk rollback points
      },
    });

    for (const transaction of expiredTransactions) {
      // Gunakan prisma.$transaction untuk atomic operations
      await prisma.$transaction(async (tx) => {
        // Update status transaksi
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: TransactionStatus.EXPIRED,
          },
        });

        // Kembalikan kursi yang tersedia sesuai quantity
        await tx.event.update({
          where: { id: transaction.eventId },
          data: { 
            avaliableSeats: { 
              increment: transaction.quantity 
            } 
          },
        });

        // Kembalikan points jika digunakan
        if (transaction.pointsUsed > 0) {
          await tx.user.update({
            where: { id: transaction.userId },
            data: {
              totalPoints: {
                increment: transaction.pointsUsed
              }
            }
          });
        }

        // Kembalikan status kupon ke unused jika menggunakan kupon
        if (transaction.couponId) {
          await tx.coupon.update({
            where: { id: transaction.couponId },
            data: { isUsed: false }
          });
        }
      });
    }
  } catch (error) {
    console.error('Error in expireTransactions:', error);
  }
};

// Function untuk membatalkan transaksi yang belum dikonfirmasi dalam 3 hari
const cancelUnconfirmedTransactions = async () => {
  try {
    const unconfirmedTransactions = await prisma.transaction.findMany({
      where: {
        status: TransactionStatus.WAITING_FOR_ADMIN_CONFIRMATION,
        createdAt: {
          lt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // 3 hari yang lalu
        },
      },
      include: {
        user: true,
      },
    });

    for (const transaction of unconfirmedTransactions) {
      await prisma.$transaction(async (tx) => {
        // Update status transaksi
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: TransactionStatus.CANCELED,
          },
        });

        // Kembalikan kursi yang tersedia sesuai quantity
        await tx.event.update({
          where: { id: transaction.eventId },
          data: { 
            avaliableSeats: { 
              increment: transaction.quantity 
            } 
          },
        });

        // Kembalikan points jika digunakan
        if (transaction.pointsUsed > 0) {
          await tx.user.update({
            where: { id: transaction.userId },
            data: {
              totalPoints: {
                increment: transaction.pointsUsed
              }
            }
          });
        }

        // Kembalikan status kupon ke unused jika menggunakan kupon
        if (transaction.couponId) {
          await tx.coupon.update({
            where: { id: transaction.couponId },
            data: { isUsed: false }
          });
        }
      });
    }
  } catch (error) {
    console.error('Error in cancelUnconfirmedTransactions:', error);
  }
};

// Scheduler berjalan setiap menit
cron.schedule("* * * * *", async () => {
  console.log("Menjalankan scheduled tasks...");
  
  try {
    await Promise.all([
      expireTransactions(),
      cancelUnconfirmedTransactions()
    ]);
  } catch (error) {
    console.error('Error in scheduler:', error);
  }
});