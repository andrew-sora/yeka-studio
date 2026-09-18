export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      background: '#0d0205',
      padding: '2rem 1.5rem',
      borderTop: '1px solid rgba(201,169,75,0.1)',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        textAlign: 'center',
      }}>
        <div className="font-script" style={{
          fontSize: '1.2rem',
          color: '#C9A94B',
          letterSpacing: '0.1em',
        }}>
          Yeka Creative Studio
        </div>
        <p style={{
          fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.25)',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.05em',
        }}>
          &copy; {year} Yeka Creative Studio &mdash; Yogyakarta &amp; Solo &mdash; All rights reserved
        </p>
        <p style={{
          fontSize: '0.68rem',
          color: 'rgba(255,255,255,0.15)',
          fontFamily: 'Inter, sans-serif',
          fontStyle: 'italic',
        }}>
          &ldquo;Fly High Your Moment With Us&rdquo;
        </p>
      </div>
    </footer>
  );
}
