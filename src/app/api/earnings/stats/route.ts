import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    // Get total earnings
    const totalEarnings = await prisma.earning.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: session.user.id,
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
        userId: session.user.id,
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
        userId: session.user.id,
        createdAt: {
          gte: startOfWeek,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Format weekly data by day
    const weekData = [];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const dayEarnings = weeklyEarnings
        .filter((e) => {
          const earningDate = new Date(e.createdAt);
          return earningDate.toDateString() === date.toDateString();
        })
        .reduce((sum, e) => sum + (e._sum.amount || 0), 0);

      weekData.push({
        day: days[i],
        amount: dayEarnings,
      });
    }

    return NextResponse.json({
      total: totalEarnings._sum.amount || 0,
      daily: todayEarnings._sum.amount || 0,
      completedToday: todayEarnings._count,
      weekData,
    });
  } catch {
    // Error fetching earnings stats
    return NextResponse.json(
      { error: "Failed to fetch earnings stats" },
      { status: 500 },
    );
  }
}
