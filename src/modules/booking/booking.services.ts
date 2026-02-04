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

export const bookingServices = {
  createBooking,
  getBookingsByStudent,
  getBookingByIdForStudent,
  getBookingsByTutor,
  cancelBooking,
  updateBookingStatus
};
