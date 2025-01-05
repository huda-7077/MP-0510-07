import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetReviewService {
  async getReviewsByEvent(eventId: number) {
    try {
      const reviews = await prisma.review.findMany({
        where: {
          eventId: eventId
        },
        include: {
          user: {
            select: {
              fullname: true,
              profilePicture: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Calculate average rating
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

      return {
        status: 'success',
        message: 'Reviews retrieved successfully',
        data: {
          reviews,
          summary: {
            totalReviews: reviews.length,
            averageRating: parseFloat(averageRating.toFixed(1))
          }
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getReviewsByUser(userId: number) {
    try {
      const reviews = await prisma.review.findMany({
        where: {
          userId: userId
        },
        include: {
          event: {
            select: {
              title: true,
              thumbnail: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return {
        status: 'success',
        message: 'Reviews retrieved successfully',
        data: reviews
      };
    } catch (error) {
      throw error;
    }
  }

  async getReviewById(reviewId: number) {
    try {
      const review = await prisma.review.findUnique({
        where: {
          id: reviewId
        },
        include: {
          user: {
            select: {
              fullname: true,
              profilePicture: true
            }
          },
          event: {
            select: {
              title: true,
              thumbnail: true
            }
          }
        }
      });

      if (!review) {
        throw new Error('Review not found');
      }

      return {
        status: 'success',
        message: 'Review retrieved successfully',
        data: review
      };
    } catch (error) {
      throw error;
    }
  }
}