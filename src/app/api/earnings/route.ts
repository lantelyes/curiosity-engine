import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { topicId, topicName, amount, duration } = body;

    const earning = await prisma.earning.create({
      data: {
        userId: session.user.id,
        topicId,
        topicName,
        amount,
        duration,
      },
    });

    return NextResponse.json(earning);
  } catch {
    // Error saving earning
    return NextResponse.json(
      { error: "Failed to save earning" },
      { status: 500 },
    );
  }
}
