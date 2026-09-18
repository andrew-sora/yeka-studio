'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

const WEDDING_PHOTOS = [
  { src: '/images/wedding-1.jpg', alt: 'Foto wedding adat Jawa studio Jogja' },
  { src: '/images/wedding-2.jpg', alt: 'Prewedding kebaya merah maroon' },
  { src: '/images/wedding-3.jpg', alt: 'Foto engagement outdoor garden' },
  { src: '/images/wedding-4.jpg', alt: 'Portrait pengantin kebaya putih gold' },
];

export default function WeddingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-wedding').forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1';
                (el as HTMLElement).style.transform = 'translateY(0)';
              }, i * 120);
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
      id="wedding"
      ref={sectionRef}
      style={{
        background: '#1a0508',
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(ellipse at 80% 50%, rgba(123,28,42,0.4) 0%, transparent 60%),
          radial-gradient(ellipse at 10% 80%, rgba(201,169,75,0.06) 0%, transparent 40%)
        `,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
        {/* Section Header */}
        <div
          className="reveal-wedding"
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
            border: '1px solid rgba(201,169,75,0.3)',
            color: '#C9A94B',
            padding: '0.3rem 1rem',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}>
            Wedding &amp; Prewedding
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 600,
            color: 'white',
            lineHeight: 1.2,
            marginBottom: '0.5rem',
          }}>
            Keindahan Momen<br />
            <span style={{ color: '#C9A94B', fontStyle: 'italic' }}>Yang Tak Terlupakan</span>
          </h2>
          <div style={{
            width: '60px',
            height: '2px',
            background: 'linear-gradient(90deg, var(--maroon), #C9A94B)',
            margin: '0 auto 1rem',
          }} />
          <p style={{
            fontSize: '0.92rem',
            color: 'rgba(255,255,255,0.65)',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: 1.65,
            fontFamily: 'Inter, sans-serif',
          }}>
            Dari pernikahan adat Jawa yang sakral hingga prewedding modern yang intim.
            Setiap frame dirancang untuk menceritakan kisah cinta Anda.
          </p>
        </div>

        {/* Photo Grid - Staggered Luxury Editorial Gallery */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(10px, 2vw, 16px)',
          maxWidth: '820px',
          margin: '0 auto 3rem',
          alignItems: 'start',
        }}>
          {WEDDING_PHOTOS.map((photo, i) => {
            // Staggered offsets for middle column & alternating items
            const isMiddleCol = i % 3 === 1;
            const isRightCol = i % 3 === 2;
            const offsetY = isMiddleCol ? '1.5rem' : isRightCol ? '0.5rem' : '0px';
            const aspect = isMiddleCol ? '4/5' : '3/4';

            return (
              <div
                key={i}
                className="img-zoom reveal-wedding"
                style={{
                  aspectRatio: aspect,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative',
                  marginTop: offsetY,
                  opacity: 0,
                  transform: 'translateY(24px)',
                  transition: 'all 0.7s ease',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                  border: '1px solid rgba(201,169,75,0.2)',
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                {/* Subtle Luxury Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(26,5,8,0.7) 0%, transparent 60%)',
                    opacity: 0.5,
                    transition: 'opacity 0.4s ease',
                  }}
                  className="hover-overlay"
                />
              </div>
            );
          })}
        </div>

        {/* Theme & Price List Cards */}
        <div className="reveal-wedding" style={{ marginBottom: '3rem' }}>
          <div style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#C9A94B',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}>
            Pilihan Paket Wedding &amp; Prewedding Transparan
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}>
            {[
              { title: 'Prewedding Studio Adat Jawa', price: 'Rp 1.850.000', desc: 'Studio tirai merah, busana &amp; makeup adat Jawa lengkap' },
              { title: 'Prewedding Outdoor Scenic', price: 'Rp 2.250.000', desc: 'Lokasi outdoor Jogja/Solo + dokumentasi video reel' },
              { title: 'Intimate Wedding Coverage', price: 'Rp 4.500.000', desc: 'Full-day coverage akad &amp; resepsi + album cetak eksklusif' },
            ].map((pkg, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(8px)',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(201,169,75,0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: 'white',
                    marginBottom: '0.3rem',
                  }}>
                    {pkg.title}
                  </h3>
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#C9A94B',
                    marginBottom: '0.6rem',
                  }}>
                    {pkg.price}
                  </div>
                  <p style={{
                    fontSize: '0.78rem',
                    color: 'rgba(255,255,255,0.7)',
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
                    background: '#C9A94B',
                    color: '#1a0508',
                    padding: '0.6rem 1rem',
                    borderRadius: '4px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: 600,
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

        {/* Feature tags */}
        <div
          className="reveal-wedding"
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
          {['Studio Indoor Eksklusif', 'Konsep Adat Jawa & Modern', 'Wedding, Engagement, Prewedding', 'Editorial Luxury Look'].map((tag, i) => (
            <span key={i} style={{
              border: '1px solid rgba(201,169,75,0.3)',
              color: 'rgba(255,255,255,0.8)',
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
          className="reveal-wedding"
          style={{
            textAlign: 'center',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          <a
            href="#jadwal"
            id="cta-wedding-jadwal"
            style={{
              background: 'linear-gradient(135deg, var(--maroon) 0%, #A52A3A 100%)',
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: '2px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              border: '2px solid rgba(201,169,75,0.2)',
            }}
          >
            Konsultasi Paket Wedding
          </a>
          <p style={{
            marginTop: '0.75rem',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'Inter, sans-serif',
          }}>
            Pilih tanggal & jam — langsung terhubung ke WhatsApp kami
          </p>
        </div>
      </div>
    </section>
  );
}
