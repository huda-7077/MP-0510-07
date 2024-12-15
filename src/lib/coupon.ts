import crypto from "crypto";
import prisma from "./prisma";

export const generateUniqueCouponCode = async (): Promise<string> => {
  let uniqueCode: string;
  let isUnique = false;

  do {
    uniqueCode =
      "COUPON-" + crypto.randomBytes(4).toString("hex").toUpperCase();
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: uniqueCode },
    });
    if (!existingCoupon) {
      isUnique = true;
    }
  } while (!isUnique);

  return uniqueCode;
};
