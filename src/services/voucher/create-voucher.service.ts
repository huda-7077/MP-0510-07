import prisma from "../../lib/prisma";

interface CreatePromotionBody {
  eventId: number;
  code: string;
  discountValue: number;
  startDate: string;
  endDate: string;
}

export const createVoucherService = async (body: CreatePromotionBody) => {
  try {
    const { code } = body;

    const existingPromotion = await prisma.voucher.findFirst({
      where: { code },
    });

    if (existingPromotion) {
      throw new Error("Promotion with the same title already exists.");
    }

    return await prisma.voucher.create({
      data: {
        code,
        discountValue: body.discountValue,
        startDate: body.startDate,
        endDate: body.endDate,
        eventId: body.eventId,
      },
    });
  } catch (error) {
    throw error;
  }
};
