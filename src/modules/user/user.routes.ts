import { Router } from "express";
import { userController } from "./user.controller";
import authmiddleware, { UserRoles } from "../../middleware/authmiddleware";

const router = Router();


router.get(
  "/",authmiddleware(UserRoles.ADMIN),
 userController.getAllUsers
);

router.get(
  "/all",
 userController.getAdminDashboardStats
);

router.patch(
  "/ban/:id",
  authmiddleware(UserRoles.ADMIN),
  userController.banUserController
);
router.patch(
  "/unban/:id",
  authmiddleware(UserRoles.ADMIN),
  userController.unbanUserController
);
router.patch('/profile',authmiddleware(UserRoles.STUDENT,UserRoles.TUTOR,UserRoles.ADMIN),userController.updateProfile)

export const userRoutes=router;
