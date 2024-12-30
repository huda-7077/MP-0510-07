import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";

interface GetEventCategoriesQuery {
  search?: string;
}

export const getEventCategoriesService = async (
  query: GetEventCategoriesQuery
) => {
  try {
    const { search } = query;

    const whereClause: Prisma.EventCategoriesWhereInput = {};

    if (search) {
      whereClause.title = { contains: search, mode: "insensitive" };
    }

    const eventCategories = await prisma.eventCategories.findMany({
      where: whereClause,
      orderBy: {
        title: "asc",
      },
    });

    const count = await prisma.eventCategories.count({ where: whereClause });

    return {
      data: eventCategories,
      meta: { total: count },
    };
  } catch (error) {
    throw error;
  }
};
