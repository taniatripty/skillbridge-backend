
import { AvailabilitySlotCreateManyInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

interface CreateTutorPayload {
  hourlyRate: number;
  experience?: number;
  education?: string;
  subjects: string[];
  name: string;  // user name
  email: string; // user email
  image?: string; // user image
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
    where: { tutorProfileId: tutor.id },
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

export const tutorServices = {
  createTutor,
  updateAvailability,
};