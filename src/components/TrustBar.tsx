'use client';
import Image from 'next/image';

const KAMPUS = ['UGM', 'UNY', 'UIN Sunan Kalijaga', 'UII', 'UMY', 'USD', 'UAD', 'UNS Solo', 'UGM', 'UNY', 'UIN Sunan Kalijaga', 'UII', 'UMY', 'USD', 'UAD', 'UNS Solo'];

const CLIENT_AVATARS = [
  '/images/wisuda-1.jpg',
  '/images/wisuda-2.jpg',
  '/images/wedding-1.jpg',
  '/images/wisuda-3.jpg',
  '/images/wedding-2.jpg',
];

export default function TrustBar() {
  return (
    <section
      id="trust"
      style={{
        background: 'linear-gradient(135deg, #180407 0%, #350A13 50%, #54111D 100%)',
        padding: '2.5rem 1.5rem',
        overflow: 'hidden',
        position: 'relative',
        borderTop: '1px solid rgba(201,169,75,0.2)',
        borderBottom: '1px solid rgba(201,169,75,0.2)',
      }}
    >
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(201,169,75,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* Top Row: Client Avatars + Metrics */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '1.5rem',
        }}>

          {/* Client Photo Avatar Stack */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {CLIENT_AVATARS.map((src, i) => (
                <div
                  key={i}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '2px solid #D4AF37',
                    marginLeft: i === 0 ? 0 : '-10px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
                  }}
                >
                  <Image src={src} alt="Klien Yeka Studio" fill style={{ objectFit: 'cover' }} sizes="80px" />
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', color: '#F59E0B', fontSize: '0.82rem', gap: '2px' }}>
                ★★★★★
              </div>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.84rem',
                color: '#FFFDF9',
                fontWeight: 600,
                marginTop: '1px',
              }}>
                2.500+ Momen Terabadikan
              </div>
              <div style={{ fontSize: '0.72rem', color: '#F5EBE0', fontFamily: 'Inter, sans-serif' }}>
                Dipercaya Mahasiswa &amp; Pasangan Jogja-Solo
              </div>
            </div>
          </div>

          {/* Key Stats Row with Grid on Mobile */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(0.75rem, 3vw, 2.5rem)',
              alignItems: 'center',
              width: '100%',
              maxWidth: '520px',
            }}
          >
            {[
              { value: '2.500+', label: 'Foto Delivered' },
              { value: '8+', label: 'Kampus Jogja-Solo' },
              { value: '100%', label: 'Female Team' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.3rem, 2.8vw, 1.9rem)',
                    fontWeight: 700,
                    color: '#D4AF37',
                    lineHeight: 1.15,
                    marginBottom: '0.15rem',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.68rem',
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: 1.25,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Marquee Kampus Strip */}
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <div style={{
            display: 'flex',
            gap: '2.5rem',
            width: 'max-content',
            animation: 'marquee 22s linear infinite',
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
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.9)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                  whiteSpace: 'nowrap',
                }}>
                  {k}
                </span>
                <span style={{ color: '#C9A94B', fontSize: '0.6rem' }}>✦</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

