import { cloudinaryUpload } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";

interface CreateEventBody {
  eventCategoriesId: string;
  title: string;
  description: string;
  full_description: string;
  price: string;
  startDate: string;
  endDate: string;
  avaliableSeats: string;
  location: string;
}

export const createEventService = async (
  body: CreateEventBody,
  thumbnail: Express.Multer.File,
  userId: number
) => {
  try {
    const {
      title,
      description,
      full_description,
      price,
      startDate,
      endDate,
      avaliableSeats,
      location,
      eventCategoriesId,
    } = body;

    const numericPrice = parseInt(price, 10);
    const numericSeats = parseInt(avaliableSeats, 10);
    const numericCategoryId = parseInt(eventCategoriesId, 10);

    if (
      isNaN(numericPrice) ||
      isNaN(numericSeats) ||
      isNaN(numericCategoryId)
    ) {
      throw new Error("Invalid numeric values provided.");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date values provided.");
    }

    const event = await prisma.event.findFirst({
      where: { title },
    });

    if (event) {
      throw new Error("Title already exists");
    }

    const { secure_url } = await cloudinaryUpload(thumbnail);

    return await prisma.event.create({
      data: {
        title,
        description,
        full_description,
        price: numericPrice,
        startDate: start,
        endDate: end,
        avaliableSeats: numericSeats,
        location,
        eventCategoriesId: numericCategoryId,
        thumbnail: secure_url,
        userId,
      },
    });
  } catch (error) {
    throw error;
  }
};
