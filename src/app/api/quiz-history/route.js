// src/app/api/quiz-history/route.js
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/nextauth';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const games = await prisma.game.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        questions: true,
      },
      orderBy: {
        timeStarted: 'desc',
      },
      take: 10,
    });
    
    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    return NextResponse.json({ error: "Failed to fetch quiz history" }, { status: 500 });
  }
}