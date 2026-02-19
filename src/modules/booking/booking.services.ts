import { prisma } from "../../lib/prisma";


interface CreateBookingPayload {
  tutorProfileId: string;
  availabilitySlotId: string;
  price: number;
}

const createBooking = async (
  studentId: string,
  payload: CreateBookingPayload
) => {
  // 1️⃣ Check slot exists & belongs to tutor
  const slot = await prisma.availabilitySlot.findUnique({
    where: { id: payload.availabilitySlotId },
  });

  if (!slot) {
    throw new Error("Availability slot not found");
  }

  if (slot.isBooked) {
    throw new Error("Slot already booked");
  }

  if (slot.tutorProfileId !== payload.tutorProfileId) {
    throw new Error("Invalid tutor-slot combination");
  }

  // 2️⃣ Create booking + mark slot booked (transaction)
  const booking = await prisma.$transaction(async (tx) => {
    const createdBooking = await tx.booking.create({
      data: {
        studentId,
        tutorProfileId: payload.tutorProfileId,
        availabilitySlotId: payload.availabilitySlotId,
        price: payload.price,
      },
    });

    await tx.availabilitySlot.update({
      where: { id: payload.availabilitySlotId },
      data: { isBooked: true },
    });

    return createdBooking;
  });

  return booking;
};


