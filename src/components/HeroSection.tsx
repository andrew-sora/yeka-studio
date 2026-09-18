'use client';
import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.animate-on-enter').forEach((el, i) => {
              (el as HTMLElement).style.animationDelay = `${i * 0.15}s`;
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

  return (
    <section
      id="hero"
      style={{
        minHeight: '100svh',
        background: 'linear-gradient(135deg, #1a0508 0%, #3d0e18 30%, #5A1320 60%, #7B1C2A 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          radial-gradient(ellipse at 20% 50%, rgba(201, 169, 75, 0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(123, 28, 42, 0.3) 0%, transparent 50%)
        `,
      }} />

      {/* Decorative circles */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        border: '1px solid rgba(201, 169, 75, 0.1)',
        animation: 'float 6s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '3%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        border: '1px solid rgba(201, 169, 75, 0.08)',
        animation: 'float 8s ease-in-out infinite reverse',
      }} />

      {/* Grain texture */}
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
          textAlign: 'center',
          padding: '2rem 1.5rem',
          maxWidth: '680px',
          width: '100%',
        }}
      >
        {/* Logo / Brand */}
        <div className="animate-on-enter opacity-0-init" style={{ marginBottom: '2.5rem' }}>
          {/* Decorative flower icon */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="4" fill="none" stroke="#C9A94B" strokeWidth="1.5"/>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <ellipse
                  key={i}
                  cx={24 + 10 * Math.cos((angle * Math.PI) / 180)}
                  cy={24 + 10 * Math.sin((angle * Math.PI) / 180)}
                  rx="4"
                  ry="7"
                  fill="none"
                  stroke="rgba(201,169,75,0.5)"
                  strokeWidth="1"
                  transform={`rotate(${angle} ${24 + 10 * Math.cos((angle * Math.PI) / 180)} ${24 + 10 * Math.sin((angle * Math.PI) / 180)})`}
                />
              ))}
            </svg>
          </div>
          <div className="font-script" style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
            color: '#C9A94B',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}>
            Yeka Creative Studio
          </div>
        </div>

        {/* Female Photographer badge */}
        <div className="animate-on-enter opacity-0-init" style={{
          display: 'inline-block',
          border: '1px solid rgba(201, 169, 75, 0.4)',
          color: '#C9A94B',
          padding: '0.35rem 1.2rem',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
        }}>
          ✦ Female Photographer ✦
        </div>

        {/* Main Headline */}
        <h1 className="animate-on-enter opacity-0-init font-display" style={{
          fontSize: 'clamp(2.2rem, 7vw, 4rem)',
          fontWeight: 600,
          color: 'white',
          lineHeight: 1.15,
          marginBottom: '1.25rem',
          letterSpacing: '-0.01em',
        }}>
          Wedding, Prewedding<br />
          <span style={{ color: '#C9A94B', fontStyle: 'italic' }}>&amp; Wisuda</span>
          <br />
          <span style={{ fontSize: '0.7em', fontWeight: 300, opacity: 0.9 }}>
            di Jogja &amp; Solo
          </span>
        </h1>

        {/* Tagline */}
        <p className="animate-on-enter opacity-0-init" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: '2.5rem',
          fontStyle: 'italic',
          letterSpacing: '0.04em',
        }}>
          &ldquo;Fly High Your Moment With Us&rdquo;
        </p>

        {/* Dual CTA */}
        <div className="animate-on-enter opacity-0-init" style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <a
            href="#wisuda"
            id="cta-wisuda-hero"
            className="btn-primary"
            style={{ background: 'var(--maroon)', borderColor: 'var(--maroon)' }}
          >
            🎓 Lihat Paket Wisuda
          </a>
          <a
            href="#wedding"
            id="cta-wedding-hero"
            className="btn-outline"
          >
            💍 Lihat Wedding & Prewedding
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="animate-on-enter opacity-0-init" style={{
          marginTop: '4rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
          }}>Scroll</span>
          <div style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, rgba(201,169,75,0.6), transparent)',
            animation: 'float 2s ease-in-out infinite',
          }} />
        </div>
      </div>
    </section>
  );
}
