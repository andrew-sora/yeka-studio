'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const HERO_SHOWCASE = [
  {
    id: 'wisuda',
    category: 'Paket Wisuda',
    title: 'Candid & Natural Celebration',
    mainPhoto: '/images/wisuda-1.jpg',
    subPhoto: '/images/wisuda-3.jpg',
    location: 'Area UGM, UNY, UMY & Studio',
    badge: 'Wisuda Campus',
  },
  {
    id: 'wedding',
    category: 'Wedding & Prewedding',
    title: 'Studio Adat Jawa & Prewedding',
    mainPhoto: '/images/wedding-1.jpg',
    subPhoto: '/images/wedding-2.jpg',
    location: 'Jogja & Solo',
    badge: 'Signature Studio',
  },
  {
    id: 'outdoor',
    category: 'Prewedding Outdoor',
    title: 'Joyful & Romantic Moments',
    mainPhoto: '/images/wedding-3.jpg',
    subPhoto: '/images/wisuda-5.jpg',
    location: 'Garden & Spot Scenic',
    badge: 'Outdoor Prewedding',
  },
];

export default function HeroSection() {
  const headlineRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.animate-on-enter').forEach((el, i) => {
              (el as HTMLElement).style.animationDelay = `${i * 0.12}s`;
              el.classList.add('animate-fade-in-up');
              el.classList.remove('opacity-0-init');
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (headlineRef.current) observer.observe(headlineRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto rotate showcase item every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % HERO_SHOWCASE.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const activeItem = HERO_SHOWCASE[activeTab];

  return (
    <section
      id="hero"
      style={{
        minHeight: 'clamp(520px, 85vh, 780px)',
        background: 'linear-gradient(135deg, #120305 0%, #29080F 35%, #4C101B 70%, #7B1C2A 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(2.5rem, 4vw, 4.5rem) 1rem clamp(2rem, 3.5vw, 3.5rem)',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.18,
        transition: 'all 1s ease',
      }}>
        <Image
          src={activeItem.mainPhoto}
          alt="Hero ambient background"
          fill
          priority
          style={{ objectFit: 'cover', filter: 'blur(16px) scale(1.1)' }}
        />
      </div>

      {/* Vignette Overlays */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at 25% 40%, rgba(123, 28, 42, 0.45) 0%, transparent 70%),
          linear-gradient(to right, rgba(18, 3, 5, 0.95) 0%, rgba(18, 3, 5, 0.75) 55%, rgba(18, 3, 5, 0.85) 100%),
          linear-gradient(to bottom, rgba(18, 3, 5, 0.6) 0%, transparent 50%, rgba(18, 3, 5, 0.9) 100%)
        `,
        pointerEvents: 'none',
      }} />

      {/* Grain Texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        opacity: 0.35,
        pointerEvents: 'none',
      }} />

      <div
        ref={headlineRef}
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1080px',
          width: '100%',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(1.25rem, 3.5vw, 3rem)',
          alignItems: 'center',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        }}
      >
        {/* ── LEFT COLUMN: Magazine Split Typography & Script Accent ── */}
        <div style={{ textAlign: 'left', maxWidth: '100%' }}>

          {/* Brand Header */}
          <div className="animate-on-enter opacity-0-init" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.68rem',
              letterSpacing: '0.18em',
              color: '#C9A94B',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
            }}>
              YEKA CREATIVE STUDIO
            </span>
            <span style={{ height: '1px', width: '20px', background: 'rgba(201,169,75,0.4)' }} />
            <span style={{
              fontSize: '0.64rem',
              color: 'rgba(201, 169, 75, 0.9)',
              background: 'rgba(201, 169, 75, 0.1)',
              border: '1px solid rgba(201, 169, 75, 0.3)',
              padding: '0.18rem 0.5rem',
              borderRadius: '2px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}>
              Female Photographer Team
            </span>
          </div>

          {/* Main Headline with High-Impact Value Proposition */}
          <h1 className="animate-on-enter opacity-0-init font-display" style={{
            fontSize: 'clamp(1.6rem, 4.2vw, 3.4rem)',
            fontWeight: 600,
            color: 'white',
            lineHeight: 1.18,
            marginBottom: '0.75rem',
            letterSpacing: '-0.01em',
            wordBreak: 'break-word',
          }}>
            Abadikan Momen<br />
            <span style={{
              color: '#C9A94B',
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontSize: '1.08em',
              fontWeight: 500,
              display: 'inline-block',
            }}>
              Paling Berharga
            </span>
          </h1>

          {/* Explicit 3-Second Value Proposition Subtitle */}
          <p className="animate-on-enter opacity-0-init" style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)',
            color: 'rgba(255, 255, 255, 0.88)',
            lineHeight: 1.55,
            marginBottom: '1rem',
            maxWidth: '480px',
          }}>
            Jasa foto <strong>Wedding, Prewedding &amp; Wisuda</strong> di Jogja &amp; Solo dengan sentuhan warm, natural &amp; personal dari perspektif tim fotografer wanita.
          </p>

          {/* Trust Metric Badge */}
          <div className="animate-on-enter opacity-0-init" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '1.25rem',
            padding: '0.4rem 0.85rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            maxWidth: 'fit-content',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ display: 'flex', color: '#F59E0B', fontSize: '0.75rem', gap: '2px' }}>
              ★★★★★
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.3,
            }}>
              <strong>2.500+ Momen Terabadikan</strong> <span style={{ color: 'rgba(255,255,255,0.5)' }}>• Jogja &amp; Solo</span>
            </div>
          </div>

          {/* Clean Dual CTAs */}
          <div className="animate-on-enter opacity-0-init" style={{
            display: 'flex',
            gap: '0.65rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <a
              href="#wisuda"
              id="cta-wisuda-hero"
              style={{
                background: 'linear-gradient(135deg, #7B1C2A 0%, #4C101B 100%)',
                color: 'white',
                border: '1px solid rgba(201,169,75,0.4)',
                padding: '0.7rem 1.35rem',
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(123, 28, 42, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.borderColor = '#C9A94B';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,75,0.4)';
              }}
            >
              Lihat Paket Wisuda
            </a>
            <a
              href="#wedding"
              id="cta-wedding-hero"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '0.7rem 1.35rem',
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.82rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,75,0.4)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              Wedding &amp; Prewedding
            </a>
          </div>

        </div>

        {/* ── RIGHT COLUMN: Editorial Photo Frame Collage ── */}
        <div className="animate-on-enter opacity-0-init" style={{ position: 'relative' }}>

          <div style={{
            position: 'relative',
            maxWidth: '100%',
            width: '100%',
            margin: '0 auto',
            paddingBottom: '0.5rem',
          }}>

            {/* Main Editorial Frame Photo */}
            <div style={{
              position: 'relative',
              width: '80%',
              aspectRatio: '3/4',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              border: '1px solid rgba(201, 169, 75, 0.3)',
              background: '#120305',
            }}>
              <Image
                key={activeItem.mainPhoto}
                src={activeItem.mainPhoto}
                alt={activeItem.title}
                fill
                priority
                style={{
                  objectFit: 'cover',
                  animation: 'fadeIn 0.6s ease',
                }}
                sizes="(max-width: 768px) 80vw, 40vw"
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(18,3,5,0.7) 0%, transparent 60%)',
              }} />

              {/* Glassmorphism Title Tag */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                background: 'rgba(26, 5, 8, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(201, 169, 75, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
              }}>
                <div style={{
                  fontSize: '0.62rem',
                  color: '#C9A94B',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                }}>
                  {activeItem.badge}
                </div>
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: 'white',
                  lineHeight: 1.2,
                  marginTop: '1px',
                }}>
                  {activeItem.title}
                </div>
              </div>
            </div>

            {/* Secondary Overlapping Staggered Photo Card */}
            <div style={{
              position: 'absolute',
              right: '0',
              bottom: '2rem',
              width: '48%',
              aspectRatio: '1/1',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
              border: '2px solid rgba(201, 169, 75, 0.35)',
              background: '#1a0508',
            }}>
              <Image
                key={activeItem.subPhoto}
                src={activeItem.subPhoto}
                alt="Editorial session detail"
                fill
                style={{
                  objectFit: 'cover',
                  animation: 'fadeIn 0.6s ease',
                }}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(18,3,5,0.5) 0%, transparent 60%)',
              }} />
            </div>

            {/* Slide Navigation Dots */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.4rem',
              marginTop: '1.25rem',
            }}>
              {HERO_SHOWCASE.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  aria-label={`Show slide ${idx + 1}`}
                  style={{
                    width: activeTab === idx ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '100px',
                    background: activeTab === idx ? '#C9A94B' : 'rgba(255,255,255,0.25)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* CSS Keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(1.03); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
