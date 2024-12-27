import { Router } from "express";
import {
  applyAsOrganizerController,
  applyReferralCodeController,
  changePasswordController,
  getProfileController,
  getReferredByController,
  getReferredUsersController,
  updateProfileController,
} from "../controllers/account.controller";
import { verifyToken } from "../lib/jwt";
import { uploader } from "../lib/multer";
import { fileFilter } from "../lib/fileFilter";
import {
  validateApplyAsOrganizer,
  validateChangePassword,
} from "../validators/account.validator";

const router = Router();

router.get("/referrals", verifyToken, getReferredUsersController);
router.get("/referrals/by", verifyToken, getReferredByController);
router.get("/profile", verifyToken, getProfileController);
router.post(
  "/apply-as-organizer",
  verifyToken,
  uploader(2).fields([{ name: "governmentId", maxCount: 1 }]),
  fileFilter,
  validateApplyAsOrganizer,
  applyAsOrganizerController
);
router.post("/referrals/apply-code", verifyToken, applyReferralCodeController);
router.patch(
  "/",
  verifyToken,
  uploader(1).fields([{ name: "profilePicture", maxCount: 1 }]),
  fileFilter,
  updateProfileController
);
router.patch(
  "/change-password",
  verifyToken,
  validateChangePassword,
  changePasswordController
);

export default router;
