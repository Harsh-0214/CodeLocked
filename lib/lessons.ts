import { createClient } from '@supabase/supabase-js';
import { Lesson, NewLesson } from './types';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables');
  return createClient(url, key);
}

// Map DB row (snake_case) to Lesson type (camelCase)
function rowToLesson(row: Record<string, unknown>): Lesson {
  return {
    id: row.id as string,
    title: row.title as string,
    summary: row.summary as string,
    content: row.content as string,
    tags: (row.tags as string[]) ?? [],
    category: row.category as string,
    difficulty: row.difficulty as Lesson['difficulty'],
    realWorldExample: (row.real_world_example as string) ?? '',
    keyTakeaways: (row.key_takeaways as string[]) ?? [],
    conversationContext: (row.conversation_context as string) ?? '',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function createLesson(data: NewLesson): Promise<Lesson> {
  const supabase = getSupabase();
  const { data: row, error } = await supabase
    .from('lessons')
    .insert({
      title: data.title,
      summary: data.summary,
      content: data.content,
      tags: data.tags,
      category: data.category,
      difficulty: data.difficulty,
      real_world_example: data.realWorldExample,
      key_takeaways: data.keyTakeaways,
      conversation_context: data.conversationContext,
    })
    .select()
    .single();

  if (error) throw error;
  return rowToLesson(row);
}

export async function getLessons(): Promise<Lesson[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getLessons error]', error.message, error.code);
    return [];
  }
  return (data ?? []).map(rowToLesson);
}

export async function getLesson(id: string): Promise<Lesson | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return rowToLesson(data);
}

export async function updateLesson(
  id: string,
  updates: Partial<NewLesson>
): Promise<Lesson | null> {
  const supabase = getSupabase();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) patch.title = updates.title;
  if (updates.summary !== undefined) patch.summary = updates.summary;
  if (updates.content !== undefined) patch.content = updates.content;
  if (updates.tags !== undefined) patch.tags = updates.tags;
  if (updates.category !== undefined) patch.category = updates.category;
  if (updates.difficulty !== undefined) patch.difficulty = updates.difficulty;
  if (updates.realWorldExample !== undefined) patch.real_world_example = updates.realWorldExample;
  if (updates.keyTakeaways !== undefined) patch.key_takeaways = updates.keyTakeaways;
  if (updates.conversationContext !== undefined) patch.conversation_context = updates.conversationContext;

  const { data, error } = await supabase
    .from('lessons')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return rowToLesson(data);
}

export async function deleteLesson(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase.from('lessons').delete().eq('id', id);
  return !error;
}
