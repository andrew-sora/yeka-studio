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
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 'clamp(2.5rem, 5vw, 4.5rem)',
          alignItems: 'start',
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
              gap: '14px',
              position: 'relative',
            }}>
              {/* Main Photo 1: Wisuda Candid */}
              <div style={{
                position: 'relative',
                aspectRatio: '3/4',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 10px 28px rgba(0,0,0,0.1)',
              }}>
                <Image
                  src="/images/wisuda-5.jpg"
                  alt="Yeka Studio photography session candid wisuda"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              </div>

              {/* Main Photo 2: Wedding Elegance */}
              <div style={{
                position: 'relative',
                aspectRatio: '3/4',
                borderRadius: '10px',
                overflow: 'hidden',
                marginTop: '2.5rem',
                boxShadow: '0 10px 28px rgba(0,0,0,0.1)',
              }}>
                <Image
                  src="/images/wedding-4.jpg"
                  alt="Female photographer team Yeka Studio wedding bride"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              </div>

              {/* Floating Pill Badge */}
              <div style={{
                position: 'absolute',
                bottom: '-1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'white',
                padding: '0.6rem 1.25rem',
                borderRadius: '100px',
                boxShadow: '0 8px 24px rgba(123,28,42,0.12)',
                border: '1px solid rgba(123,28,42,0.12)',
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
                  letterSpacing: '0.02em',
                }}>
                  Female Photographers • Jogja &amp; Solo
                </span>
              </div>
            </div>

            {/* Editorial Studio Quote underneath photos */}
            <div style={{
              marginTop: '2.5rem',
              padding: '1.25rem 1.5rem',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '10px',
              border: '1px solid rgba(123,28,42,0.08)',
              textAlign: 'center',
            }}>
              <p className="font-display" style={{
                fontSize: '1.05rem',
                fontStyle: 'italic',
                color: 'var(--charcoal)',
                lineHeight: 1.5,
                margin: 0,
              }}>
                &ldquo;Setiap momen berharga layak diabadikan dengan kelembutan, rasa nyaman, dan estetika yang abadi.&rdquo;
              </p>
              <div style={{
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--maroon)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                marginTop: '0.5rem',
              }}>
                Yeka Creative Studio
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
              Dengan pendekatan yang sabar, hangat, dan komunikatif, sesi photoshoot berlangsung mengalir tanpa rasa canggung, baik saat perayaan kelulusan kampus bersama sahabat maupun momen sakral pernikahan adat.
            </p>

            {/* Core Working Values: Clean Editorial Numbered List */}
            <div
              className="reveal-about"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.15rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(123,28,42,0.12)',
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'all 0.7s ease',
              }}
            >
              {[
                {
                  num: '01',
                  title: 'Bebas Canggung',
                  desc: 'Arahan pose natural & hangat untuk mahasiswi & calon pengantin agar tenang dan percaya diri.',
                },
                {
                  num: '02',
                  title: 'Estetika Editorial',
                  desc: 'Tone warna hangat dengan komposisi framing khas majalah fotografi dan film vintage yang abadi.',
                },
                {
                  num: '03',
                  title: 'File Cepat H+1',
                  desc: 'Seluruh file mentah langsung terkirim via Google Drive pribadi dalam 24 jam setelah sesi selesai.',
                },
                {
                  num: '04',
                  title: 'Konsultasi Konsep',
                  desc: 'Diskusi moodboard, referensi outfit & jadwal sesi yang dipersiapkan matang sebelum hari H.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}
                >
                  <span
                    className="font-display"
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      color: 'var(--maroon)',
                      lineHeight: 1,
                      minWidth: '28px',
                      fontStyle: 'italic',
                    }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--charcoal)',
                        fontFamily: 'Inter, sans-serif',
                        marginBottom: '0.2rem',
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--muted)',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: 1.5,
                      }}
                    >
                      {item.desc}
                    </div>
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

