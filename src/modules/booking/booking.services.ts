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

export const bookingServices = {
  createBooking,
};
