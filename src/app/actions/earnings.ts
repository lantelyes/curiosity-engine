"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Type for Prisma groupBy result
type GroupedEarning = {
  createdAt: Date;
  _sum: {
    amount: number | null;
  };
};

export async function saveEarning(
  topicId: string,
  topicName: string,
  amount: number,
  duration: number,
): Promise<{ id: string; userId: string; amount: number; topicId: string; topicName: string; duration: number; createdAt: Date }> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const earning = await prisma.earning.create({
      data: {
        userId: session.user.id,
        topicId,
        topicName,
        amount,
        duration,
      },
    });

    // Removed revalidatePath as components handle their own state
    return earning;
  } catch {
    // Error saving earning
    throw new Error("Failed to save earning");
  }
}

export async function getEarningsStats(): Promise<{
  total: number;
  daily: number;
  completedToday: number;
  weekData: { day: string; amount: number }[];
}> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const userId = session.user.id;
    // Get total earnings
    const totalEarnings = await prisma.earning.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId,
      },
    });

    // Get today's earnings
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEarnings = await prisma.earning.aggregate({
      _sum: {
        amount: true,
      },
      _count: true,
      where: {
        userId,
        createdAt: {
          gte: today,
        },
      },
    });

    // Get this week's earnings
    const startOfWeek = new Date();
    const dayOfWeek = startOfWeek.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday as start
    startOfWeek.setDate(startOfWeek.getDate() - daysToSubtract);
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyEarnings = await prisma.earning.groupBy({
      by: ["createdAt"],
      _sum: {
        amount: true,
      },
      where: {
        userId,
        createdAt: {
          gte: startOfWeek,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Format weekly data by day
    const weekData: { day: string; amount: number }[] = [];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const dayEarnings = weeklyEarnings
        .filter((e: GroupedEarning) => {
          const earningDate = new Date(e.createdAt);
          return earningDate.toDateString() === date.toDateString();
        })
        .reduce((sum: number, e: GroupedEarning) => sum + (e._sum.amount || 0), 0);

      weekData.push({
        day: days[i],
        amount: dayEarnings,
      });
    }

    return {
      total: totalEarnings._sum.amount || 0,
      daily: todayEarnings._sum.amount || 0,
      completedToday: todayEarnings._count,
      weekData,
    };
  } catch {
    // Error fetching earnings stats
    throw new Error("Failed to fetch earnings stats");
  }
}
