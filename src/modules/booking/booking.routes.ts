import express from "express";
import { bookingController } from "./booking.controller";
import authmiddleware, { UserRoles } from "../../middleware/authmiddleware";


const router = express.Router();

router.post(
  "/",
  authmiddleware(UserRoles.STUDENT), // only logged-in students
  bookingController.createBooking
);

router.get(
  "/",
 authmiddleware(UserRoles.STUDENT),
  bookingController.getMyBookings
);

router.get("/tutorbooking", authmiddleware(UserRoles.TUTOR),bookingController.getTutorBookings);
router.patch("/:id/status", authmiddleware(UserRoles.TUTOR),bookingController.updateBookingStatus);
router.get("/:id", authmiddleware(UserRoles.STUDENT,UserRoles.TUTOR),bookingController.getBookingById);

router.delete(
  "/:id",
authmiddleware(UserRoles.STUDENT,UserRoles.TUTOR),
  bookingController.cancelBooking
);

export const bookingRoutes = router;
