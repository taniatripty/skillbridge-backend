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

const getMyBookings = async (req: Request, res: Response) => {
  try {
    const studentId = req?.user?.id; // from auth middleware

    const bookings = await bookingServices.getBookingsByStudent(studentId as string);

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// src/modules/booking/booking.controller.ts


const getBookingById = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const studentId = req?.user?.id; 

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking = await bookingServices.getBookingByIdForStudent(
      bookingId as string,
      studentId as string
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


const cancelBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const studentId = req.user?.id; // from auth middleware

    const result = await bookingServices.cancelBooking(
      bookingId as string,
      studentId as string
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: result,
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
  getMyBookings,
  getBookingById,
  cancelBooking
};
