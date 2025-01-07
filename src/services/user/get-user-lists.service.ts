import { Prisma, Role } from "@prisma/client";
import { PaginationQueryParams } from "../../types/pagination";
import prisma from "../../lib/prisma";

interface GetUserListsQuery extends PaginationQueryParams {
  search: string;
  organizerPending?: boolean;
  organizerApproved?: boolean;
}

export const getUserListsService = async (query: GetUserListsQuery) => {
  try {
    const {
      page,
      sortBy,
      sortOrder,
      take,
      search,
      organizerPending,
      organizerApproved,
    } = query;

    // const whereClause: Prisma.UserWhereInput = {
    //   isDeleted: false,
    // };

    const whereClause: Prisma.UserWhereInput = {
      isDeleted: false,
    };

    // Tambahkan kondisi pencarian
    if (search) {
      whereClause.OR = [
        { fullname: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        {
          role: {
            in: Object.values(Role).filter((role) =>
              role.toLowerCase().includes(search.toLowerCase())
            ),
          },
        },
      ];
    }

    whereClause.AND = whereClause.AND || [];
    // Dapatkan userId dari organizerAccepted dan organizerRequest
    const organizerAccepted = await prisma.organizer.findMany({
      where: { acceptedAt: { not: null } },
      select: { userId: true },
    });

    const organizerRequest = await prisma.organizer.findMany({
      where: { acceptedAt: null },
      select: { userId: true },
    });

    const acceptedUserIds = organizerAccepted.map((org) => org.userId);
    const pendingUserIds = organizerRequest.map((org) => org.userId);

    // Tambahkan kondisi untuk organizerApproved dan organizerPending
    if (organizerApproved && organizerPending) {
      whereClause.AND = {
        OR: [{ id: { in: acceptedUserIds } }, { id: { in: pendingUserIds } }],
      };
    } else if (organizerApproved) {
      whereClause.AND = {
        id: { in: acceptedUserIds },
      };
    } else if (organizerPending) {
      whereClause.AND = {
        id: { in: pendingUserIds },
      };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        fullname: true,
        email: true,
        profilePicture: true,
        role: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        organizers: true,
      },
    });

    const count = await prisma.user.count({ where: whereClause });

    return {
      data: users,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
