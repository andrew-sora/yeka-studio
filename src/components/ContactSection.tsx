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
        background: 'linear-gradient(135deg, #0F0305 0%, #1F060B 50%, #380B14 100%)',
        padding: 'clamp(2.5rem, 5vw, 4rem) 1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Background Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(201,169,75,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* Glassmorphism Container Card */}
        <div style={{
          background: 'rgba(24, 6, 10, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(201,169,75,0.22)',
          borderRadius: '20px',
          padding: 'clamp(1.5rem, 3.5vw, 2.75rem)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(1.5rem, 4vw, 3rem)',
            alignItems: 'center',
          }}>

            {/* Left Column: Studio Photo Card */}
            <div className="reveal-contact" style={{
              position: 'relative',
              opacity: 0,
              transform: 'translateY(24px)',
              transition: 'all 0.7s ease',
            }}>
              <div style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
                border: '1px solid rgba(201,169,75,0.25)',
                aspectRatio: '4/3',
                maxHeight: '320px',
              }}>
                <Image
                  src="/images/wedding-3.jpg"
                  alt="Yeka Studio Shoot Session"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15,3,5,0.85) 0%, transparent 60%)',
                }} />

                {/* Service Area Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '0.85rem',
                  left: '0.85rem',
                  right: '0.85rem',
                  background: 'rgba(15, 3, 5, 0.75)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(201,169,75,0.25)',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A94B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: '#C9A94B', fontFamily: 'Inter, sans-serif', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Area Layanan Utama
                    </div>
                    <div style={{ color: 'white', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 500 }}>
                      Jogja &amp; Solo (Studio &amp; Outdoor)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Clean CTA & Content */}
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              <div
                className="reveal-contact"
                style={{
                  opacity: 0,
                  transform: 'translateY(24px)',
                  transition: 'all 0.7s ease',
                }}
              >
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#C9A94B',
                  fontSize: '0.68rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  marginBottom: '0.6rem',
                }}>
                  <span style={{ width: '16px', height: '1px', background: '#C9A94B' }} />
                  Konsultasi &amp; Booking
                </div>

                <h2 className="font-display" style={{
                  fontSize: 'clamp(1.5rem, 2.6vw, 2rem)',
                  fontWeight: 600,
                  color: 'white',
                  lineHeight: 1.25,
                  marginBottom: '0.85rem',
                  letterSpacing: '-0.01em',
                }}>
                  Cerita &amp; Momen Spesialmu<br />
                  <span style={{ color: '#C9A94B', fontStyle: 'italic', fontWeight: 400 }}>Layak Diabadikan Sempurna</span>
                </h2>

                <p style={{
                  fontSize: '0.86rem',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.6,
                  fontFamily: 'Inter, sans-serif',
                  margin: 0,
                  maxWidth: '460px',
                }}>
                  Diskusi konsep foto Anda bersama tim fotografer wanita profesional kami. Respon cepat via WA dan konsultasi gratis.
                </p>
              </div>

              {/* Minimal Specs Divider */}
              <div
                className="reveal-contact"
                style={{
                  opacity: 0,
                  transform: 'translateY(24px)',
                  transition: 'all 0.7s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: 'Inter, sans-serif',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  paddingTop: '0.85rem',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.85)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A94B" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Tim Fotografer Wanita
                </span>
                <span style={{ color: 'rgba(201,169,75,0.4)' }}>•</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Respon WA &lt; 5 Menit
                </span>
                <span style={{ color: 'rgba(201,169,75,0.4)' }}>•</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Gratis Konsultasi Konsep
                </span>
              </div>

              {/* Actions Area */}
              <div
                className="reveal-contact"
                style={{
                  opacity: 0,
                  transform: 'translateY(24px)',
                  transition: 'all 0.7s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  paddingTop: '0.3rem',
                }}
              >
                {/* Main WhatsApp CTA Button */}
                <div>
                  <a
                    href="https://wa.me/6285952879644?text=Halo%20Yeka%20Studio!%20Saya%20ingin%20konsultasi%20foto%20%F0%9F%93%B8"
                    id="cta-contact-wa"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      background: 'linear-gradient(135deg, #25D366 0%, #1DA851 100%)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 6px 20px rgba(37, 211, 102, 0.25)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 25px rgba(37, 211, 102, 0.38)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.25)';
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Konsultasi via WhatsApp
                  </a>
                </div>

                {/* Minimalist Instagram Links */}
                <div style={{
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>
                    Galeri IG:
                  </span>
                  <a
                    href="https://www.instagram.com/yekastudio.graduation"
                    id="link-ig-wisuda"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#C9A94B',
                      fontSize: '0.75rem',
                      textDecoration: 'none',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                    <span>@yekastudio.graduation</span>
                  </a>

                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>|</span>

                  <a
                    href="https://www.instagram.com/yeka.studio"
                    id="link-ig-wedding"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#C9A94B',
                      fontSize: '0.75rem',
                      textDecoration: 'none',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                    <span>@yeka.studio</span>
                  </a>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

