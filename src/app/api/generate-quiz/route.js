import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateQuiz } from '@/lib/gemini';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { topicId } = await request.json();
    
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { course: true }
    });

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    const quizQuestions = await generateQuiz(topic.course.title, topic.title, topic.content);

    const quiz = await prisma.quiz.create({
      data: {
        title: `Quiz for ${topic.title}`,
        questions: JSON.stringify(quizQuestions),
        topicId: topic.id
      }
    });

    // Parse the questions before sending in the response
    const parsedQuiz = {
      ...quiz,
      questions: JSON.parse(quiz.questions)
    };

    return NextResponse.json(parsedQuiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
