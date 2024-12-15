import { hashPassword } from "../../lib/argon";
import prisma from "../../lib/prisma";

export const resetPasswordService = async (
  userId: number,
  password: string
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("Invalid user id");
    }
    const hashedPassword = await hashPassword(password);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return { message: "Reset password success" };
  } catch (error) {
    throw error;
  }
};
