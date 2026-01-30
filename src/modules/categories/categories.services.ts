import { prisma } from "../../lib/prisma";

const createCategory=async(name:string)=>{
   
    const exists = await prisma.category.findUnique({
      where: { name },
    });

    if (exists) {
      throw new Error("Category already exists");
    }

    return prisma.category.create({
      data: { name },
    });

}

 const getAllCategories= async () => {
    return prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

export const categoryservices={
    createCategory,
    getAllCategories
}