import prisma from "../../lib/prisma";

interface CreateReviewBody {
  userId: number;
  eventId: number;
  rating: number;
  comment: string;
}

export const createReviewService = async (body: CreateReviewBody) => {
  try {
    const { userId, eventId, rating, comment } = body;

    // Check if the user has already reviewed this event
    const existingReview = await prisma.review.findFirst({
      where: { userId, eventId },
    });

    if (existingReview) {
      throw new Error("You have already reviewed this event.");
    }

    // Create a new review
    return await prisma.review.create({
      data: {
        userId,
        eventId,
        rating,
        comment,
      },
    });
  } catch (error) {
    throw error;
  }
};

