import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        topic: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Parse the questions JSON string into an object
    const parsedQuestions = JSON.parse(quiz.questions);

    // Create a response object with parsed questions
    const quizResponse = {
      id: quiz.id,
      title: quiz.title,
      topicTitle: quiz.topic.title,
      questions: parsedQuestions,
    };

    return NextResponse.json(quizResponse);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
