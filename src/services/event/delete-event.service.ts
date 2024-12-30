import prisma from "../../lib/prisma";

export const deleteEventService = async (id: number, userId: number) => {
  try {
    const event = await prisma.event.findFirst({
      where: { id },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.userId !== userId) {
      throw new Error("You are not authorized to delete this event");
    }

    await prisma.event.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: "Event deleted successfully" };
  } catch (error) {
    throw error;
  }
};
