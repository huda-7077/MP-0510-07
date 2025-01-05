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
      const rewards = await prisma.reward.findFirst();

      const points = rewards?.pointsValue || 10000;
      const coupons = rewards?.couponsValue || 10000;

      await prisma.referral.create({
        data: { inviterId: referrer.id, inviteeId: userId },
      });

      const pointsExpiryDate = new Date();
      pointsExpiryDate.setMonth(pointsExpiryDate.getMonth() + 3);

      await prisma.user.update({
        where: { id: referrer.id },
        data: {
          totalPoints: points,
          pointExpiryDate: pointsExpiryDate,
        },
      });

      const couponExpiryDate = new Date();
      couponExpiryDate.setMonth(couponExpiryDate.getMonth() + 3);
      const uniqueCouponCode = await generateUniqueCouponCode();
      await prisma.coupon.create({
        data: {
          userId: userId,
          code: uniqueCouponCode,
          discountValue: coupons,
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
