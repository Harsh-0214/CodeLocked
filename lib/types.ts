export interface Lesson {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  realWorldExample: string;
  keyTakeaways: string[];
  createdAt: string;
  updatedAt: string;
  conversationContext: string;
}

export type NewLesson = Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>;
