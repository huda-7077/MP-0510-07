import { Role } from "@prisma/client";
import prisma from "../../lib/prisma";

interface GetUsersQuery {
  orderBy: string;
  year?: number;
}

export const getUsersDataService = async (
  query: GetUsersQuery,
  userId: number
) => {
  try {
    const { orderBy, year } = query;

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    if (user.role !== "ADMIN") {
      throw new Error("You are not an admin");
    }

    let usersData;

    if (orderBy === "1y" && year) {
      usersData = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") AS "date", 
          COUNT(*)::text AS "newUsers"
        FROM "users"
        WHERE DATE_PART('year', "createdAt") = ${year}
        GROUP BY "date"
        ORDER BY "date";
      `;
    } else if (orderBy === "30d") {
      usersData = await prisma.$queryRaw`
        SELECT 
          DATE("createdAt") AS "date", 
          COUNT(*)::text AS "newUsers"
        FROM "users"
        WHERE "createdAt" >= NOW() - INTERVAL '30 days'
        GROUP BY "date"
        ORDER BY "date";
      `;
    } else if (orderBy === "7d") {
      usersData = await prisma.$queryRaw`
        SELECT 
          DATE("createdAt") AS "date", 
          COUNT(*)::text AS "newUsers"
        FROM "users"
        WHERE "createdAt" >= NOW() - INTERVAL '7 days'
        GROUP BY "date"
        ORDER BY "date";
      `;
    } else {
      throw new Error("Invalid orderBy parameter");
    }

    const totalUsers = await prisma.user.count();

    const totalOrganizers = await prisma.user.count({
      where: {
        isDeleted: false,
        role: Role.ORGANIZER,
      },
    });

    const event = await prisma.event.count({
      where: {
        deletedAt: null,
      },
    });

    return {
      data: usersData,
      totalUsers,
      totalOrganizers,
      totalEvents: event,
    };
  } catch (error) {
    throw error;
  }
};
