import { NextFunction, Request, Response } from "express";
import { updateProfileService } from "../services/account/update-profile.service";
import { getProfileService } from "../services/account/get-profile.service";
import { changePasswordService } from "../services/account/change-password.service";
import { applyAsOrganizerService } from "../services/account/apply-as-organizer.service";
import { getReferredUsersService } from "../services/account/get-users-referred";
import { applyReferralCodeService } from "../services/account/apply-referral-code.service";
import { getReferredByService } from "../services/account/get-referred-by.service";

export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    // const id = Number(req.params.id);

    const result = await getProfileService(userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getReferredByController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getReferredByService(res.locals.user.id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getReferredUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 5,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
    };

    const result = await getReferredUsersService(res.locals.user.id, query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const applyAsOrganizerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    const result = await applyAsOrganizerService(
      res.locals.user.id,
      files.governmentId?.[0],
      req.body
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const applyReferralCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await applyReferralCodeService(res.locals.user.id, req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    const result = await updateProfileService(
      req.body,
      files.profilePicture?.[0],
      res.locals.user.id
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.user.id);
    const body = req.body;
    const result = await changePasswordService(userId, body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
