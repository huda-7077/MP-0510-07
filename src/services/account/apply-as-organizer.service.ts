import { cloudinaryUpload } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";

interface ApplyAsOrganizerBody {
  companyName: string;
  companyWebsite: string;
  companyAddress: string;
  companyRole: string;
  details: string;
}

export const applyAsOrganizerService = async (
  userId: number,
  governmentId: Express.Multer.File,
  body: ApplyAsOrganizerBody
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    const existingOrganizer = await prisma.organizer.findFirst({
      where: { userId },
    });

    if (existingOrganizer) {
      throw new Error("You have already applied as an organizer");
    }

    if (user.role !== "USER") {
      throw new Error("You are not a user");
    }
    const { secure_url } = await cloudinaryUpload(governmentId);

    await prisma.organizer.create({
      data: {
        userId,
        ...body,
        governmentId: secure_url,
      },
    });

    return { message: "Your application has been submitted" };
  } catch (error) {
    throw error;
  }
};
