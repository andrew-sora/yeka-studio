'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const WEDDING_PHOTOS = [
  { src: '/images/wedding-1.jpg', alt: 'Foto wedding adat Jawa studio Jogja', title: 'Studio Adat Jawa', tag: 'Signature Setup' },
  { src: '/images/wedding-2.jpg', alt: 'Prewedding kebaya merah maroon', title: 'Classic Beskap & Kebaya', tag: 'Indoor Studio' },
  { src: '/images/wedding-3.jpg', alt: 'Foto engagement outdoor garden', title: 'Intimate Outdoor', tag: 'Garden Prewedding' },
  { src: '/images/wedding-4.jpg', alt: 'Portrait pengantin kebaya putih gold', title: 'Kebaya Modern', tag: 'Editorial Look' },
];

export default function WeddingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-wedding').forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1';
                (el as HTMLElement).style.transform = 'translateY(0)';
              }, i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.firstElementChild ? (container.firstElementChild as HTMLElement).offsetWidth + 16 : 280;
    const newIndex = Math.round(scrollPosition / cardWidth);
    setActiveIndex(Math.min(Math.max(newIndex, 0), WEDDING_PHOTOS.length - 1));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const card = container.children[index] as HTMLElement;
    if (card) {
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="wedding"
      ref={sectionRef}
      style={{
        background: '#1a0508',
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(ellipse at 80% 50%, rgba(123,28,42,0.4) 0%, transparent 60%),
          radial-gradient(ellipse at 10% 80%, rgba(201,169,75,0.06) 0%, transparent 40%)
        `,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
        {/* Section Header */}
        <div
          className="reveal-wedding"
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          <div style={{
            display: 'inline-block',
            border: '1px solid rgba(201,169,75,0.3)',
            color: '#C9A94B',
            padding: '0.3rem 1rem',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}>
            Wedding &amp; Prewedding
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 600,
            color: 'white',
            lineHeight: 1.2,
            marginBottom: '0.5rem',
          }}>
            Keindahan Momen<br />
            <span style={{ color: '#C9A94B', fontStyle: 'italic' }}>Yang Tak Terlupakan</span>
          </h2>
          <div style={{
            width: '60px',
            height: '2px',
            background: 'linear-gradient(90deg, var(--maroon), #C9A94B)',
            margin: '0 auto 1rem',
          }} />
          <p style={{
            fontSize: '0.92rem',
            color: 'rgba(255,255,255,0.65)',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: 1.65,
            fontFamily: 'Inter, sans-serif',
          }}>
            Dari pernikahan adat Jawa yang sakral hingga prewedding modern yang intim.
            Setiap frame dirancang untuk menceritakan kisah cinta Anda.
          </p>
        </div>

        {/* ── Interactive Swiper / Carousel Gallery ── */}
        <div className="reveal-wedding" style={{ marginBottom: '2.5rem', position: 'relative' }}>

          {/* Swipe Hint & Navigation Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '0 0.5rem',
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: '#C9A94B',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A94B' }} />
              Geser Galeri Portofolio &rarr;
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => scroll('left')}
                aria-label="Previous slide"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(201,169,75,0.3)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#C9A94B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  backdropFilter: 'blur(6px)',
                  transition: 'all 0.2s ease',
                }}
              >
                &#8249;
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Next slide"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(201,169,75,0.5)',
                  background: '#C9A94B',
                  color: '#1a0508',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  boxShadow: '0 2px 10px rgba(201,169,75,0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                &#8250;
              </button>
            </div>
          </div>

          {/* Scroll Track Container */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            style={{
              display: 'flex',
              gap: '1rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              paddingBottom: '1rem',
              paddingTop: '0.25rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="no-scrollbar"
          >
            {WEDDING_PHOTOS.map((photo, i) => (
              <div
                key={i}
                className="img-zoom"
                style={{
                  flex: '0 0 clamp(230px, 32vw, 280px)',
                  scrollSnapAlign: 'start',
                  aspectRatio: '3/4',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(201,169,75,0.2)',
                  background: '#120305',
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 70vw, 30vw"
                />

                {/* Glassmorphism Bottom Info Card */}
                <div style={{
                  position: 'absolute',
                  bottom: '0.75rem',
                  left: '0.75rem',
                  right: '0.75rem',
                  background: 'rgba(26, 5, 8, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(201, 169, 75, 0.3)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.85rem',
                }}>
                  <div style={{
                    fontSize: '0.62rem',
                    color: '#C9A94B',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                  }}>
                    {photo.tag}
                  </div>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'white',
                    lineHeight: 1.2,
                    marginTop: '1px',
                  }}>
                    {photo.title}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Navigation Tracker */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.4rem',
            marginTop: '0.75rem',
          }}>
            {WEDDING_PHOTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: activeIndex === i ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '100px',
                  background: activeIndex === i ? '#C9A94B' : 'rgba(201,169,75,0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Theme & Price List Cards */}
        <div className="reveal-wedding" style={{ marginBottom: '3rem' }}>
          <div style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#C9A94B',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}>
            Pilihan Paket Wedding &amp; Prewedding Transparan
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}>
            {[
              { title: 'Prewedding Studio Adat Jawa', price: 'Rp 1.850.000', desc: 'Studio tirai merah, busana &amp; makeup adat Jawa lengkap' },
              { title: 'Prewedding Outdoor Scenic', price: 'Rp 2.250.000', desc: 'Lokasi outdoor Jogja/Solo + dokumentasi video reel' },
              { title: 'Intimate Wedding Coverage', price: 'Rp 4.500.000', desc: 'Full-day coverage akad &amp; resepsi + album cetak eksklusif' },
            ].map((pkg, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(8px)',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(201,169,75,0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: 'white',
                    marginBottom: '0.3rem',
                  }}>
                    {pkg.title}
                  </h3>
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#C9A94B',
                    marginBottom: '0.6rem',
                  }}>
                    {pkg.price}
                  </div>
                  <p style={{
                    fontSize: '0.78rem',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                  }} dangerouslySetInnerHTML={{ __html: pkg.desc }} />
                </div>
                <a
                  href={`#jadwal?paket=${encodeURIComponent(pkg.title)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('jadwal');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    window.dispatchEvent(new CustomEvent('selectPackage', { detail: pkg.title }));
                  }}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: '#C9A94B',
                    color: '#1a0508',
                    padding: '0.6rem 1rem',
                    borderRadius: '4px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                >
                  Pilih Paket ini
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Feature tags */}
        <div
          className="reveal-wedding"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'center',
            marginBottom: '2.5rem',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          {['Studio Indoor Eksklusif', 'Konsep Adat Jawa & Modern', 'Wedding, Engagement, Prewedding', 'Editorial Luxury Look'].map((tag, i) => (
            <span key={i} style={{
              border: '1px solid rgba(201,169,75,0.3)',
              color: 'rgba(255,255,255,0.8)',
              padding: '0.4rem 1rem',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div
          className="reveal-wedding"
          style={{
            textAlign: 'center',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          <a
            href="#jadwal"
            id="cta-wedding-jadwal"
            style={{
              background: 'linear-gradient(135deg, var(--maroon) 0%, #A52A3A 100%)',
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: '2px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              border: '2px solid rgba(201,169,75,0.2)',
            }}
          >
            Booking Wedding / Prewedding
          </a>
        </div>
      </div>
    </section>
  );
}
