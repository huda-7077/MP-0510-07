import { Voucher } from "@prisma/client";
import prisma from "../../lib/prisma";

export const getVouchersService = async (): Promise<Voucher[]> => {
  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return vouchers;
  } catch (error) {
    throw error;
  }
};
