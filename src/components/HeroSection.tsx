'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const HERO_SHOWCASE = [
  {
    id: 'wedding',
    category: 'Wedding & Prewedding',
    title: 'Intimate & Editorial Style',
    photo: '/images/wedding-1.jpg',
    badge: 'Wedding & Prewedding',
    location: 'Jogja & Solo',
  },
  {
    id: 'wisuda',
    category: 'Paket Wisuda',
    title: 'Candid & Natural Celebration',
    photo: '/images/wisuda-1.jpg',
    badge: 'Wisuda Campus',
    location: 'Area UGM, UNY, UMY, UNS & Studio',
  },
  {
    id: 'kebaya',
    category: 'Prewedding Kebaya',
    title: 'Elegansi Adat & Classic Look',
    photo: '/images/wedding-2.jpg',
    badge: 'Prewedding Aesthetic',
    location: 'Jogja & Solo',
  },
  {
    id: 'outdoor',
    category: 'Wisuda Outdoor',
    title: 'Joyful & Authentic Moments',
    photo: '/images/wisuda-3.jpg',
    badge: 'Wisuda Outdoor',
    location: 'Spot Garden & City Walk',
  }
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

  // Auto rotate photo showcase every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % HERO_SHOWCASE.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeItem = HERO_SHOWCASE[activeTab];

  return (
    <section
      id="hero"
      style={{
        minHeight: '100svh',
        background: 'linear-gradient(135deg, #120305 0%, #29080F 35%, #4C101B 70%, #7B1C2A 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(5rem, 8vw, 7rem) 1.5rem clamp(3rem, 6vw, 4rem)',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Photo Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.22,
        transition: 'all 1s ease',
      }}>
        <Image
          src={activeItem.photo}
          alt="Hero ambient background"
          fill
          priority
          style={{ objectFit: 'cover', filter: 'blur(12px) scale(1.1)' }}
        />
      </div>

      {/* Dark Vignette Overlay & Gradients */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at 30% 40%, rgba(123, 28, 42, 0.4) 0%, transparent 70%),
          linear-gradient(to right, rgba(18, 3, 5, 0.95) 0%, rgba(18, 3, 5, 0.75) 50%, rgba(18, 3, 5, 0.85) 100%),
          linear-gradient(to bottom, rgba(18, 3, 5, 0.6) 0%, transparent 50%, rgba(18, 3, 5, 0.9) 100%)
        `,
        pointerEvents: 'none',
      }} />

      {/* Grain Texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        opacity: 0.4,
        pointerEvents: 'none',
      }} />

      <div
        ref={headlineRef}
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1240px',
          width: '100%',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(2rem, 5vw, 4rem)',
          alignItems: 'center',
        }}
      >
        {/* ── LEFT COLUMN: Text Content & Actions ── */}
        <div style={{ textAlign: 'left' }}>

          {/* Brand Header */}
          <div className="animate-on-enter opacity-0-init" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="4" fill="none" stroke="#C9A94B" strokeWidth="1.5"/>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <ellipse
                  key={i}
                  cx={24 + 10 * Math.cos((angle * Math.PI) / 180)}
                  cy={24 + 10 * Math.sin((angle * Math.PI) / 180)}
                  rx="4"
                  ry="7"
                  fill="none"
                  stroke="rgba(201,169,75,0.6)"
                  strokeWidth="1"
                  transform={`rotate(${angle} ${24 + 10 * Math.cos((angle * Math.PI) / 180)} ${24 + 10 * Math.sin((angle * Math.PI) / 180)})`}
                />
              ))}
            </svg>
            <span className="font-script" style={{
              fontSize: '1.15rem',
              color: '#C9A94B',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              Yeka Creative Studio
            </span>
          </div>

          {/* Female Photographer Badge */}
          <div className="animate-on-enter opacity-0-init" style={{
            display: 'inline-block',
            border: '1px solid rgba(201, 169, 75, 0.4)',
            background: 'rgba(201, 169, 75, 0.08)',
            color: '#C9A94B',
            padding: '0.35rem 1rem',
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            borderRadius: '2px',
          }}>
            Female Photographer Team
          </div>

          {/* Main Headline */}
          <h1 className="animate-on-enter opacity-0-init font-display" style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            fontWeight: 600,
            color: 'white',
            lineHeight: 1.12,
            marginBottom: '1.25rem',
            letterSpacing: '-0.01em',
          }}>
            Abadikan Momen<br />
            <span style={{ color: '#C9A94B', fontStyle: 'italic' }}>Paling Berharga</span>
            <br />
            <span style={{ fontSize: '0.62em', fontWeight: 300, color: 'rgba(255,255,255,0.9)', display: 'block', marginTop: '0.3rem' }}>
              Wedding, Prewedding &amp; Wisuda di Jogja-Solo
            </span>
          </h1>

          {/* Tagline */}
          <p className="animate-on-enter opacity-0-init" style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)',
            color: 'rgba(255,255,255,0.78)',
            marginBottom: '1.75rem',
            fontStyle: 'italic',
            lineHeight: 1.6,
          }}>
            &ldquo;Fly High Your Moment With Us&rdquo; — Sentuhan estetis, hangat, dan natural dari perspektif tim fotografer wanita.
          </p>

          {/* Rating & Trust Metrics */}
          <div className="animate-on-enter opacity-0-init" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '0.75rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            maxWidth: 'fit-content',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ display: 'flex', color: '#F59E0B', fontSize: '0.85rem', gap: '3px' }}>
              ★★★★★
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.3,
            }}>
              <strong>4.9 / 5.0 Rating</strong> <span style={{ color: 'rgba(255,255,255,0.5)' }}>• 500+ Momen Terabadikan</span>
            </div>
          </div>

          {/* Dual CTAs */}
          <div className="animate-on-enter opacity-0-init" style={{
            display: 'flex',
            gap: '0.85rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <a
              href="#wisuda"
              id="cta-wisuda-hero"
              className="btn-primary"
              style={{
                background: 'var(--maroon)',
                borderColor: 'var(--maroon)',
                padding: '0.85rem 1.6rem',
                fontSize: '0.85rem',
                boxShadow: '0 8px 24px rgba(123,28,42,0.4)',
              }}
            >
              Lihat Paket Wisuda
            </a>
            <a
              href="#wedding"
              id="cta-wedding-hero"
              className="btn-outline"
              style={{
                padding: '0.85rem 1.6rem',
                fontSize: '0.85rem',
              }}
            >
              Wedding &amp; Prewedding
            </a>
            <a
              href="#jadwal"
              id="cta-jadwal-hero"
              style={{
                color: '#C9A94B',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.82rem',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 0.75rem',
                borderBottom: '1px solid rgba(201,169,75,0.4)',
              }}
            >
              Cek Kalender Slot &rarr;
            </a>
          </div>

        </div>

        {/* ── RIGHT COLUMN: Interactive Visual Photo Showcase ── */}
        <div className="animate-on-enter opacity-0-init" style={{ position: 'relative' }}>

          {/* Interactive Category Selector Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.4rem',
            marginBottom: '1rem',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}>
            {HERO_SHOWCASE.map((item, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(idx)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '20px',
                    fontSize: '0.73rem',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.25s ease',
                    border: `1px solid ${isActive ? '#C9A94B' : 'rgba(255,255,255,0.15)'}`,
                    background: isActive ? '#C9A94B' : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#1a0508' : 'rgba(255,255,255,0.8)',
                    boxShadow: isActive ? '0 4px 14px rgba(201,169,75,0.3)' : 'none',
                  }}
                >
                  {item.badge}
                </button>
              );
            })}
          </div>

          {/* Main Visual Photo Card Container */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            padding: '8px',
            background: 'linear-gradient(135deg, rgba(201,169,75,0.4) 0%, rgba(123,28,42,0.3) 100%)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          }}>
            <div style={{
              position: 'relative',
              aspectRatio: '4/5',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#120305',
            }}>

              {/* Photo Image with smooth transition */}
              <Image
                key={activeItem.photo}
                src={activeItem.photo}
                alt={activeItem.title}
                fill
                priority
                style={{
                  objectFit: 'cover',
                  animation: 'fadeIn 0.6s ease',
                }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Gradient Overlay for Text Readability */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(18,3,5,0.9) 0%, rgba(18,3,5,0.2) 40%, transparent 70%)',
              }} />

              {/* Top Floating Glassmorphism Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'rgba(18, 3, 5, 0.65)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(201, 169, 75, 0.4)',
                borderRadius: '100px',
                padding: '0.4rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#C9A94B',
                }} />
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: 'white',
                  letterSpacing: '0.05em',
                }}>
                  {activeItem.badge}
                </span>
              </div>

              {/* Bottom Photo Info Glassmorphism Card */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                background: 'rgba(26, 5, 8, 0.85)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{
                    fontSize: '0.68rem',
                    color: '#C9A94B',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    marginBottom: '0.15rem',
                  }}>
                    {activeItem.category}
                  </div>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'white',
                    lineHeight: 1.2,
                  }}>
                    {activeItem.title}
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'Inter, sans-serif',
                    marginTop: '0.2rem',
                  }}>
                    {activeItem.location}
                  </div>
                </div>

                <a
                  href="#wisuda"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'var(--maroon)',
                    border: '1px solid rgba(201,169,75,0.5)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    flexShrink: 0,
                    fontSize: '1.1rem',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                  title="Lihat Galeri Foto"
                >
                  &rarr;
                </a>
              </div>

            </div>

            {/* Sub-Thumbnails Grid for Quick Preview */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px',
              marginTop: '8px',
            }}>
              {HERO_SHOWCASE.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setActiveTab(idx)}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: `2px solid ${activeTab === idx ? '#C9A94B' : 'transparent'}`,
                    opacity: activeTab === idx ? 1 : 0.6,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Image
                    src={item.photo}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* CSS Keyframes for slide fade */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(1.03); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}


