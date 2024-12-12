import { scheduleJob } from "node-schedule";
import prisma from "../lib/prisma";

const expirePoints = async () => {
  const now = new Date();

  const expiredPoints = await prisma.point.findMany({
    where: {
      expiredAt: { lte: now },
    },
  });

  for (const point of expiredPoints) {
    await prisma.point.delete({
      where: {
        id: point.id,
      },
    });
  }

  //   console.log("Expired points have been removed.");
};

// Atur jadwal untuk menjalankan fungsi expirePoints setiap hari pada pukul 00:00
scheduleJob("*/1 * * * *", expirePoints);
