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

export const bookingRoutes = router;
