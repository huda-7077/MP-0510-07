import { cloudinaryRemove, cloudinaryUpload } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";

interface EditEventBody {
  eventCategory: string;
  title: string;
  description: string;
  full_description: string;
  price: string;
  startDate: string;
  endDate: string;
  avaliableSeats: string;
  location: string;
}

export const editEventService = async (
  body: EditEventBody,
  thumbnail: Express.Multer.File | undefined,
  userId: number,
  eventId: number
) => {
  try {
    const { title, price, startDate, endDate, avaliableSeats } = body;

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
      where: { id: eventId },
    });

    const existingEvent = await prisma.event.findFirst({
      where: {
        id: { not: eventId },
        title: title,
        deletedAt: null,
      },
    });

    if (existingEvent && existingEvent.title === title) {
      throw new Error("Event with the same title already exists.");
    }

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.userId !== userId) {
      throw new Error("You are not authorized to edit this event");
    }

    let secure_url: string | undefined;
    if (thumbnail) {
      if (event.thumbnail !== null) {
        await cloudinaryRemove(event.thumbnail);
      }

      const uploadResult = await cloudinaryUpload(thumbnail);
      secure_url = uploadResult.secure_url;
    }

    await prisma.event.update({
      where: { id: eventId },
      data: secure_url
        ? {
            ...body,

            price: numericPrice,
            startDate: start,
            endDate: end,
            avaliableSeats: numericSeats,
            thumbnail: secure_url,
            userId,
          }
        : {
            ...body,
            price: numericPrice,
            startDate: start,
            endDate: end,
            avaliableSeats: numericSeats,
            userId,
          },
    });

    return { message: "Edit event success" };
  } catch (error) {
    throw error;
  }
};
