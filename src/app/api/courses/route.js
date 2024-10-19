import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/middleware/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const recentCourses = await prisma.course.findMany({
      take: 18, // Limit to 6 courses, adjust as needed
      orderBy: {
        createdAt: 'desc' // Order by creation date, most recent first
      },
      include: {
        author: {
          select: {
            username: true
          }
        },
        _count: {
          select: { participants: true }
        }
      }
    });

    return NextResponse.json(recentCourses);
  } catch (error) {
    console.error('Error fetching recent courses:', error);
    return NextResponse.json({ error: 'Failed to fetch recent courses' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const courseData = await request.json();
    console.log('Received course data:', courseData);

    // Проверяем наличие обязательных полей
    const requiredFields = ['title', 'level', 'description', 'category', 'duration', 'author', 'topics'];
    for (const field of requiredFields) {
      if (!courseData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Удаляем лишние поля, которые не должны быть переданы в Prisma
    const { updatedAt, createdAt, ...cleanedCourseData } = courseData;

    console.log('Cleaned course data:', cleanedCourseData);

    const course = await prisma.course.create({
      data: cleanedCourseData,
      include: {
        topics: true,
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    console.log('Created course:', course);

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course: ' + error.message }, { status: 500 });
  }
}
