import { cloudinaryUpload } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";

interface CreateEventBody {
  title: string;
  description: string;
  full_description: string;
  price: string;
  startDate: string;
  endDate: string;
  avaliableSeats: string;
  location: string;
  category: string;
}

export const createEventService = async (
  body: CreateEventBody,
  thumbnail: Express.Multer.File,
  userId: number
) => {
  try {
    const {
      title,
      price,
      startDate,
      endDate,
      avaliableSeats,
      location,
      category,
    } = body;

    const numericPrice = parseInt(price, 10);
    const numericSeats = parseInt(avaliableSeats, 10);

    if (isNaN(numericPrice) || isNaN(numericSeats)) {
      throw new Error("Invalid numeric values provided.");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date values provided.");
    }

    const event = await prisma.event.findFirst({
      where: { title, deletedAt: null },
    });

    if (event) {
      throw new Error("Title already exists");
    }

    const { secure_url } = await cloudinaryUpload(thumbnail);

    return await prisma.event.create({
      data: {
        ...body,
        price: numericPrice,
        startDate: start,
        endDate: end,
        avaliableSeats: numericSeats,
        location,
        category,
        thumbnail: secure_url,
        userId,
      },
    });
  } catch (error) {
    throw error;
  }
};
