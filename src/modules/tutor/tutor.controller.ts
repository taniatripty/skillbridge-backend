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

export const tutorController = {
  createTutorProfile,
};
