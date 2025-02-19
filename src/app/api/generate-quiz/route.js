// src/app/api/generate-quiz/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import prisma from '@/lib/db';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const QUIZ_PROMPT = (topic) => `You are a quiz generator API. Generate a multiple-choice quiz about "${topic}".
You must ONLY return a JSON object in exactly this format, with no other text or explanation:
{
  "quiz": [
    {
      "question": "Clear, concise question text here",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "answer": "Must be exactly matching one of the options"
    }
  ]
}

STRICT REQUIREMENTS:
1. Return ONLY the JSON object, no other text
2. Generate exactly 5 questions
3. Each question MUST have exactly 4 options
4. The "answer" MUST exactly match one of the options
5. Question text must be clear and concise
6. All text must be in proper English
7. Do not use markdown code blocks
8. Do not include explanations or comments`;

const sanitizeQuizData = (data) => {
  const jsonMatch = data.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  return data;
};

const validateQuiz = (quiz) => {
  if (!Array.isArray(quiz)) return false;
  
  return quiz.every(question => {
    if (!question.question || !question.options || !question.answer) {
      return false;
    }
    
    if (!Array.isArray(question.options) || question.options.length !== 4) {
      return false;
    }
    
    if (!question.options.includes(question.answer)) {
      return false;
    }
    
    if (typeof question.question !== 'string' || 
        typeof question.answer !== 'string' ||
        !question.options.every(opt => typeof opt === 'string')) {
      return false;
    }
    
    return true;
  });
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { topic, userId, gameType = 'mcq' } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        const response = await axios.post(
          `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: QUIZ_PROMPT(topic) }] }],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const rawText = response.data.candidates[0]?.content?.parts[0]?.text.trim() || "";
        const cleanedText = rawText
          .replace(/```json\n|```\n|```/g, "")
          .replace(/[\u201C\u201D]/g, '"')
          .trim();

        const sanitizedText = sanitizeQuizData(cleanedText);
        
        let quizData;
        try {
          quizData = JSON.parse(sanitizedText);
        } catch (parseError) {
          throw new Error("Invalid JSON format");
        }

        if (!quizData.quiz || !validateQuiz(quizData.quiz)) {
          throw new Error("Invalid quiz structure");
        }
        
        // Update topic count in the database
        await prisma.topic_count.upsert({
          where: { topic },
          update: { count: { increment: 1 } },
          create: { topic, count: 1 },
        });
        
        // Create a game record if userId is provided
        if (userId) {
          const game = await prisma.game.create({
            data: {
              userId,
              timeStarted: new Date(),
              topic,
              gameType: gameType,
            },
          });
          
          // Add the gameId to the response
          quizData.gameId = game.id;
        }

        return NextResponse.json(quizData);

      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error.message);
        
        if (retryCount === maxRetries) {
          throw new Error("Failed to generate valid quiz after multiple attempts");
        }
        
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

  } catch (error) {
    console.error("Final error:", error.message);
    return NextResponse.json({
      error: "Failed to generate quiz. Please try again.",
      details: error.message
    }, { status: 500 });
  }
}