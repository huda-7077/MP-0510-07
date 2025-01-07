import { PrismaClient, TransactionStatus, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateTransactionParams {
  userId: number;
  eventId: number;
  quantity: number;
  pointsUsed?: number;
  voucherCode?: string;
  couponCode?: string;
  paymentProof: string;
}

export async function createTransaction({
  userId,
  eventId,
  quantity,
  pointsUsed,
  voucherCode,
  couponCode,
  paymentProof,
}: CreateTransactionParams) {
  return await prisma.$transaction(async (tx) => {
    if (quantity <= 0) {
      throw new Error("Jumlah tiket harus lebih dari 0");
    }

    const event = await tx.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new Error("Event tidak ditemukan");
    }

    if (event.endDate < new Date()) {
      throw new Error("Event sudah berakhir");
    }

    if (event.avaliableSeats < quantity) {
      throw new Error(`Hanya tersedia ${event.avaliableSeats} kursi`);
    }

    const user = await tx.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    if (voucherCode && couponCode) {
      throw new Error("Tidak dapat menggunakan voucher dan kupon sekaligus");
    }

    if (pointsUsed) {
      if (user.totalPoints < pointsUsed) {
        throw new Error("Poin tidak mencukupi");
      }
      
      const maxPointsUsage = Math.floor(event.price * quantity * 0.5);
      if (pointsUsed > maxPointsUsage) {
        throw new Error(`Maksimum penggunaan poin adalah ${maxPointsUsage} poin`);
      }
    }

    let coupon = null;
    if (couponCode) {
      coupon = await tx.coupon.findFirst({
        where: {
          code: couponCode,
          isUsed: false,
          expiresAt: { gte: new Date() },
          userId: userId, 
        },
      });
      if (!coupon) {
        throw new Error("Kupon tidak valid atau sudah kadaluarsa");
      }
    }

    let voucher = null;
    if (voucherCode) {
      voucher = await tx.voucher.findFirst({
        where: {
          code: voucherCode,
          eventId: eventId, 
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      });
      if (!voucher) {
        throw new Error("Voucher tidak valid atau sudah kadaluarsa");
      }
    }

    let totalPrice = event.price * quantity;

    if (pointsUsed) {
      totalPrice -= pointsUsed;
    }
    if (voucher) {
      totalPrice -= voucher.discountValue;
    }
    if (coupon) {
      totalPrice -= coupon.discountValue;
    }

    if (totalPrice < 0) {
      throw new Error("Total harga tidak boleh kurang dari 0");
    }

    const transaction = await tx.transaction.create({
      data: {
        userId,
        eventId,
        quantity,
        pointsUsed: pointsUsed || 0,
        voucherId: voucher?.id,
        couponId: coupon?.id,
        paymentProof,
        status: TransactionStatus.WAITING_FOR_PAYMENT,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 jam
        totalPrice,
      },
    });

    await tx.event.update({
      where: { id: eventId },
      data: { 
        avaliableSeats: { 
          decrement: quantity 
        } 
      },
    });

    if (pointsUsed) {
      await tx.user.update({
        where: { id: userId },
        data: { 
          totalPoints: { 
            decrement: pointsUsed 
          } 
        },
      });
    }

    if (coupon) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { isUsed: true },
      });
    }

    return transaction;
  });
}