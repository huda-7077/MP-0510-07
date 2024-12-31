import { NextFunction, Request, Response } from "express";
import { getUserListsService } from "../services/user/get-user-lists.service";
import { updateUserRoleService } from "../services/user/update-user-role.service";
import { rejectUserRoleRequestService } from "../services/user/reject-user-role-request.service";

export const getUserListsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 10,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
      organizerPending: req.query.organizerPending
        ? req.query.organizerPending !== "false" &&
          req.query.organizerPending !== "0"
        : false,
      organizerApproved: req.query.organizerApproved
        ? req.query.organizerApproved !== "false" &&
          req.query.organizerApproved !== "0"
        : false,
    };

    const result = await getUserListsService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateUserRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await updateUserRoleService(req.body, res.locals.user.id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const rejectUserRoleRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await rejectUserRoleRequestService(
      req.body,
      res.locals.user.id
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
