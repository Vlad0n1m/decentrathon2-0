import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    console.log('API route hit, course id:', params.id);
    try {
        const course = await prisma.course.findUnique({
            where: { id: params.id },
            include: {
                topics: {
                    include: {
                        quiz: {
                            select: {
                                id: true // We only need to know if the quiz exists
                            }
                        }
                    }
                },
                author: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                participants: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        if (!course) {
            console.log('Course not found');
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        console.log('Course found:', course);
        return NextResponse.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
