import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const topUsers = await prisma.user.findMany({
            take: 50,
            orderBy: {
                exp: 'desc',
            },
            select: {
                id: true,
                username: true,
                exp: true,
            },
        });

        return NextResponse.json(topUsers);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}