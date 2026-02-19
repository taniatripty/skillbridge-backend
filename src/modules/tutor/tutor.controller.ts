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




// const getAllTutors = async (req: Request, res: Response) => {
//   try {
//     const minPrice = req.query.minPrice
//       ? Number(req.query.minPrice)
//       : undefined;

//     const maxPrice = req.query.maxPrice
//       ? Number(req.query.maxPrice)
//       : undefined;

//     const minRating = req.query.minRating
//       ? Number(req.query.minRating)
//       : undefined;

//     const tutors = await tutorServices.getAllTutors({
//       minPrice,
//       maxPrice,
//       minRating,
//     });

//     res.status(200).json({
//       success: true,
//       data: tutors,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


const getAllTutors = async (req: Request, res: Response) => {
  try {
    const rating =
      typeof req.query.rating === "string"
        ? Number(req.query.rating)
        : undefined;

    const hourlyRate =
      typeof req.query.hourlyRate === "string"
        ? Number(req.query.hourlyRate)
        : undefined;

    // const languages =
    //   typeof req.query.languages === "string"
    //     ? req.query.languages
    //         .split(",")
    //         .map((l) => l.trim().toLowerCase())
    //     : [];

    const toTitleCase = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .split(" ")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

const languages =
  typeof req.query.languages === "string"
    ? req.query.languages
        .split(",")
        .map((l) => toTitleCase(l))
    : [];


    const tutors = await tutorServices.getAllTutors({
      rating,
      hourlyRate,
      languages,
    });

    res.status(200).json({
      success: true,
      data: tutors,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPopularTutors = async (req: Request, res: Response) => {
  try {
    const tutors = await tutorServices.getPopularTutors();

    res.status(200).json({
      success: true,
      data: tutors,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTutorById = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;

    const tutor = await tutorServices.getTutorProfileById(tutorId as string);

    res.status(200).json({
      success: true,
      data: tutor,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Tutor not found",
    });
  }
};
export const tutorController = {
  createTutorProfile,
  updateAvailability,
  getAllTutors,
  getTutorById,
  getPopularTutors
};
