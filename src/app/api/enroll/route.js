import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { courseId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Проверка существования пользователя и курса
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const course = await prisma.course.findUnique({ where: { id: courseId } });

    if (!user || !course) {
      return NextResponse.json({ error: 'User or course not found' }, { status: 404 });
    }

    // Проверка на дублирование записи
    const existingEnrollment = await prisma.course.findFirst({
      where: {
        id: courseId,
        participants: {
          some: {
            id: userId
          }
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
    }

    // Добавление пользователя к курсу и увеличение studentCount
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        participants: {
          connect: { id: userId }
        },
        studentCount: {
          increment: 1
        }
      },
      include: {
        participants: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      }
    });

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json({ error: 'Failed to enroll in course' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
