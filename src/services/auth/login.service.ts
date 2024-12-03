import { User } from "@prisma/client";
import { comparePassword } from "../../lib/argon";
import { sign } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { JWT_SECRET_KEY } from "../../config";

export const loginService = async (body: User) => {
  try {
    const { email, password } = body;
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }],
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // exclude password
    const { password: pw, isDeleted, ...userWithoutPassword } = user;

    const tokenPayload = { id: user.id, role: user.role };

    const token = sign(tokenPayload, JWT_SECRET_KEY!, {
      expiresIn: "1h",
    });

    return {
      success: true,
      data: { user: { ...userWithoutPassword }, token },
      message: "Login Successful",
    };
  } catch (error) {
    throw error;
  }
};
