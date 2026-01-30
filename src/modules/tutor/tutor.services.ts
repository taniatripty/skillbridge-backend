import { prisma } from "../../lib/prisma";

interface CreateTutorPayload {
  hourlyRate: number;
  experience?: number;
  education?: string;
  subjects: string[];
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

  
  const tutorData: any = {
    userId,
    hourlyRate: payload.hourlyRate,
    languages: payload.subjects, 
  };

  if (payload.experience !== undefined) {
    tutorData.experience = payload.experience;
  }

  if (payload.education !== undefined) {
    tutorData.education = payload.education;
  }

 
  const tutorProfile = await prisma.tutorProfile.create({
    data: tutorData,
  });

  
  await prisma.user.update({
    where: { id: userId },
    data: { role: "TUTOR" },
  });

  return tutorProfile;
};

export const tutorServices = {
  createTutor,
};
