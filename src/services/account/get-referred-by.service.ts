import prisma from "../../lib/prisma";

export const getReferredByService = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("Invalid user id");
    }

    const userReferrer = await prisma.referral.findFirst({
      where: { inviteeId: userId },
      include: { inviter: { select: { fullname: true } } },
    });

    if (!userReferrer) {
      throw new Error("Not referred by anyone");
    }

    return {
      referredBy: userReferrer.inviter,
    };
  } catch (error) {
    throw error;
  }
};
