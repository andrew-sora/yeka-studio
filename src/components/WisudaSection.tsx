'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

const WISUDA_PHOTOS = [
  { src: '/images/wisuda-1.jpg', alt: 'Foto wisuda outdoor campus Jogja' },
  { src: '/images/wisuda-2.jpg', alt: 'Wisuda UGM candid joyful' },
  { src: '/images/wisuda-3.jpg', alt: 'Wisuda melempar toga celebration' },
  { src: '/images/wisuda-4.jpg', alt: 'Portrait wisuda elegan' },
  { src: '/images/wisuda-5.jpg', alt: 'Foto wisuda bersama sahabat' },
  { src: '/images/wisuda-6.jpg', alt: 'Wisuda outdoor botanical garden' },
];

export default function WisudaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-item').forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1';
                (el as HTMLElement).style.transform = 'translateY(0)';
              }, i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="wisuda"
      ref={sectionRef}
      style={{
        background: 'var(--cream)',
        padding: 'clamp(2.5rem, 5vw, 4rem) 1.25rem',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Section Header */}
        <div
          className="reveal-item"
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          <div style={{
            display: 'inline-block',
            background: 'rgba(123,28,42,0.08)',
            color: 'var(--maroon)',
            padding: '0.3rem 1rem',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            marginBottom: '0.75rem',
            borderRadius: '2px',
          }}>
            Paket Wisuda
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 600,
            color: 'var(--charcoal)',
            lineHeight: 1.2,
            marginBottom: '0.5rem',
          }}>
            Abadikan Momen Kelulusanmu
          </h2>
          <div className="section-divider" />
          <p style={{
            fontSize: '0.92rem',
            color: 'var(--muted)',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: 1.65,
            fontFamily: 'Inter, sans-serif',
          }}>
            Sesi foto outdoor candid dan berkesan di area kampus Jogja &amp; Solo.
            Hasil foto natural, sinematik, dan penuh kenangan bersama orang tersayang.
          </p>
        </div>

        {/* Photo Grid - Compact Gallery */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '8px',
          marginBottom: '2rem',
        }}>
          {WISUDA_PHOTOS.map((photo, i) => (
            <div
              key={i}
              className="img-zoom reveal-item"
              style={{
                aspectRatio: '1/1',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative',
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'all 0.7s ease',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Hover overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(90,19,32,0.7) 0%, transparent 50%)',
                opacity: 0,
                transition: 'opacity 0.4s ease',
              }}
                className="hover-overlay"
              />
            </div>
          ))}
        </div>

        {/* Theme & Price List Cards */}
        <div className="reveal-item" style={{ marginBottom: '3rem' }}>
          <div style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--maroon)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}>
            Pilihan Paket Wisuda &amp; Pricelist Transparan
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1rem',
          }}>
            {[
              { id: 'wisuda-outdoor', title: 'Wisuda Outdoor', price: 'Rp 450.000', desc: 'Sesi candid outdoor area kampus Jogja/Solo' },
              { id: 'wisuda-indoor', title: 'Wisuda Indoor', price: 'Rp 550.000', desc: 'Sesi indoor spot, hall kampus &amp; cafe' },
              { id: 'wisuda-studio', title: 'Wisuda Studio', price: 'Rp 650.000', desc: 'Studio setup lighting eksklusif Yeka' },
              { id: 'wisuda-all', title: 'Wisuda All-In', price: 'Rp 950.000', desc: 'Kombinasi Studio + Outdoor Campus Shoot' },
            ].map((pkg, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                border: '1px solid rgba(123,28,42,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: 'var(--charcoal)',
                    marginBottom: '0.3rem',
                  }}>
                    {pkg.title}
                  </h3>
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--maroon)',
                    marginBottom: '0.6rem',
                  }}>
                    {pkg.price}
                  </div>
                  <p style={{
                    fontSize: '0.78rem',
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                  }} dangerouslySetInnerHTML={{ __html: pkg.desc }} />
                </div>
                <a
                  href={`#jadwal?paket=${encodeURIComponent(pkg.title)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('jadwal');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    window.dispatchEvent(new CustomEvent('selectPackage', { detail: pkg.title }));
                  }}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: 'var(--maroon)',
                    color: 'white',
                    padding: '0.6rem 1rem',
                    borderRadius: '4px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                >
                  Pilih Paket ini
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Pills */}
        <div
          className="reveal-item"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'center',
            marginBottom: '2.5rem',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          {['Outdoor Campus Shoot', 'Gaya Candid & Natural', 'Area Kampus Jogja & Solo', 'Hasil Film-Look Editorial'].map((tag, i) => (
            <span key={i} style={{
              border: '1px solid rgba(123,28,42,0.25)',
              color: 'var(--maroon)',
              padding: '0.4rem 1rem',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div
          className="reveal-item"
          style={{
            textAlign: 'center',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          <a
            href="#jadwal"
            id="cta-wisuda-jadwal"
            className="btn-primary"
            style={{ fontSize: '0.875rem', padding: '1rem 2.5rem' }}
          >
            Booking Sesi Wisuda
          </a>
          <p style={{
            marginTop: '0.75rem',
            fontSize: '0.75rem',
            color: 'var(--muted)',
            fontFamily: 'Inter, sans-serif',
          }}>
            Pilih tanggal &amp; jam — langsung terhubung ke WhatsApp kami
          </p>
        </div>
      </div>
    </section>
  );
}

