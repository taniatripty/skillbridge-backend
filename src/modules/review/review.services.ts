import { prisma } from "../../lib/prisma";

 const createReview= async ({
    bookingId,
    studentId,
    rating,
    comment,
  }: {
    bookingId: string;
    studentId: string;
    rating: number;
    comment?: string;
  }) => {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new Error("Booking not found");

    if (booking.studentId !== studentId) {
      throw new Error("Unauthorized booking access");
    }

    if (booking.status !== "COMPLETED") {
      throw new Error("You can only review completed bookings");
    }

    const existingReview = await prisma.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      throw new Error("Review already submitted");
    }

    return prisma.review.create({
      data: {
        bookingId,
        studentId,
        tutorProfileId: booking.tutorProfileId,
        rating,
        ...(comment ? { comment } : {}),
      },
    });
  }

const getReviewsForTutor = async (tutorProfileId: string) => {
  return prisma.review.findMany({
    where: {
      tutorProfileId,
    },
    include: {
      booking: {
        select: {
          id: true,
          createdAt: true,
        },
      },
      tutorProfile: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

  export const reviewServices={
    createReview,
    getReviewsForTutor
  }

