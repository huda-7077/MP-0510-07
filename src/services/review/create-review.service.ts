import { PrismaClient } from "@prisma/client";
import { CreateReviewDTO } from "../../dtos/review.dto";

const prisma = new PrismaClient();

export class CreateReviewService {
  async execute(data: CreateReviewDTO) {
    try {
      // Check if event exists
      const event = await prisma.event.findUnique({
        where: { id: data.eventId },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Check if user has already reviewed this event
      const existingReview = await prisma.review.findFirst({
        where: {
          userId: data.userId,
          eventId: data.eventId,
        },
      });

      if (existingReview) {
        throw new Error(`You've already submitted a review for this event.`);
      }

      // Validate rating
      if (data.rating < 1 || data.rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      // Create review
      const review = await prisma.review.create({
        data: {
          userId: data.userId,
          eventId: data.eventId,
          rating: data.rating,
          comment: data.comment,
        },
        include: {
          user: {
            select: {
              fullname: true,
              profilePicture: true,
            },
          },
          event: {
            select: {
              title: true,
            },
          },
        },
      });

      return {
        status: "success",
        message: "Review created successfully",
        data: review,
      };
    } catch (error) {
      throw error;
    }
  }
}
