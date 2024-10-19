import { NextResponse } from 'next/server';
import { generateCourseContent } from '@/lib/gemini';

export async function POST(request) {
    try {
        const { topic, level } = await request.json();

        const coursePlan = await generateCourseContent(topic, level);

        return NextResponse.json(coursePlan);
    } catch (error) {
        console.error('Error generating course plan:', error);
        return NextResponse.json({ error: 'Failed to generate course plan' }, { status: 500 });
    }
}