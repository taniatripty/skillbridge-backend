import { prisma } from "../../lib/prisma";



// const createCategory = async (name: string) => {
//   const normalizedName = name.trim().toUpperCase();

//   const exists = await prisma.category.findUnique({
//     where: { name: normalizedName },
//   });

//   if (exists) {
//     throw new Error("Category already exists");
//   }

//   return prisma.category.create({
//     data: {
//       name: normalizedName,
//     },
//   });
// };


const createCategory = async (name: string) => {
  const normalizedName = name
    .trim()
    .toLowerCase()
    .split(" ")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

  const exists = await prisma.category.findUnique({
    where: { name: normalizedName },
  });

  if (exists) {
    throw new Error("Category already exists");
  }

  return prisma.category.create({
    data: {
      name: normalizedName,
    },
  });
};


 const getAllCategories= async () => {
    return prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

export const categoryservices={
    createCategory,
    getAllCategories
}