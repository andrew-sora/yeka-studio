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
        minHeight: 'clamp(580px, 90vh, 820px)',
        background: 'linear-gradient(135deg, #120305 0%, #29080F 35%, #4C101B 70%, #7B1C2A 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(5.5rem, 9vw, 7.5rem) 1.25rem clamp(2.5rem, 4.5vw, 4rem)',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Vignette with Crossfade */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.18,
        transition: 'all 0.8s ease',
      }}>
        {HERO_SHOWCASE.map((item, idx) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: activeTab === idx ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
            }}
          >
            <Image
              src={item.mainPhoto}
              alt="Hero ambient background"
              fill
              priority={idx === 0}
              style={{ objectFit: 'cover', filter: 'blur(16px) scale(1.1)' }}
            />
          </div>
        ))}
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
        className="hero-layout-grid"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1120px',
          width: '100%',
          margin: '0 auto',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        }}
      >
        {/* ── LEFT COLUMN: Editorial Value Proposition ── */}
        <div style={{ textAlign: 'left', maxWidth: '100%' }}>

          {/* Brand Eyebrow Tag */}
          <div className="animate-on-enter opacity-0-init" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.72rem',
              letterSpacing: '0.2em',
              color: '#D4AF37',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
            }}>
              YEKA CREATIVE STUDIO
            </span>
            <span style={{ color: 'rgba(212,175,55,0.45)', fontSize: '0.75rem' }}>•</span>
            <span style={{
              fontSize: '0.68rem',
              color: '#F5EBE0',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              padding: '0.22rem 0.65rem',
              borderRadius: '3px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
            }}>
              Female Photographer Team
            </span>
          </div>

          {/* Main Headline with High-Impact Typography */}
          <h1 className="animate-on-enter opacity-0-init font-display" style={{
            fontSize: 'clamp(2.1rem, 5vw, 3.6rem)',
            fontWeight: 600,
            color: '#FFFDF9',
            lineHeight: 1.15,
            marginBottom: '1rem',
            letterSpacing: '-0.01em',
            wordBreak: 'break-word',
          }}>
            Abadikan Momen<br />
            <span style={{
              color: '#D4AF37',
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontSize: '1.08em',
              fontWeight: 500,
              display: 'inline-block',
            }}>
              Paling Berharga
            </span>
          </h1>

          {/* Clear Value Proposition Subtitle */}
          <p className="animate-on-enter opacity-0-init" style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(0.92rem, 1.5vw, 1.08rem)',
            color: '#F5EBE0',
            lineHeight: 1.65,
            marginBottom: '1.5rem',
            maxWidth: '520px',
          }}>
            Jasa foto <strong>Wedding, Prewedding &amp; Wisuda</strong> di Yogyakarta &amp; Solo. Sentuhan natural, hangat, dan personal dari perspektif tim fotografer wanita untuk kenyamanan penuh Anda.
          </p>

          {/* Trust Metric Badge */}
          <div className="animate-on-enter opacity-0-init" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.75rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '8px',
            maxWidth: 'fit-content',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ display: 'flex', color: '#F59E0B', fontSize: '0.82rem', gap: '2px' }}>
              ★★★★★
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.3,
            }}>
              <strong>2.500+ Momen Terabadikan</strong> <span style={{ color: 'rgba(255,255,255,0.6)' }}>• Jogja &amp; Solo</span>
            </div>
          </div>

          {/* Dual Action CTAs with Accessible Touch Targets (Mobile-first responsive group) */}
          <div className="animate-on-enter opacity-0-init hero-cta-group">
            <a
              href="#wisuda"
              id="cta-wisuda-hero"
              className="hero-cta-btn"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('wisuda')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'linear-gradient(135deg, #7B1C2A 0%, #5A1320 100%)',
                color: 'white',
                border: '1px solid rgba(212,175,55,0.5)',
                padding: '0.85rem 1.6rem',
                minHeight: '48px',
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.86rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(123, 28, 42, 0.45)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.borderColor = '#D4AF37';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.5)';
              }}
            >
              Lihat Paket Wisuda
            </a>

            <a
              href="#wedding"
              id="cta-wedding-hero"
              className="hero-cta-btn"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('wedding')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#FFFDF9',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '0.85rem 1.6rem',
                minHeight: '48px',
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.86rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLElement).style.borderColor = '#D4AF37';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)';
              }}
            >
              Wedding &amp; Prewedding
            </a>
          </div>

        </div>

        {/* ── RIGHT COLUMN: Editorial Photo Frame Collage (No Blank Frames) ── */}
        <div className="animate-on-enter opacity-0-init" style={{ position: 'relative' }}>

          <div style={{
            position: 'relative',
            maxWidth: '460px',
            width: '100%',
            margin: '0 auto',
            paddingBottom: '0.5rem',
          }}>

            {/* Main Editorial Frame Photo */}
            <div style={{
              position: 'relative',
              width: '82%',
              aspectRatio: '3/4',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
              border: '1.5px solid rgba(212, 175, 55, 0.4)',
              background: '#1A0508',
            }}>
              {HERO_SHOWCASE.map((item, idx) => (
                <div
                  key={`main-${item.id}`}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: activeTab === idx ? 1 : 0,
                    transition: 'opacity 0.6s ease-in-out',
                    zIndex: activeTab === idx ? 2 : 1,
                  }}
                >
                  <Image
                    src={item.mainPhoto}
                    alt={item.title}
                    fill
                    priority={idx === 0}
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center 20%',
                    }}
                    sizes="(max-width: 768px) 80vw, 40vw"
                  />
                </div>
              ))}

              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(18,3,5,0.75) 0%, transparent 60%)',
                zIndex: 3,
                pointerEvents: 'none',
              }} />

              {/* Glassmorphism Title Tag */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                background: 'rgba(26, 5, 8, 0.88)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                zIndex: 4,
              }}>
                <div style={{
                  fontSize: '0.64rem',
                  color: '#D4AF37',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                }}>
                  {activeItem.badge}
                </div>
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#FFFDF9',
                  lineHeight: 1.2,
                  marginTop: '2px',
                }}>
                  {activeItem.title}
                </div>
              </div>
            </div>

            {/* Secondary Overlapping Staggered Photo Card */}
            <div style={{
              position: 'absolute',
              right: '0',
              bottom: '1.5rem',
              width: '46%',
              aspectRatio: '1/1',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 18px 45px rgba(0,0,0,0.75)',
              border: '2px solid rgba(212, 175, 55, 0.45)',
              background: '#1a0508',
              zIndex: 5,
            }}>
              {HERO_SHOWCASE.map((item, idx) => (
                <div
                  key={`sub-${item.id}`}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: activeTab === idx ? 1 : 0,
                    transition: 'opacity 0.6s ease-in-out',
                  }}
                >
                  <Image
                    src={item.subPhoto}
                    alt="Editorial session detail"
                    fill
                    priority={idx === 0}
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center 20%',
                    }}
                    sizes="(max-width: 768px) 45vw, 22vw"
                  />
                </div>
              ))}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(18,3,5,0.5) 0%, transparent 60%)',
                pointerEvents: 'none',
              }} />
            </div>

            {/* Slide Navigation Dots with Accessible Targets */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1.5rem',
            }}>
              {HERO_SHOWCASE.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  aria-label={`Tampilkan showcase ${item.category}`}
                  style={{
                    width: activeTab === idx ? '28px' : '10px',
                    height: '10px',
                    borderRadius: '100px',
                    background: activeTab === idx ? '#D4AF37' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0,
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
