import { generateUniqueCouponCode } from "../../lib/coupon";
import prisma from "../../lib/prisma";

interface ApplyReferralCodeBody {
  referrerCode: string;
}
export const applyReferralCodeService = async (
  userId: number,
  body: ApplyReferralCodeBody
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    const { referrerCode } = body;

    const normalizedReferralCode = referrerCode
      ? referrerCode.toLowerCase()
      : null;

    let referrer = null;
    if (normalizedReferralCode) {
      referrer = await prisma.user.findUnique({
        where: {
          referralCode: normalizedReferralCode,
        },
      });

      if (!referrer) {
        throw new Error("Invalid referral code!");
      }
    }

    if (referrer) {
      await prisma.referral.create({
        data: { inviterId: referrer.id, inviteeId: userId },
      });

      const pointsExpiryDate = new Date();
      pointsExpiryDate.setMinutes(pointsExpiryDate.getMinutes() + 10);

      await prisma.point.create({
        data: {
          userId: referrer.id,
          points: 10000,
          expiredAt: pointsExpiryDate,
        },
      });

      const couponExpiryDate = new Date();
      couponExpiryDate.setMinutes(couponExpiryDate.getMinutes() + 10);
      const uniqueCouponCode = await generateUniqueCouponCode();
      await prisma.coupon.create({
        data: {
          userId: userId,
          code: uniqueCouponCode,
          discountValue: 10000,
          expiresAt: couponExpiryDate,
        },
      });
    }
    return {
      message: "Apply referral code success",
    };
  } catch (error) {
    throw error;
  }
};
