import prisma from "../../lib/prisma";

export const getEventService = async (id: number) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { user: { select: { fullname: true } } },
    });

    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  } catch (error) {
    throw error;
  }
};
