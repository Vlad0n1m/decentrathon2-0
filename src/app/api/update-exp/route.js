import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  console.log('Update EXP API route called');
  try {
    const { userId, exp } = await request.json();
    console.log('Received data:', { userId, exp });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        exp: {
          increment: exp
        }
      }
    });

    console.log('Updated user:', updatedUser);
    return NextResponse.json({ success: true, newExp: updatedUser.exp });
  } catch (error) {
    console.error('Error updating EXP:', error);
    return NextResponse.json({ error: 'Failed to update EXP' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
