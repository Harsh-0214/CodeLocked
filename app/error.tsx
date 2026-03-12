'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          server error
        </p>
        <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Something went wrong
        </h1>
        <p style={{ fontFamily: 'var(--sans)', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {error.message?.includes('SUPABASE') || error.message?.includes('env')
            ? 'Supabase environment variables are not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your Vercel project settings, then redeploy.'
            : 'An unexpected error occurred. Check the Vercel function logs for details.'}
        </p>
        <code style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--tag-bg)', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>
          {error.message}
        </code>
      </div>
    </div>
  );
}
