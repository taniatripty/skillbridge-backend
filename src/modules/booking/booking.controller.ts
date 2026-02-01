import { Request, Response } from "express";
import { bookingServices } from "./booking.services";

const createBooking = async (req: Request, res: Response) => {
  try {
    // user injected by auth middleware
    const studentId = req?.user?.id;

    const { tutorProfileId, availabilitySlotId, price } = req.body;

    if (!tutorProfileId || !availabilitySlotId || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const booking = await bookingServices.createBooking(studentId as string, {
      tutorProfileId,
      availabilitySlotId,
      price,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingController = {
  createBooking,
};
