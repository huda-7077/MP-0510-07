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
    // Validasi quantity
    if (quantity <= 0) {
      throw new Error("Jumlah tiket harus lebih dari 0");
    }

    // Cek event
    const event = await tx.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new Error("Event tidak ditemukan");
    }

    // Validasi tanggal event
    if (event.endDate < new Date()) {
      throw new Error("Event sudah berakhir");
    }

    // Validasi ketersediaan kursi
    if (event.avaliableSeats < quantity) {
      throw new Error(`Hanya tersedia ${event.avaliableSeats} kursi`);
    }

    // Cek dan validasi user serta points
    const user = await tx.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    // Validasi penggunaan voucher dan kupon bersamaan
    if (voucherCode && couponCode) {
      throw new Error("Tidak dapat menggunakan voucher dan kupon sekaligus");
    }

    // Cek dan validasi points
    if (pointsUsed) {
      if (user.totalPoints < pointsUsed) {
        throw new Error("Poin tidak mencukupi");
      }
      
      // Maksimum penggunaan poin (50% dari total harga)
      const maxPointsUsage = Math.floor(event.price * quantity * 0.5);
      if (pointsUsed > maxPointsUsage) {
        throw new Error(`Maksimum penggunaan poin adalah ${maxPointsUsage} poin`);
      }
    }

    // Cek dan validasi kupon
    let coupon = null;
    if (couponCode) {
      coupon = await tx.coupon.findFirst({
        where: {
          code: couponCode,
          isUsed: false,
          expiresAt: { gte: new Date() },
          userId: userId, // Memastikan kupon milik user yang bersangkutan
        },
      });
      if (!coupon) {
        throw new Error("Kupon tidak valid atau sudah kadaluarsa");
      }
    }

    // Cek dan validasi voucher
    let voucher = null;
    if (voucherCode) {
      voucher = await tx.voucher.findFirst({
        where: {
          code: voucherCode,
          eventId: eventId, // Memastikan voucher untuk event yang sama
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      });
      if (!voucher) {
        throw new Error("Voucher tidak valid atau sudah kadaluarsa");
      }
    }

    // Kalkulasi total harga
    let totalPrice = event.price * quantity;

    // Terapkan diskon
    if (pointsUsed) {
      totalPrice -= pointsUsed;
    }
    if (voucher) {
      totalPrice -= voucher.discountValue;
    }
    if (coupon) {
      totalPrice -= coupon.discountValue;
    }

    // Validasi total harga
    if (totalPrice < 0) {
      throw new Error("Total harga tidak boleh kurang dari 0");
    }

    // Buat transaksi
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

    // Update ketersediaan kursi
    await tx.event.update({
      where: { id: eventId },
      data: { 
        avaliableSeats: { 
          decrement: quantity 
        } 
      },
    });

    // Update poin user jika digunakan
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

    // Update status kupon jika digunakan
    if (coupon) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { isUsed: true },
      });
    }

    return transaction;
  });
}