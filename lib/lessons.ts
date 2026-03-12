import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';
import { Lesson, NewLesson } from './types';

export async function createLesson(data: NewLesson): Promise<Lesson> {
  const id = uuidv4();
  const now = new Date().toISOString();
  const lesson: Lesson = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
  await kv.set(`lesson:${id}`, lesson);
  await kv.zadd('lessons:index', { score: Date.now(), member: id });
  return lesson;
}

export async function getLessons(): Promise<Lesson[]> {
  const ids = await kv.zrange('lessons:index', 0, -1, { rev: true });
  if (!ids || ids.length === 0) return [];
  const lessons = await Promise.all(
    ids.map((id) => kv.get<Lesson>(`lesson:${id}`))
  );
  return lessons.filter((l): l is Lesson => l !== null);
}

export async function getLesson(id: string): Promise<Lesson | null> {
  return kv.get<Lesson>(`lesson:${id}`);
}

export async function updateLesson(
  id: string,
  updates: Partial<NewLesson>
): Promise<Lesson | null> {
  const existing = await getLesson(id);
  if (!existing) return null;
  const updated: Lesson = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await kv.set(`lesson:${id}`, updated);
  return updated;
}

export async function deleteLesson(id: string): Promise<boolean> {
  const existing = await getLesson(id);
  if (!existing) return false;
  await kv.del(`lesson:${id}`);
  await kv.zrem('lessons:index', id);
  return true;
}
