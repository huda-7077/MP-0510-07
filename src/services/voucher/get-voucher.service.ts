import prisma from "../../lib/prisma";

export const getVoucherService = async (id: number) => {
  try {
    const event = await prisma.voucher.findUnique({
      where: { id },
    });

    if (!event) {
      throw new Error("Voucher not found");
    }
    return event;
  } catch (error) {
    throw error;
  }
};
