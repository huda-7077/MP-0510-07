import prisma from "../../lib/prisma";

interface CreateRewardsBody {
  pointsValue: number;
  couponsValue: number;
}
export const createRewardsService = async (
  userId: number,
  body: CreateRewardsBody
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    if (user.role !== "ADMIN") {
      throw new Error("You are not an admin");
    }

    const existingRewards = await prisma.reward.findFirst();

    if (existingRewards) {
      throw new Error("Rewards already exist!");
    }

    const { pointsValue, couponsValue } = body;

    await prisma.reward.create({
      data: {
        pointsValue,
        couponsValue,
      },
    });

    return {
      message: "Rewards created successfully",
    };
  } catch (error) {
    throw error;
  }
};