const getBookingsByStudent = async (studentId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      studentId,
    },
    include: {
      tutorProfile: {
        select: {
          id: true,
          name: true,
          image: true,
          hourlyRate: true,
          languages: true,
        },
      },
      // include slot info
      availabilitySlot: {
        select: {
          dayOfWeek: true,
          startTime: true,
          endTime: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};


const getBooking = async () => {
  const bookings = await prisma.booking.findMany({
    
    include: {
      tutorProfile: {
        select: {
          id: true,
          name: true,
          email:true,
          image: true,
          hourlyRate: true,
          languages: true,
        },
      },
      // include slot info
      availabilitySlot: {
        select: {
          dayOfWeek: true,
          startTime: true,
          endTime: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};


// const getStudentBookingStats = async (studentId: string) => {
//   const [total, confirmed, completed, cancelled] = await Promise.all([
//     prisma.booking.count({ where: { studentId } }),
//     prisma.booking.count({ where: { studentId, status: "CONFIRMED" } }),
//     prisma.booking.count({ where: { studentId, status: "COMPLETED" } }),
//     prisma.booking.count({ where: { studentId, status: "CANCELLED" } }),
//   ]);

//   return {
//     total,
//     confirmed,
//     completed,
//     cancelled,
//   };
// };

 const getStudentBookingStats = async (studentId: string) => {
  // First, check if the user is banned
  const user = await prisma.user.findUnique({
    where: { id: studentId },
    select: { status: true, banReason: true },
  });

  if (!user) {
    return {
      data: null,
      error: "User not found",
      banned: false,
      banReason: null,
    };
  }

  if (user.status === "BANNED") {
    return {
      data: null,
      error: null,
      banned: true,
      banReason: user.banReason || "Your account has been suspended.",
    };
  }

  // User is active, fetch booking stats
  const [total, confirmed, completed, cancelled] = await Promise.all([
    prisma.booking.count({ where: { studentId } }),
    prisma.booking.count({ where: { studentId, status: "CONFIRMED" } }),
    prisma.booking.count({ where: { studentId, status: "COMPLETED" } }),
    prisma.booking.count({ where: { studentId, status: "CANCELLED" } }),
  ]);

  return {
    data: { total, confirmed, completed, cancelled },
    error: null,
    banned: false,
    banReason: null,
  };
};

 const getBookingByIdForStudent = async (
  bookingId: string,
  studentId: string
) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      studentId,
    },
    include: {
      tutorProfile: {
        select: {
          id: true,
          name: true,
          image: true,
          hourlyRate: true,
          languages: true,
        },
      },
      availabilitySlot: {
        select: {
          dayOfWeek: true,
          startTime: true,
          endTime: true,
        },
      },
    },
  });

  return booking;
};




const getBookingsByTutor = async (tutorProfileId: string) => {
  return await prisma.booking.findMany({
    where: {
      tutorProfileId,
    },
    include: {
      
      availabilitySlot: {
        select: {
          dayOfWeek: true,
          startTime: true,
          endTime: true,
        },
      },
      tutorProfile:{
        select:{
          name:true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// const getTutorBookingStatistics = async (tutorProfileId: string) => {
//   const grouped = await prisma.booking.groupBy({
//     by: ["status"],
//     where: {
//       tutorProfileId,
//     },
//     _count: {
//       status:true
//     },
//   });

//   const stats = {
//     total: 0,
//     pending: 0,
//     confirmed: 0,
//     completed: 0,
//     cancelled: 0,
//   };

//   grouped.forEach((item) => {
//     stats.total += item._count.status;

//     switch (item.status) {
    
//       case "CONFIRMED":
//         stats.confirmed = item._count.status;
//         break;
//       case "COMPLETED":
//         stats.completed = item._count.status;
//         break;
//       case "CANCELLED":
//         stats.cancelled = item._count.status;
//         break;
//     }
//   });

  

//   return stats;
// };




// const getTutorStatistics = async (tutorProfileId: string) => {
//   /** -------------------------
//    * Booking statistics
//    --------------------------*/
//   const bookingGrouped = await prisma.booking.groupBy({
//     by: ["status"],
//     where: {
//       tutorProfileId,
//     },
//     _count: {
//       status: true,
//     },
//   });

//   const bookingStats = {
//     totalBookings: 0,
//     pending: 0,
//     confirmed: 0,
//     completed: 0,
//     cancelled: 0,
//   };

//   bookingGrouped.forEach((item) => {
//     bookingStats.totalBookings += item._count.status;

//     switch (item.status) {
     
//       case "CONFIRMED":
//         bookingStats.confirmed = item._count.status;
//         break;
//       case "COMPLETED":
//         bookingStats.completed = item._count.status;
//         break;
//       case "CANCELLED":
//         bookingStats.cancelled = item._count.status;
//         break;
//     }
//   });

//   /** -------------------------
//    * Review statistics
//    --------------------------*/
//   const reviewStats = await prisma.review.aggregate({
//     where: {
//       tutorProfileId,
//     },
//     _count: {
//       id: true,
//     },
//     _avg: {
//       rating: true,
//     },
//   });

//   return {
//     bookings: bookingStats,
//     reviews: {
//       totalReviews: reviewStats._count.id,
//       averageRating: reviewStats._avg.rating
//         ? Number(reviewStats._avg.rating.toFixed(1))
//         : 0,
//     },
//   };
// };

 const getTutorStatistics = async (tutorProfileId: string, userId: string) => {
  // -------------------------
  // 1️⃣ Check if user is banned
  // -------------------------
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true, banReason: true, banExpiresAt: true },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  if (dbUser.status === "BANNED") {
    // Auto-unban if expired
    if (dbUser.banExpiresAt && new Date() > dbUser.banExpiresAt) {
      await prisma.user.update({
        where: { id: userId },
        data: { status: "ACTIVE", banReason: null, banExpiresAt: null },
      });
    } else {
      throw new Error(
        dbUser.banReason || "Your account is banned. Contact support."
      );
    }
  }

  // -------------------------
  // 2️⃣ Booking statistics
  // -------------------------
  const bookingGrouped = await prisma.booking.groupBy({
    by: ["status"],
    where: {
      tutorProfileId,
    },
    _count: {
      status: true,
    },
  });

  const bookingStats = {
    totalBookings: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  };

  bookingGrouped.forEach((item) => {
    bookingStats.totalBookings += item._count.status;

    switch (item.status) {
     
      case "CONFIRMED":
        bookingStats.confirmed = item._count.status;
        break;
      case "COMPLETED":
        bookingStats.completed = item._count.status;
        break;
      case "CANCELLED":
        bookingStats.cancelled = item._count.status;
        break;
    }
  });

  // -------------------------
  // 3️⃣ Review statistics
  // -------------------------
  const reviewStats = await prisma.review.aggregate({
    where: { tutorProfileId },
    _count: { id: true },
    _avg: { rating: true },
  });

  return {
    bookings: bookingStats,
    reviews: {
      totalReviews: reviewStats._count.id,
      averageRating: reviewStats._avg.rating
        ? Number(reviewStats._avg.rating.toFixed(1))
        : 0,
    },
  };
};



  const updateBookingStatus= async (bookingId: string, tutorProfileId: string, status: "CANCELLED" | "COMPLETED") => {
    // Check if the booking exists and belongs to this tutor
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.tutorProfileId !== tutorProfileId) {
      throw new Error("You can only update your own bookings");
    }

    // Update status
    return await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
  }

const cancelBooking = async (bookingId: string, studentId: string) => {
  // 1️⃣ Find booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // 2️⃣ Ownership check
  if (booking.studentId !== studentId) {
    throw new Error("You are not allowed to cancel this booking");
  }

  // 3️⃣ Free availability slot
  await prisma.availabilitySlot.update({
    where: { id: booking.availabilitySlotId },
    data: { isBooked: false },
  });

  // 4️⃣ Delete booking
  await prisma.booking.delete({
    where: { id: bookingId },
  });

  return { id: bookingId };
};

// const getStudentBookingStats = async (studentId: string) => {
//   const [total, confirmed, completed, cancelled] = await Promise.all([
//     prisma.booking.count({ where: { studentId } }),
//     prisma.booking.count({ where: { studentId, status: "CONFIRMED" } }),
//     prisma.booking.count({ where: { studentId, status: "COMPLETED" } }),
//     prisma.booking.count({ where: { studentId, status: "CANCELLED" } }),
//   ]);

//   return {
//     total,
//     confirmed,
//     completed,
//     cancelled,
//   };
// };



export const bookingServices = {
  createBooking,
  getBooking,
  getBookingsByStudent,
  getStudentBookingStats,
  getBookingByIdForStudent,
  getBookingsByTutor,
  getTutorStatistics,
  cancelBooking,
  updateBookingStatus,

};
