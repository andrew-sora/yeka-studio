'use client';

const KAMPUS = ['UII', 'UIN Suka', 'UNY', 'UGM', 'UAD', 'UMY', 'USD', 'UII', 'UIN Suka', 'UNY', 'UGM', 'UAD', 'UMY', 'USD'];

export default function TrustBar() {
  return (
    <section
      id="trust"
      style={{
        background: 'linear-gradient(135deg, var(--maroon-dark) 0%, var(--maroon) 100%)',
        padding: '2rem 0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Stats Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'clamp(2rem, 8vw, 6rem)',
        padding: '0 1.5rem 1.5rem',
        flexWrap: 'wrap',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '1.5rem',
      }}>
        {[
          { value: '2.500+', label: 'Momen Wisuda Terabadikan' },
          { value: '7', label: 'Kampus di Jogja & Solo' },
          { value: '2', label: 'Fotografer Perempuan' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div
              className="font-display"
              style={{
                fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                fontWeight: 700,
                color: '#C9A94B',
                lineHeight: 1,
                marginBottom: '0.25rem',
              }}
            >
              {stat.value}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Marquee Kampus Strip */}
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div style={{
          display: 'flex',
          gap: '2.5rem',
          width: 'max-content',
          animation: 'marquee 18s linear infinite',
          alignItems: 'center',
        }}>
          {KAMPUS.map((k, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.5rem',
              flexShrink: 0,
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.85)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
              }}>
                {k}
              </span>
              <span style={{ color: '#C9A94B', fontSize: '0.5rem' }}>✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
