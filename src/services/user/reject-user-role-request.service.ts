import { cloudinaryRemove } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";

interface RejectUserRoleRequestBody {
  userIdTarget: number;
  reasons: string;
}

export const rejectUserRoleRequestService = async (
  body: RejectUserRoleRequestBody,
  userId: number
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

    const { userIdTarget, reasons } = body;
    const organizer = await prisma.organizer.findFirst({
      where: { userId: userIdTarget },
    });

    if (!organizer) {
      throw new Error("Organizer not found, User not requested");
    }

    if (!userIdTarget) {
      throw new Error("User id target cannot be empty");
    }

    if (!reasons) {
      throw new Error("Reasons cannot be empty");
    }

    console.log(reasons);

    if (organizer.acceptedAt) {
      throw new Error("User already accepted. Cannot reject");
    }

    if (organizer.governmentId !== null) {
      await cloudinaryRemove(organizer.governmentId);
    }

    await prisma.organizer.delete({
      where: { userId: userIdTarget },
    });

    return { message: "Reject user role success" };
  } catch (error) {
    throw error;
  }
};
