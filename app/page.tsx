import Link from 'next/link';
import { getLessons } from '@/lib/lessons';
import { Lesson } from '@/lib/types';

export const dynamic = 'force-dynamic';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const difficultyStyle: Record<string, React.CSSProperties> = {
  beginner: { color: '#16a34a', background: '#f0fdf4', borderColor: '#bbf7d0' },
  intermediate: { color: '#d97706', background: '#fffbeb', borderColor: '#fde68a' },
  advanced: { color: '#dc2626', background: '#fef2f2', borderColor: '#fecaca' },
};

export default async function HomePage() {
  let lessons: Lesson[] = [];
  try {
    lessons = await getLessons();
  } catch {
    lessons = [];
  }

  const grouped = lessons.reduce<Record<string, Lesson[]>>((acc, lesson) => {
    const cat = lesson.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(lesson);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Sticky header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(247, 246, 243, 0.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--text-primary)' }}>harsh</span>
          <span style={{ margin: '0 0.35rem' }}>/</span>
          <span>dev lessons</span>
        </span>
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            background: 'var(--tag-bg)',
            border: '1px solid var(--border)',
            padding: '0.15rem 0.6rem',
            borderRadius: '999px',
          }}
        >
          {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
        </span>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Hero */}
        <div style={{ marginBottom: '4rem' }}>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontWeight: 300,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              letterSpacing: '-0.01em',
            }}
          >
            My Software Engineering
            <br />
            <em>Knowledge Base</em>
          </h1>
          <p
            style={{
              fontFamily: 'var(--sans)',
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              maxWidth: '560px',
            }}
          >
            A living collection of lessons learned through building, debugging, and exploring
            software. Each entry captures a concept worth remembering.
          </p>
        </div>

        {/* Empty state */}
        {lessons.length === 0 && (
          <div
            style={{
              border: '1px dashed var(--border-strong)',
              borderRadius: '8px',
              padding: '3rem 2rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <p style={{ fontFamily: 'var(--sans)', marginBottom: '1.25rem', fontSize: '1rem' }}>
              No lessons yet. Add your first by saying:
            </p>
            <code
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.875rem',
                background: 'var(--code-bg)',
                color: '#e8e6e3',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              log this to my lesson site
            </code>
          </div>
        )}

        {/* Lessons by category */}
        {categories.map((category) => (
          <section key={category} style={{ marginBottom: '3.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--text-muted)',
                  margin: 0,
                }}
              >
                {category}
              </h2>
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  background: 'var(--tag-bg)',
                  border: '1px solid var(--border)',
                  padding: '0.1rem 0.5rem',
                  borderRadius: '999px',
                }}
              >
                {grouped[category].length}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem',
              }}
            >
              {grouped[category].map((lesson) => {
                const diff = difficultyStyle[lesson.difficulty] || difficultyStyle.beginner;
                return (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.id}`}
                    className="lesson-card-link"
                  >
                    <article className="lesson-card">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--mono)',
                            fontSize: '0.68rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {lesson.category}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--mono)',
                            fontSize: '0.68rem',
                            padding: '0.1rem 0.5rem',
                            borderRadius: '999px',
                            border: '1px solid',
                            ...diff,
                          }}
                        >
                          {lesson.difficulty}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontFamily: 'var(--serif)',
                          fontWeight: 400,
                          fontSize: '1.1rem',
                          lineHeight: 1.35,
                          color: 'var(--text-primary)',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {lesson.title}
                      </h3>

                      <p
                        style={{
                          fontFamily: 'var(--sans)',
                          color: 'var(--text-secondary)',
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                          marginBottom: '0.875rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {lesson.summary}
                      </p>

                      {lesson.tags && lesson.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                          {lesson.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontFamily: 'var(--mono)',
                                fontSize: '0.68rem',
                                color: 'var(--text-muted)',
                                background: 'var(--tag-bg)',
                                border: '1px solid var(--border)',
                                padding: '0.1rem 0.45rem',
                                borderRadius: '3px',
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div
                        style={{
                          fontFamily: 'var(--mono)',
                          fontSize: '0.68rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {formatDate(lesson.createdAt)}
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
