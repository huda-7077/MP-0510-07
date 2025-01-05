import { User } from "@prisma/client";
import { hashPassword } from "../../lib/argon";
import { generateReferralCode } from "../../lib/referral";
import { generateUniqueCouponCode } from "../../lib/coupon";
import prisma from "../../lib/prisma";

interface RegisterInput
  extends Omit<
    User,
    "id" | "createdAt" | "updatedAt" | "totalPoints" | "referralCode"
  > {
  referralCode?: string;
}
export const registerService = async (body: RegisterInput) => {
  try {
    const { fullname, email, password, referralCode } = body;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });
    if (existingUser) {
      throw new Error("Email already exist!");
    }
    const normalizedReferralCode = referralCode
      ? referralCode.toLowerCase()
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

    const hashedPassword = await hashPassword(password);
    const userReferralCode = generateReferralCode();

    const newUser = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
        referralCode: userReferralCode,
      },
    });
    if (referrer) {
      const rewards = await prisma.reward.findFirst();

      const points = rewards?.pointsValue || 10000;
      const coupons = rewards?.couponsValue || 10000;

      await prisma.referral.create({
        data: { inviterId: referrer.id, inviteeId: newUser.id },
      });

      const pointsExpiryDate = new Date();
      pointsExpiryDate.setMonth(pointsExpiryDate.getMonth() + 3);

      await prisma.user.update({
        where: { id: referrer.id },
        data: {
          totalPoints: referrer.totalPoints + points,
          pointExpiryDate: pointsExpiryDate,
        },
      });

      const couponExpiryDate = new Date();
      couponExpiryDate.setMonth(couponExpiryDate.getMonth() + 3);
      const uniqueCouponCode = await generateUniqueCouponCode();
      await prisma.coupon.create({
        data: {
          userId: newUser.id,
          code: uniqueCouponCode,
          discountValue: coupons,
          expiresAt: couponExpiryDate,
        },
      });
    }
    return newUser;
  } catch (error) {
    throw error;
  }
};
