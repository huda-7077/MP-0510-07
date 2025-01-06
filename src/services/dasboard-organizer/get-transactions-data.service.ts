import prisma from "../../lib/prisma";

interface GetTransactionsQuery {
  orderBy: string;
  year?: number;
}

export const getTransactionsDataService = async (
  query: GetTransactionsQuery,
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

    if (user.role !== "ORGANIZER") {
      throw new Error("You are not an organizer");
    }

    let transactions;

    if (orderBy === "1y" && year) {
      transactions = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "acceptedAt") AS "date", 
          SUM("quantity")::text AS "ticketsSold", 
          SUM("totalPrice")::text AS "revenue"
        FROM "transactions"
        WHERE DATE_PART('year', "acceptedAt") = ${year} AND "acceptedAt" IS NOT NULL
        GROUP BY "date"
        ORDER BY "date";
      `;
    } else if (orderBy === "30d") {
      transactions = await prisma.$queryRaw`
        SELECT 
          DATE("acceptedAt") AS "date", 
          SUM("quantity")::text AS "ticketsSold", 
          SUM("totalPrice")::text AS "revenue"
        FROM "transactions"
        WHERE "acceptedAt" >= NOW() - INTERVAL '30 days' AND "acceptedAt" IS NOT NULL
        GROUP BY "date"
        ORDER BY "date";
      `;
    } else if (orderBy === "7d") {
      transactions = await prisma.$queryRaw`
        SELECT 
          DATE("acceptedAt") AS "date", 
          SUM("quantity")::text AS "ticketsSold", 
          SUM("totalPrice")::text AS "revenue"
        FROM "transactions"
        WHERE "acceptedAt" >= NOW() - INTERVAL '7 days' AND "acceptedAt" IS NOT NULL
        GROUP BY "date"
        ORDER BY "date";
      `;
    } else {
      throw new Error("Invalid orderBy parameter");
    }

    // Mengambil total data yang ada di database
    const totalTicketsSold = await prisma.transaction.aggregate({
      where: { acceptedAt: { not: null } },
      _sum: { quantity: true },
    });

    const totalRevenue = await prisma.transaction.aggregate({
      where: { acceptedAt: { not: null } },
      _sum: { totalPrice: true },
    });

    const totalEvents = await prisma.transaction.groupBy({
      where: { acceptedAt: { not: null } },
      by: ["eventId"],
    });

    return {
      data: transactions,
      totalTicketsSold: totalTicketsSold._sum.quantity,
      totalRevenue: totalRevenue._sum.totalPrice,
      totalEvents: totalEvents.length,
    };
  } catch (error) {
    throw error;
  }
};
