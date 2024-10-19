import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateTopicContent } from '@/lib/gemini';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { courseId, topicId } = await request.json();

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { topics: true },
    });

    const topic = course.topics.find(t => t.id === topicId);
    const content = await generateTopicContent(course.title, topic.title);

    await prisma.topic.update({
      where: { id: topicId },
      data: { content, status: 'COMPLETED' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing background task:', error);
    return NextResponse.json({ error: 'Failed to process background task' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
