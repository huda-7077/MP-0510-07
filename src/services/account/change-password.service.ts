import { comparePassword, hashPassword } from "../../lib/argon";
import prisma from "../../lib/prisma";

interface changePasswordBody {
  password: string;
  newPassword: string;
}

export const changePasswordService = async (
  userId: number,
  body: changePasswordBody
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    const { password, newPassword } = body;

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: "Change password success" };
  } catch (error) {
    throw error;
  }
};
