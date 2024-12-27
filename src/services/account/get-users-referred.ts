import prisma from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface getReferredUsersQuery extends PaginationQueryParams {}

export const getReferredUsersService = async (
  userId: number,
  query: getReferredUsersQuery
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("Invalid user id");
    }

    const { page, sortBy, sortOrder, take } = query;

    const referredUsers = await prisma.referral.findMany({
      where: { inviterId: userId },
      skip: (page - 1) * take,
      take: take,
      orderBy: { [sortBy]: sortOrder },
      include: { invitee: { select: { fullname: true } } },
    });

    if (!referredUsers) {
      throw new Error("No users referred");
    }

    const count = await prisma.referral.count({ where: { inviterId: userId } });

    return {
      data: referredUsers,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
