import { NextRequest, NextResponse } from 'next/server';
import { createLesson, getLessons } from '@/lib/lessons';

export async function GET() {
  try {
    const lessons = await getLessons();
    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('Failed to get lessons:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-api-secret');
  if (!secret || secret !== process.env.LESSON_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, summary, ...rest } = body;

    if (!title || !content || !summary) {
      return NextResponse.json(
        { error: 'title, content, and summary are required' },
        { status: 400 }
      );
    }

    const lesson = await createLesson({
      title,
      content,
      summary,
      tags: rest.tags || [],
      category: rest.category || 'General',
      difficulty: rest.difficulty || 'beginner',
      realWorldExample: rest.realWorldExample || '',
      keyTakeaways: rest.keyTakeaways || [],
      conversationContext: rest.conversationContext || '',
    });

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    console.error('Failed to create lesson:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
