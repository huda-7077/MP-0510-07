import { Prisma, TransactionStatus } from "@prisma/client";
import { PaginationQueryParams } from "../../types/pagination";
import prisma from "../../lib/prisma";

interface GetTransactionsQuery extends PaginationQueryParams {
  search: string;
  status?: TransactionStatus;
}

export const getTransactionsByOrganizerIdService = async (
  userId: number,
  query: GetTransactionsQuery
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

    const { page, sortBy, sortOrder, take, search, status } = query;

    const whereClause: Prisma.TransactionWhereInput = {
      event: { userId: userId },
      ...(search && {
        OR: [
          { user: { email: { contains: search, mode: "insensitive" } } },
          { event: { title: { contains: search, mode: "insensitive" } } },
        ],
      }),
      ...(status && { status: status }),
    };

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        user: {
          select: {
            fullname: true,
            email: true,
          },
        },
        event: { select: { title: true } },
        voucher: { select: { discountValue: true } },
        coupon: { select: { discountValue: true } },
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
