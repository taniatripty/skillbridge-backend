import express from "express";
import authMiddleware, { UserRoles } from "../../middleware/authmiddleware";
import { tutorController } from "./tutor.controller";


const router = express.Router();


router.post(
 '/',authMiddleware(UserRoles.STUDENT),
  tutorController.createTutorProfile
);
router.put(
  "/availability",
 authMiddleware(UserRoles.TUTOR),
tutorController.updateAvailability
);
router.get("/popular", tutorController.getPopularTutors);
router.get("/:tutorId", tutorController.getTutorById);
router.get("/", tutorController.getAllTutors);

export const tutotRoutes=router;
