import { Router } from "express";
import authmiddleware, { UserRoles } from "../../middleware/authmiddleware";
import { reviewController } from "./review.controller";


const router = Router();

// POST review (student only)
router.post(
  "/:bookingId",
  authmiddleware(UserRoles.STUDENT),
  reviewController.createReview
);

router.get(
  "/tutor",
  authmiddleware(UserRoles.TUTOR),
  reviewController.getLoggedTutorReviews
);

router.get(
  "/all", reviewController.getAllTutorReviews
);

export const reviewRoutes=router;
