import { Prisma, TransactionStatus } from "@prisma/client";
import { PaginationQueryParams } from "../../types/pagination";
import prisma from "../../lib/prisma";

interface GetAttendeeQuery extends PaginationQueryParams {
  search: string;
}

export const getAttendeesByEventIdService = async (
  eventId: number,
  userId: number,
  query: GetAttendeeQuery
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    if (user.role !== "ORGANIZER") {
      throw new Error("You are not an organizer");
    }

    const event = await prisma.event.findFirst({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error("Invalid event id");
    }

    if (event.userId !== userId) {
      throw new Error("You are not authorized to view this event");
    }

    const { page, sortBy, sortOrder, take, search } = query;

    const whereClause: Prisma.TransactionWhereInput = {
      event: { id: eventId },
      status: { in: [TransactionStatus.DONE] },
      ...(search && {
        OR: [{ user: { email: { contains: search, mode: "insensitive" } } }],
      }),
    };

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        user: {
          select: {
            fullname: true,
            email: true,
          },
        },
        status: true,
        event: { select: { title: true } },
        quantity: true,
        totalPrice: true,
      },
    });

    const count = await prisma.transaction.count({ where: whereClause });
    return {
      data: transactions,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
