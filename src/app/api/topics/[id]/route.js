import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { content, status } = await request.json();
    const updatedTopic = await prisma.topic.update({
      where: { id: params.id },
      data: { content, status },
    });
    return NextResponse.json(updatedTopic);
  } catch (error) {
    console.error('Error updating topic:', error);
    return NextResponse.json({ error: 'Failed to update topic' }, { status: 500 });
  }
}
