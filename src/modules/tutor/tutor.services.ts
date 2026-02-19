
import { AvailabilitySlotCreateManyInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

interface CreateTutorPayload {
  hourlyRate: number 
  experience?: number;
  education?: string;
  subjects: string[];
  name: string;  
  email: string; 
  image?: string; 
}

interface TutorFilter {
  minRating?: number | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
}
const createTutor = async (
  userId: string,
  payload: CreateTutorPayload
) => {
  // 1️⃣ Check if tutor already exists
  const existingTutor = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (existingTutor) {
    throw new Error("Tutor profile already exists");
  }

  // 2️⃣ Build data object
  const tutorData: any = {
    userId,
    hourlyRate: payload.hourlyRate,
    languages: payload.subjects, 
    name: payload.name,
    email: payload.email,
    image: payload.image || null,
  };

  if (payload.experience !== undefined) {
    tutorData.experience = payload.experience;
  }

  if (payload.education !== undefined) {
    tutorData.education = payload.education;
  }

  // 3️⃣ Create TutorProfile
  const tutorProfile = await prisma.tutorProfile.create({
    data: tutorData,
  });

  // 4️⃣ Update user role to TUTOR
  await prisma.user.update({
    where: { id: userId },
    data: { role: "TUTOR" },
  });

  return tutorProfile;
};


const updateAvailability = async (
  userId: string,
  slots:AvailabilitySlotCreateManyInput[]
) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutor) {
    throw new Error("Tutor profile not found");
  }

  // 🧹 Remove old slots
  await prisma.availabilitySlot.deleteMany({
    where: { 
      tutorProfileId: tutor.id,
        isBooked: false,

     },
  });

  // ✅ Create new slots
  await prisma.availabilitySlot.createMany({
    data: slots.map((slot) => ({
      tutorProfileId: tutor.id,
      dayOfWeek: slot.dayOfWeek, // ✅ Prisma enum
      startTime: slot.startTime,
      endTime: slot.endTime,
    })),
  });

  return {
    success: true,
    message: "Availability updated successfully",
  };
};







const getAllTutors = async ({
  rating,
  hourlyRate,
  languages,
}: {
  rating?: number | undefined;
  hourlyRate?: number | undefined;
  languages: string[] | [];
}) => {
  const andConditions: any[] = [];

  // 💰 Hourly rate
  if (hourlyRate !== undefined) {
    andConditions.push({ hourlyRate });
  }

  // 🧠 Case-insensitive language filter
  // if (languages.length > 0) {
  //   const normalizedLanguages = languages.map((l) =>
  //     l.trim().toLowerCase()
  //   );

  //   andConditions.push({
  //     languages: {
  //       hasSome: normalizedLanguages,
  //     },
  //   });
  // }
  if (languages.length > 0) {
  andConditions.push({
    languages: {
      hasSome: languages,
    },
  });
}


  // ⭐ Average rating filter
  if (rating !== undefined) {
    const grouped = await prisma.review.groupBy({
      by: ["tutorProfileId"],
      _avg: { rating: true },
      having: {
        rating: {
          _avg: {
            gte: rating,
          },
        },
      },
    });

    const tutorIds = grouped.map((g) => g.tutorProfileId);

    if (tutorIds.length === 0) {
      return [];
    }

    andConditions.push({
      id: { in: tutorIds },
    });
  }

  const tutors = await prisma.tutorProfile.findMany({
    where: {
      AND: andConditions,
    },
    include: {
      availability: true,
      reviews: {
        select: { rating: true },
      },
    },
  });

  return tutors.map((tutor) => ({
    ...tutor,
    averageRating:
      tutor.reviews.length === 0
        ? 0
        : tutor.reviews.reduce((a, b) => a + b.rating, 0) /
          tutor.reviews.length,
  }));
};


const getPopularTutors = async () => {
  const tutors = await prisma.tutorProfile.findMany({
    include: {
      reviews: {
        select: { rating: true },
      },
      availability: true,
    },
  });

  // Compute average rating
  const popularTutors = tutors
    .map((tutor) => ({
      ...tutor,
      averageRating:
        tutor.reviews.length === 0
          ? 0
          : tutor.reviews.reduce((sum, r) => sum + r.rating, 0) /
            tutor.reviews.length,
    }))
    .filter((tutor) => tutor.averageRating >= 4) // filter popular tutors
    .sort((a, b) => b.averageRating - a.averageRating); // sort descending

  return popularTutors;
};



const getTutorProfileById = async (tutorProfileId: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id: tutorProfileId,
    },
    include: {
      availability: {
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          isBooked: true,
        },
        orderBy: {
          dayOfWeek: "asc",
        },
      },
      reviews:{
         select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          studentId: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }
    },
  });

  if (!tutor) {
    throw new Error("Tutor profile not found");
  }

  return tutor;
};



export const tutorServices = {
  createTutor,
  updateAvailability,
  getAllTutors,
  getTutorProfileById,
  getPopularTutors
};