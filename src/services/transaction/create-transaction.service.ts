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
    // Validate eventId
    const event = await tx.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new Error("Invalid eventId");
    }

    // Step 1: Validate user points
    if (pointsUsed) {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new Error("User not found");
      if (user.totalPoints < pointsUsed) {
        throw new Error("Insufficient points");
      }
    }

    // Step 2: Validate couponCode
    let coupon = null;
    if (couponCode) {
      coupon = await tx.coupon.findFirst({
        where: { code: couponCode, isUsed: false, expiresAt: { gte: new Date() } },
      });
      if (!coupon) throw new Error("Invalid or expired couponCode");
    }

    // Step 3: Validate voucherCode
    let voucher = null;
    if (voucherCode) {
      voucher = await tx.voucher.findFirst({
        where: {
          code: voucherCode,
          endDate: { gte: new Date() },
          startDate: { lte: new Date() },
        },
      });
      if (!voucher) {
        throw new Error("Invalid or expired voucherCode");
      }
    }

    // Step 4: Calculate total price
    let totalPrice = event.price * quantity;

    // Step 5: Apply discounts
    if (pointsUsed) totalPrice -= pointsUsed;
    if (voucher) totalPrice -= voucher.discountValue;
    if (coupon) totalPrice -= coupon.discountValue;
    if (totalPrice < 0) totalPrice = 0;

    // Step 6: Create transaction
    const transaction = await tx.transaction.create({
      data: {
        userId,
        eventId,
        quantity,
        pointsUsed: pointsUsed || 0,
        voucherId: voucher ? voucher.id : undefined,
        couponId: coupon ? coupon.id : undefined,
        paymentProof,
        status: TransactionStatus.WAITING_FOR_PAYMENT,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        totalPrice,
      },
    });

    // Step 7: Update available seats
    await tx.event.update({
      where: { id: eventId },
      data: { avaliableSeats: { decrement: quantity } },
    });

    // Step 8: Update user points
    if (pointsUsed) {
      await tx.user.update({
        where: { id: userId },
        data: { totalPoints: { decrement: pointsUsed } },
      });
    }

    // Step 9: Update coupon usage
    if (coupon) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { isUsed: true },
      });
    }

    return transaction;
  });
}

