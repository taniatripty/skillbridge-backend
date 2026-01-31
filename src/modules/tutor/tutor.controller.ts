import { Request, Response } from "express";
import { tutorServices } from "./tutor.services";


const createTutorProfile = async (req: Request, res: Response) => {
  try {
    const user = req?.user; // injected by auth middleware

    const result = await tutorServices.createTutor(
      user?.id as string,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Tutor profile created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create tutor profile",
    });
  }
};


const updateAvailability = async (req: Request, res: Response) => {
  try {
    const user=req?.user
    const userId = user?.id as string // from auth middleware
    const { availability } = req.body;

    if (!Array.isArray(availability)) {
      return res.status(400).json({
        success: false,
        message: "Availability must be an array",
      });
    }

    const result = await tutorServices.updateAvailability(
      userId,
      availability
    );

    res.status(200).json({
      success: true,
      data: result,
      message: "Availability updated successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const tutorController = {
  createTutorProfile,
  updateAvailability
};
