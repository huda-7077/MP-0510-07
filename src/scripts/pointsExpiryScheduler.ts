import { scheduleJob } from "node-schedule";
import prisma from "../lib/prisma";

const expirePoints = async () => {
  const now = new Date();

  const expiredPoints = await prisma.user.findMany({
    where: {
      pointExpiryDate: { lte: now },
    },
  });

  for (const user of expiredPoints) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        totalPoints: 0,
        pointExpiryDate: null,
      },
    });
  }

  //   console.log("Expired points have been removed.");
};

// Atur jadwal untuk menjalankan fungsi expirePoints setiap hari pada pukul 00:00
scheduleJob("0 0 * * *", expirePoints);

// Jalankan fungsi expirePoints setiap 1 menit
// scheduleJob("*/1 * * * *", expirePoints);
