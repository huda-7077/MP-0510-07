import prisma from "../../lib/prisma";

export const getRewardsService = async (userId: number) => {
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

    return existingRewards;
  } catch (error) {
    throw error;
  }
};
