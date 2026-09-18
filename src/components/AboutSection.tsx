'use client';
import { useEffect, useRef } from 'react';

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
              }, i * 150);
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
      <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        {/* Decorative element */}
        <div
          className="reveal-about"
          style={{
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
            marginBottom: '2rem',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="3" fill="none" stroke="#7B1C2A" strokeWidth="1.5"/>
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <ellipse
                key={i}
                cx={20 + 9 * Math.cos((angle * Math.PI) / 180)}
                cy={20 + 9 * Math.sin((angle * Math.PI) / 180)}
                rx="3.5"
                ry="6"
                fill="none"
                stroke="rgba(123,28,42,0.35)"
                strokeWidth="1"
                transform={`rotate(${angle} ${20 + 9 * Math.cos((angle * Math.PI) / 180)} ${20 + 9 * Math.sin((angle * Math.PI) / 180)})`}
              />
            ))}
          </svg>
        </div>

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
            marginBottom: '1.25rem',
            borderRadius: '2px',
          }}>
            Tentang Kami
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
            fontWeight: 600,
            color: 'var(--charcoal)',
            lineHeight: 1.25,
            marginBottom: '0.75rem',
          }}>
            Dua Perempuan,<br />
            <span style={{ color: 'var(--maroon)', fontStyle: 'italic' }}>Satu Visi</span>
          </h2>
          <div className="section-divider" />
        </div>

        <p
          className="reveal-about"
          style={{
            fontSize: '1.05rem',
            color: 'var(--muted)',
            lineHeight: 1.9,
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
            fontSize: '1.05rem',
            color: 'var(--muted)',
            lineHeight: 1.9,
            fontFamily: 'Inter, sans-serif',
            marginBottom: '2.5rem',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          Dari momen wisuda yang candid dan penuh tawa, hingga pernikahan adat yang elegan —
          kami ada untuk menangkap setiap detail yang layak dikenang seumur hidup.
        </p>

        {/* Values */}
        <div
          className="reveal-about"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          {[
            { icon: '🤍', title: 'Natural & Authentic', desc: 'Foto yang terasa nyata, bukan sekedar pose' },
            { icon: '✨', title: 'Detail-Oriented', desc: 'Setiap frame dikomposisi dengan cermat' },
            { icon: '💬', title: 'Komunikatif', desc: 'Konsultasi gratis, fast reply via WA' },
          ].map((val, i) => (
            <div key={i} style={{
              padding: '1.5rem 1rem',
              background: 'white',
              borderRadius: '4px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
              border: '1px solid rgba(123,28,42,0.06)',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{val.icon}</div>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--charcoal)',
                fontFamily: 'Inter, sans-serif',
                marginBottom: '0.35rem',
              }}>
                {val.title}
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--muted)',
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.6,
              }}>
                {val.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
