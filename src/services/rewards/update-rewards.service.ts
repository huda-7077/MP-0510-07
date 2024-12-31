import prisma from "../../lib/prisma";

interface UpdateRewardsBody {
  pointsValue: number;
  couponsValue: number;
}
export const updateRewardsService = async (
  userId: number,
  body: UpdateRewardsBody
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

    if (!existingRewards) {
      throw new Error("Rewards not found! You need to create them first!");
    }

    const { pointsValue, couponsValue } = body;

    await prisma.reward.update({
      where: { id: existingRewards.id },
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
