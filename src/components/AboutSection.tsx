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
        padding: 'clamp(2.5rem, 5vw, 4rem) 1.25rem',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(1.5rem, 4vw, 3rem)',
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
              gap: '8px',
              position: 'relative',
            }}>
              {/* Main Photo 1 */}
              <div style={{
                position: 'relative',
                aspectRatio: '1/1',
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
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
                aspectRatio: '1/1',
                borderRadius: '6px',
                overflow: 'hidden',
                marginTop: '1rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
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
                marginBottom: '1.25rem',
              }}>
                Dua Perempuan,<br />
                <span style={{ color: 'var(--maroon)', fontStyle: 'italic' }}>Satu Visi Estetika</span>
              </h2>
            </div>

            <p
              className="reveal-about"
              style={{
                fontSize: 'clamp(0.92rem, 1.3vw, 1.02rem)',
                color: 'var(--charcoal)',
                lineHeight: 1.7,
                fontFamily: 'Inter, sans-serif',
                marginBottom: '1rem',
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'all 0.7s ease',
              }}
            >
              Yeka Creative Studio didirikan dan dikelola oleh <strong>dua fotografer perempuan</strong> berbasis di Yogyakarta &amp; Solo. Kami percaya bahwa hasil foto yang magis lahir dari rasa nyaman klien di depan kamera.
            </p>

            <p
              className="reveal-about"
              style={{
                fontSize: 'clamp(0.88rem, 1.2vw, 0.96rem)',
                color: 'var(--muted)',
                lineHeight: 1.65,
                fontFamily: 'Inter, sans-serif',
                marginBottom: '1.75rem',
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'all 0.7s ease',
              }}
            >
              Dengan pendekatan yang sabar, hangat, dan komunikatif, sesi photoshoot berlangsung mengalir tanpa rasa canggung &mdash; baik saat perayaan kelulusan kampus bersama sahabat maupun momen sakral pernikahan adat.
            </p>

            {/* Core Working Values & Customer Benefits */}
            <div
              className="reveal-about"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '1rem',
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'all 0.7s ease',
              }}
            >
              {[
                { title: 'Bebas Canggung', desc: 'Arahan pose natural & nyaman untuk mahasiswi & calon pengantin' },
                { title: 'Estetika Editorial', desc: 'Tone warna hangat & framing elegan khas film vintage' },
                { title: 'File Cepat H+1', desc: 'Seluruh file mentah langsung terkirim via Google Drive dalam 24 jam' },
              ].map((val, i) => (
                <div key={i} style={{
                  padding: '1.25rem 1rem',
                  background: 'white',
                  borderRadius: '10px',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                  border: '1px solid rgba(123,28,42,0.1)',
                }}>
                  <div style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: 'var(--maroon)',
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '0.35rem',
                  }}>
                    {val.title}
                  </div>
                  <div style={{
                    fontSize: '0.78rem',
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

