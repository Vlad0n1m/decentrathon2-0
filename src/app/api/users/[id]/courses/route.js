import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        enrolledCourses: true,
        authoredCourses: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      enrolledCourses: user.enrolledCourses,
      createdCourses: user.authoredCourses,
    });
  } catch (error) {
    console.error('Error fetching user courses:', error);
    return NextResponse.json({ error: 'Failed to fetch user courses' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
