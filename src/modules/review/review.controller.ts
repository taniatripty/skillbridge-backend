import { Request, Response } from "express";
import { reviewServices } from "./review.services";


 
 const createReview=async (req: Request, res: Response) => {
    try {
      const studentId = req.user?.id;
      const bookingIdParam = req.params.bookingId;
      const { rating, comment } = req.body;

      if (!studentId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!bookingIdParam || Array.isArray(bookingIdParam)) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking id",
        });
      }

      const bookingId = bookingIdParam; // ✅ string

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      const review = await reviewServices.createReview({
        bookingId,
        studentId,
        rating,
        comment,
      });

      res.status(201).json({
        success: true,
        message: "Review submitted successfully",
        data: review,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
 }

 const getLoggedTutorReviews= async (req: Request, res: Response) => {
    try {
      const tutorProfileId = req.user?.tutorProfileId;

      if (!tutorProfileId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const reviews = await reviewServices.getReviewsForTutor(
        tutorProfileId
      );

      res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  const getAllTutorReviews= async (req: Request, res: Response) => {
    try {
     

      const reviews = await reviewServices.getAllReviewsForTutor();

      res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

export const reviewController={
  createReview,
  getLoggedTutorReviews,
  getAllTutorReviews
}