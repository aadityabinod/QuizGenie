// src/app/api/save-quiz/route.js
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/nextauth';
import prisma from '@/lib/db';

export async function POST(request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { gameId, questions, timeEnded } = body;
    
    if (!gameId || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Invalid quiz data" }, { status: 400 });
    }
    
    // Check if the game belongs to the user
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { userId: true },
    });
    
    if (!game || game.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Update the game with timeEnded
    await prisma.game.update({
      where: { id: gameId },
      data: { timeEnded: timeEnded || new Date() },
    });
    
    // Save questions
    for (const q of questions) {
      await prisma.question.create({
        data: {
          gameId,
          question: q.question,
          answer: q.answer,
          options: q.options,
          isCorrect: q.isCorrect,
          userAnswer: q.userAnswer,
          questionType: q.questionType || 'mcq',
        },
      });
    }
    
    return NextResponse.json({ message: "Quiz result saved successfully" });
  } catch (error) {
    console.error("Error saving quiz:", error);
    return NextResponse.json({ error: "Failed to save quiz result" }, { status: 500 });
  }
}