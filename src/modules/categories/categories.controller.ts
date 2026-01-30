import { Request, Response } from "express";
import { categoryservices } from "./categories.services";

 const createCategory= async (req: Request, res: Response) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }

      const category = await categoryservices.createCategory(name);

      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (er: any) {
    
      res.status(400).json({
        success: false,
        message:er.message
      });
    }
}

 const getAllCategories= async (req: Request, res: Response) => {
    try {
      const categories = await categoryservices.getAllCategories();

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "Failed to fetch categories",
      });
    }
  }

export const categoryController={
createCategory,
getAllCategories
}
  