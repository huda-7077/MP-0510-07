import prisma from "../../lib/prisma";

export const getReviewsService = async (eventId: number) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { eventId },
      include: { user: true },
    });

    return reviews;
  } catch (error) {
    throw error;
  }
};
