import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLesson } from '@/lib/lessons';

export const dynamic = 'force-dynamic';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderMarkdown(content: string): string {
  let html = content;

  // Code blocks (must come before inline code)
  html = html.replace(/```[\w]*\n?([\s\S]*?)```/g, (_: string, code: string) => {
    const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre><code>${escaped}</code></pre>`;
  });

  // Headings
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');

  // Bold & italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Unordered list items
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match: string) => `<ul>${match}</ul>`);

  // Paragraphs: wrap lines that aren't already block-level elements
  const lines = html.split('\n');
  const result: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed === '' ||
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<pre') ||
      trimmed.startsWith('<ul') ||
      trimmed.startsWith('<ol') ||
      trimmed.startsWith('<li') ||
      trimmed.startsWith('<blockquote') ||
      trimmed.startsWith('</')
    ) {
      result.push(line);
    } else {
      result.push(`<p>${trimmed}</p>`);
    }
  }
  html = result.join('\n');

  return html;
}

const difficultyStyle: Record<string, React.CSSProperties> = {
  beginner: { color: '#16a34a', background: '#f0fdf4', borderColor: '#bbf7d0' },
  intermediate: { color: '#d97706', background: '#fffbeb', borderColor: '#fde68a' },
  advanced: { color: '#dc2626', background: '#fef2f2', borderColor: '#fecaca' },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function LessonPage({ params }: PageProps) {
  const { id } = await params;
  const lesson = await getLesson(id);

  if (!lesson) {
    notFound();
  }

  const diffStyle = difficultyStyle[lesson.difficulty] || difficultyStyle.beginner;

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
          gap: '0.5rem',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
          }}
        >
          ← harsh / dev lessons
        </Link>
        <span style={{ color: 'var(--border-strong)', fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>/</span>
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '400px',
          }}
        >
          {lesson.title}
        </span>
      </header>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Meta row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'var(--tag-bg)',
              border: '1px solid var(--border)',
              padding: '0.2rem 0.6rem',
              borderRadius: '3px',
            }}
          >
            {lesson.category}
          </span>
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.72rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              border: '1px solid',
              ...diffStyle,
            }}
          >
            {lesson.difficulty}
          </span>
          <div style={{ flex: 1 }} />
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}
          >
            {formatDate(lesson.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 300,
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            lineHeight: 1.2,
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
          }}
        >
          {lesson.title}
        </h1>

        {/* Summary blockquote */}
        <div
          style={{
            borderLeft: '3px solid var(--border-strong)',
            paddingLeft: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--sans)',
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            {lesson.summary}
          </p>
        </div>

        {/* Conversation context chip */}
        {lesson.conversationContext && (
          <div style={{ marginBottom: '1.5rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontFamily: 'var(--mono)',
                fontSize: '0.75rem',
                color: '#1d4ed8',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
              }}
            >
              💬 {lesson.conversationContext}
            </span>
          </div>
        )}

        {/* Horizontal rule */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0' }} />

        {/* Main content */}
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.content) }}
        />

        {/* Real world example */}
        {lesson.realWorldExample && (
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '1.25rem',
              marginTop: '2rem',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.72rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#92400e',
                marginBottom: '0.6rem',
              }}
            >
              🌍 Real World Example
            </div>
            <p
              style={{
                fontFamily: 'var(--sans)',
                color: '#78350f',
                lineHeight: 1.7,
                margin: 0,
                fontSize: '0.925rem',
              }}
            >
              {lesson.realWorldExample}
            </p>
          </div>
        )}

        {/* Key takeaways */}
        {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '1.25rem',
              marginTop: '1.5rem',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.72rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
              }}
            >
              Key Takeaways
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {lesson.keyTakeaways.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '0.6rem',
                    fontFamily: 'var(--sans)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    paddingBottom: i < lesson.keyTakeaways.length - 1 ? '0.5rem' : 0,
                  }}
                >
                  <span style={{ color: 'var(--accent)', fontWeight: 600, flexShrink: 0 }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {lesson.tags && lesson.tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border)',
            }}
          >
            {lesson.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  background: 'var(--tag-bg)',
                  border: '1px solid var(--border)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '3px',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
