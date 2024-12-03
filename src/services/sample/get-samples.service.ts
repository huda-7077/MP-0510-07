import { prisma } from "../../lib/prisma";

export const getSamplesServices = async () => {
  try {
    const samples = await prisma.sample.findMany();
    return samples;
  } catch (error) {
    throw error;
  }
};
