import Image from 'next/image';

const FOOTER_REEL = [
  '/images/wisuda-1.jpg',
  '/images/wedding-1.jpg',
  '/images/wisuda-2.jpg',
  '/images/wedding-2.jpg',
  '/images/wisuda-3.jpg',
  '/images/wedding-4.jpg',
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      background: '#0F0305',
      borderTop: '1px solid rgba(201,169,75,0.15)',
      paddingTop: '1.5rem',
    }}>
      {/* Mini Instagram Photo Reel Grid (Aligned to 1080px) */}
      <div style={{
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '0 1.25rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '3px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(201,169,75,0.2)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          {FOOTER_REEL.map((src, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
              <Image src={src} alt="Portfolio Yeka Studio" fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 33vw, 17vw" />
            </div>
          ))}
        </div>
      </div>

      <div style={{
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '2rem 1.25rem clamp(5rem, 8vh, 6.5rem) 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.65rem',
        textAlign: 'center',
      }}>
        <div className="font-script" style={{
          fontSize: '1.3rem',
          color: '#C9A94B',
          letterSpacing: '0.1em',
        }}>
          Yeka Creative Studio
        </div>
        <p style={{
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.05em',
        }}>
          &copy; {year} Yeka Creative Studio &mdash; Yogyakarta &amp; Solo &mdash; Female Photographer Team
        </p>
        <p style={{
          fontSize: '0.7rem',
          color: 'rgba(201,169,75,0.6)',
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
        }}>
          &ldquo;Fly High Your Moment With Us&rdquo;
        </p>
      </div>
    </footer>
  );
}

