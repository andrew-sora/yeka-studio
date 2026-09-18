'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-about').forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1';
                (el as HTMLElement).style.transform = 'translateY(0)';
              }, i * 120);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        background: 'var(--cream-dark)',
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(2rem, 5vw, 4rem)',
          alignItems: 'center',
        }}>

          {/* Left Column: Visual Photo Composition */}
          <div className="reveal-about" style={{
            position: 'relative',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              position: 'relative',
            }}>
              {/* Main Photo 1 */}
              <div style={{
                position: 'relative',
                aspectRatio: '3/4',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              }}>
                <Image
                  src="/images/wisuda-5.jpg"
                  alt="Yeka Studio photography session candid"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              {/* Main Photo 2 */}
              <div style={{
                position: 'relative',
                aspectRatio: '3/4',
                borderRadius: '8px',
                overflow: 'hidden',
                marginTop: '2rem',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              }}>
                <Image
                  src="/images/wedding-4.jpg"
                  alt="Female photographer team Yeka Studio"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              {/* Floating Badge */}
              <div style={{
                position: 'absolute',
                bottom: '-1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'white',
                padding: '0.6rem 1.25rem',
                borderRadius: '100px',
                boxShadow: '0 8px 24px rgba(123,28,42,0.15)',
                border: '1px solid rgba(123,28,42,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                zIndex: 2,
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--maroon)',
                }} />
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--maroon)',
                }}>
                  Female Photographers
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div style={{ textAlign: 'left' }}>
            <div
              className="reveal-about"
              style={{
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
                marginBottom: '1rem',
                borderRadius: '2px',
              }}>
                Tentang Kami
              </div>
              <h2 className="font-display" style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 600,
                color: 'var(--charcoal)',
                lineHeight: 1.2,
                marginBottom: '0.75rem',
              }}>
                Dua Perempuan,<br />
                <span style={{ color: 'var(--maroon)', fontStyle: 'italic' }}>Satu Visi Estetika</span>
              </h2>
              <div className="section-divider" style={{ margin: '0 0 1.5rem 0' }} />
            </div>

            <p
              className="reveal-about"
              style={{
                fontSize: '1rem',
                color: 'var(--muted)',
                lineHeight: 1.85,
                fontFamily: 'Inter, sans-serif',
                marginBottom: '1.25rem',
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'all 0.7s ease',
              }}
            >
              Yeka Creative Studio dikelola oleh dua fotografer perempuan yang berbasis di Yogyakarta &amp; Solo.
              Kami percaya bahwa foto terbaik lahir dari rasa nyaman — dan kami hadir sebagai
              <em> female photographer</em> yang memahami momen personal Anda dari perspektif yang sama.
            </p>

            <p
              className="reveal-about"
              style={{
                fontSize: '1rem',
                color: 'var(--muted)',
                lineHeight: 1.85,
                fontFamily: 'Inter, sans-serif',
                marginBottom: '2rem',
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'all 0.7s ease',
              }}
            >
              Dari momen wisuda candid penuh kehangatan hingga pernikahan adat yang penuh elegansi —
              kami ada untuk menangkap setiap ekspresi autentik Anda.
            </p>

            {/* Values */}
            <div
              className="reveal-about"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem',
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'all 0.7s ease',
              }}
            >
              {[
                { title: 'Natural & Authentic', desc: 'Foto yang terasa hangat & nyata' },
                { title: 'Detail-Oriented', desc: 'Framing & penataan pose cermat' },
                { title: 'Fast & Friendly', desc: 'Konsultasi gratis via WA' },
              ].map((val, i) => (
                <div key={i} style={{
                  padding: '1.25rem 1rem',
                  background: 'white',
                  borderRadius: '6px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(123,28,42,0.06)',
                }}>
                  <div style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--charcoal)',
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '0.25rem',
                  }}>
                    {val.title}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.5,
                  }}>
                    {val.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

