import { Router } from "express";
import { categoryController } from "./categories.controller";
import authmiddleware, { UserRoles } from "../../middleware/authmiddleware";

const router = Router();
router.get('/',categoryController.getAllCategories)
router.post("/",authmiddleware(UserRoles.ADMIN),categoryController.createCategory);


export const categoryRoutes=router