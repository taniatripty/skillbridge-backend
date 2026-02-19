import { Request, Response } from "express";
import { userService } from "./user.services";
import { prisma } from "../../lib/prisma";


 const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

 const banUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { reason, days } = req.body;

    if (!reason || !days) {
      return res.status(400).json({
        success: false,
        message: "Reason and days are required.",
      });
    }

    await userService.banUser(id as string, reason, Number(days));

    return res.status(200).json({
      success: true,
      message: "User banned successfully.",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const unbanUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    await userService.unbanUser(id as string);

    return res.status(200).json({
      success: true,
      message: "User unbanned successfully.",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

 const updateProfile = async (req: Request, res: Response) => {
  try {
   const user=req?.user
    const userId = user?.id as string; 

    const { name, email, phone, image } = req.body;

    const updatedUser = await userService.updateProfile({
      userId,
      name,
      email,
      phone,
      image,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

const getAdminDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const stats = await userService.getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userController={
    getAllUsers,
    updateProfile,
    banUserController,
    unbanUserController,
    getAdminDashboardStats
}
