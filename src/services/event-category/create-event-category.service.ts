import prisma from "../../lib/prisma";

interface CreateEventCategoryBody {
  title: string;
  description: string;
}

export const createEventCategoryService = async (
  body: CreateEventCategoryBody
) => {
  try {
    const { title, description } = body;

    const existingCategory = await prisma.eventCategories.findFirst({
      where: { title },
    });

    if (existingCategory) {
      throw new Error("Category with the same title already exists.");
    }

    const category = await prisma.eventCategories.create({
      data: {
        title,
        description,
      },
    });

    return category;
  } catch (error) {
    throw error;
  }
};
