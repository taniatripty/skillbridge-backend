import { Request, Response } from "express";
import { bookingServices } from "./booking.services";
import { prisma } from "../../lib/prisma";

const createBooking = async (req: Request, res: Response) => {
  try {
    
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

const getBookings = async (req: Request, res: Response) => {
  try {
   ;// from auth middleware

    const bookings = await bookingServices.getBooking()

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


//  const getMyBookingStats = async (req: Request, res: Response) => {
//   try {
//     const studentId = req.user?.id;

//     const stats = await bookingServices.getStudentBookingStats(
//       studentId as string
//     );

//     res.status(200).json({
//       success: true,
//       data: stats,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

 const getMyBookingStats = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }

    const stats = await bookingServices.getStudentBookingStats(studentId);

    // If the user is banned, respond immediately
    if (stats.banned) {
      return res.status(403).json({
        success: false,
        message: stats.banReason || "Your account has been suspended.",
      });
    }

    // User is active, return booking stats
    res.status(200).json({
      success: true,
      data: stats.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTutorBookings = async (req: Request, res: Response) => {
  try {
    const tutorProfileId = req.user?.tutorProfileId;

    if (!tutorProfileId) {
      return res.status(403).json({
        success: false,
        message: "Tutor profile not found",
      });
    }

    const bookings = await bookingServices.getBookingsByTutor(
      tutorProfileId
    );

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


// const getTutorBookingStats = async (req: Request, res: Response) => {
//   try {
//     // assuming auth middleware adds user info
//     const tutorProfileId = req.user?.tutorProfileId;

//     if (!tutorProfileId) {
//       return res.status(400).json({
//         success: false,
//         message: "Tutor profile not found",
//       });
//     }

//     const stats = await bookingServices.getTutorBookingStatistics(
//       tutorProfileId
//     );

//     res.status(200).json({
//       success: true,
//       data: stats,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// const getTutorStatistics = async (req: Request, res: Response) => {
//   try {
//     const tutorProfileId = req.user?.tutorProfileId;

//     if (!tutorProfileId) {
//       return res.status(400).json({
//         success: false,
//         message: "Tutor profile not found",
//       });
//     }

//     const stats = await bookingServices.getTutorStatistics(
//       tutorProfileId
//     );

//     res.status(200).json({
//       success: true,
//       data: stats,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const getTutorStatistics = async (req: Request, res: Response) => {
  try {
    const tutorProfileId = req.user?.tutorProfileId;
    const userId = req.user?.id;

    if (!tutorProfileId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Tutor profile or user not found",
      });
    }

    // -------------------------
    // 1️⃣ Check if user is banned
    // -------------------------
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { status: true, banReason: true, banExpiresAt: true },
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (dbUser.status === "BANNED") {
      // Auto-unban if ban expired
      if (dbUser.banExpiresAt && new Date() > dbUser.banExpiresAt) {
        await prisma.user.update({
          where: { id: userId },
          data: { status: "ACTIVE", banReason: null, banExpiresAt: null },
        });
      } else {
        return res.status(403).json({
          success: false,
          message:
            dbUser.banReason || "Your account has been banned. Contact support.",
        });
      }
    }

    // -------------------------
    // 2️⃣ Get tutor statistics
    // -------------------------
    const stats = await bookingServices.getTutorStatistics(
      tutorProfileId,
      userId
    );

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

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

 const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;
    const tutorProfileId = req.user?.tutorProfileId;

    if (!["CANCELLED", "COMPLETED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updatedBooking = await bookingServices.updateBookingStatus(
      bookingId as string,
      tutorProfileId as string,
      status
    );

    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const bookingController = {
  createBooking,
  getBookings,
  getMyBookings,
  getMyBookingStats,
  getBookingById,
  cancelBooking,
 getTutorBookings,
 getTutorStatistics,
 updateBookingStatus,

};
