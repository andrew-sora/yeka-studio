'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-contact').forEach((el, i) => {
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
      id="contact"
      ref={sectionRef}
      style={{
        background: 'linear-gradient(135deg, #120305 0%, #29080F 50%, #4C101B 100%)',
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,169,75,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(1.5rem, 4vw, 3.5rem)',
          alignItems: 'center',
        }}>

          {/* Left Column: Studio Photo Showcase Card */}
          <div className="reveal-contact" style={{
            position: 'relative',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}>
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              border: '1px solid rgba(201,169,75,0.3)',
              aspectRatio: '4/3',
            }}>
              <Image
                src="/images/wedding-3.jpg"
                alt="Yeka Studio Shoot Session"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(18,3,5,0.85) 0%, transparent 60%)',
              }} />

              {/* Floating Badge */}
              <div style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '1.25rem',
                right: '1.25rem',
                background: 'rgba(26, 5, 8, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '0.85rem 1.25rem',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#C9A94B', fontFamily: 'Inter, sans-serif', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Area Layanan Utama
                  </div>
                  <div style={{ color: 'white', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 500 }}>
                    Jogja &amp; Solo (Studio &amp; Outdoor)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: CTA & WhatsApp Box */}
          <div style={{ textAlign: 'left' }}>

            <div
              className="reveal-contact"
              style={{
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'all 0.7s ease',
              }}
            >
              <div style={{
                display: 'inline-block',
                border: '1px solid rgba(201,169,75,0.4)',
                color: '#C9A94B',
                padding: '0.3rem 1rem',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                marginBottom: '1rem',
                borderRadius: '2px',
              }}>
                Konsultasi &amp; Booking
              </div>
              <h2 className="font-display" style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
                fontWeight: 600,
                color: 'white',
                lineHeight: 1.15,
                marginBottom: '0.75rem',
              }}>
                Siap Abadikan<br />
                <span style={{ color: '#C9A94B', fontStyle: 'italic' }}>Momen Spesialmu?</span>
              </h2>
              <div style={{
                width: '60px',
                height: '2px',
                background: 'linear-gradient(90deg, var(--maroon), #C9A94B)',
                marginBottom: '1.5rem',
              }} />
              <p style={{
                fontSize: '0.98rem',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.75,
                fontFamily: 'Inter, sans-serif',
                marginBottom: '2rem',
              }}>
                Hubungi tim kami untuk tanya pricelist lengkap, cek jadwal foto, atau diskusi konsep sesi wisuda &amp; wedding-mu. Fast response via WhatsApp!
              </p>
            </div>

            {/* Response Time Badge */}
            <div
              className="reveal-contact"
              style={{
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'all 0.7s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                background: 'rgba(255,255,255,0.06)',
                padding: '0.5rem 1rem',
                borderRadius: '100px',
                width: 'fit-content',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#25D366' }} />
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter, sans-serif' }}>
                Respons Cepat via WA (&lt; 5 Menit)
              </span>
            </div>

            {/* Primary WA Button */}
            <div
              className="reveal-contact"
              style={{
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'all 0.7s ease',
                marginBottom: '2rem',
              }}
            >
              <a
                href="https://wa.me/6285952879644?text=Halo%20Yeka%20Studio!%20Saya%20ingin%20konsultasi%20foto%20%F0%9F%93%B8"
                id="cta-contact-wa"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: '#25D366',
                  color: 'white',
                  padding: '1.1rem 2.2rem',
                  borderRadius: '6px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 32px rgba(37, 211, 102, 0.35)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(37, 211, 102, 0.45)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(37, 211, 102, 0.35)';
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Konsultasi via WhatsApp (0859-5287-9644)
              </a>
            </div>

            {/* Social Channels */}
            <div
              className="reveal-contact"
              style={{
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'all 0.7s ease',
                display: 'flex',
                gap: '1.25rem',
                flexWrap: 'wrap',
              }}
            >
              <a
                href="https://www.instagram.com/yekastudio.graduation"
                id="link-ig-wisuda"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                @yekastudio.graduation
              </a>
              <a
                href="https://www.instagram.com/yeka.studio"
                id="link-ig-wedding"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                @yeka.studio
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

