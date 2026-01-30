import express from "express";
import authMiddleware, { UserRoles } from "../../middleware/authmiddleware";
import { tutorController } from "./tutor.controller";

const router = express.Router();


router.post(
 '/',authMiddleware(UserRoles.STUDENT),
  tutorController.createTutorProfile
);

export const tutotRoutes=router;
