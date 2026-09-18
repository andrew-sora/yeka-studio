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
      background: '#0a0204',
      borderTop: '1px solid rgba(201,169,75,0.15)',
    }}>
      {/* Mini Instagram Photo Reel Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '2px',
        background: '#120305',
      }}>
        {FOOTER_REEL.map((src, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
            <Image src={src} alt="Portfolio Yeka Studio" fill style={{ objectFit: 'cover' }} sizes="150px" />
          </div>
        ))}
      </div>

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '2.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
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

