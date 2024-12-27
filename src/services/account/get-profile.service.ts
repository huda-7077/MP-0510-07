import prisma from "../../lib/prisma";

export const getProfileService = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    const { password: pass, ...userWithoutPassword } = user;

    return { ...userWithoutPassword };
  } catch (error) {
    throw error;
  }
};
