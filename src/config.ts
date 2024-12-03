import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
export const PORT = process.env.PORT;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const prisma = new PrismaClient({
  //   log: ["error", "info", "query", "warn"],
});
