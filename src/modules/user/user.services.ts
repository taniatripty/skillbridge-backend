import { prisma } from "../../lib/prisma";
import { UserRoles } from "../../middleware/authmiddleware";


interface UpdateProfilePayload {
  userId: string;
  name?: string;
  email?: string;
  role?:string;
  status?:string;
  phone?: string | null;
  image?: string | null;
}

 const getAllUsers= async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        phone: true,
        status:true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

 const banUser = async (
  userId: string,
  reason: string,
  days: number
) => {
  if (!reason.trim()) {
    throw new Error("Ban reason is required");
  }

  if (!days || days <= 0) {
    throw new Error("Ban days must be greater than 0");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.status === "BANNED") {
    throw new Error("User already banned");
  }

  const banExpiresAt = new Date();
  banExpiresAt.setDate(banExpiresAt.getDate() + days);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        status: "BANNED",
        banReason: reason,
        banExpiresAt,
      },
    });

    await tx.banLog.create({
      data: {
        userId,
        reason,
      },
    });
  });

  return {
    success: true,
    expiresAt: banExpiresAt,
  };
};


  const  unbanUser=async(userId: string) =>{
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.status !== "BANNED") {
      throw new Error("User is not banned");
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        status: "ACTIVE",
        banReason: null,
        banExpiresAt: null,
      },
    });

    return true;
  }

  const getDashboardStats= async () => {
    //  User statistics
    const [
      totalUsers,
      totalStudents,
      totalTutors,
      totalAdmins,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.user.count({ where: { role: UserRoles.STUDENT } }),
      prisma.user.count({ where: { role: UserRoles.TUTOR } }),
      prisma.user.count({ where: { role: UserRoles.ADMIN } }),
    ]);


     const [
      totalBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
    ]);


    return {
      user:{totalUsers,
        totalStudents,
        totalTutors,
        totalAdmins},

         bookings: {
        totalBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
      },
      
  }

}
 

// const updateProfile = async ({
//   userId,
//   name,
//   role,
//   email,
//   phone,
//   image,
// }: UpdateProfilePayload) => {
//   const data: Record<string, any> = {};

//   if (name?.trim()) data.name = name;
//   if (phone?.trim()) data.phone = phone;
//   if (image?.trim()) data.image = image;
//  if (role?.trim()) data.role= role;
//   if (email?.trim()) {
//     const exists = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (exists && exists.id !== userId) {
//       throw new Error("Email already in use");
//     }

//     data.email = email;
//   }

//   return prisma.user.update({
//     where: { id: userId },
//     data,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       role: true,
//       phone: true,
//       image: true,
//       updatedAt: true,
//     },
//   });
// };

const updateProfile = async ({
  userId,
  name,
  role,
  email,
  phone,
  image,
}: UpdateProfilePayload) => {
  const data: Record<string, unknown> = {};

  if (name !== undefined) {
    data.name = name.trim();
  }

 if (image !== undefined && image !== null) {
    data.image = image.trim();
  }

   if (phone !== undefined && phone !== null) {
    data.phone = phone.trim();
  }

  if (role !== undefined) {
    data.role = role;
  }

  if (email !== undefined) {
    const normalizedEmail = email.trim().toLowerCase();

    const exists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (exists && exists.id !== userId) {
      throw new Error("Email already in use");
    }

    data.email = normalizedEmail;
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      image: true,
      updatedAt: true,
    },
  });
};

export const userService = {
    getAllUsers,
    updateProfile,
    banUser,
    unbanUser,
    getDashboardStats
}