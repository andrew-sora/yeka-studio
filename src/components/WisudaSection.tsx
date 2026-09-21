'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const WISUDA_PHOTOS = [
  { src: '/images/wisuda-1.jpg', alt: 'Foto wisuda outdoor campus Jogja', title: 'Outdoor Campus Shoot', tag: 'Area Jogja & Solo' },
  { src: '/images/wisuda-2.jpg', alt: 'Wisuda UGM candid joyful', title: 'Candid & Natural', tag: 'UGM Balairung' },
  { src: '/images/wisuda-3.jpg', alt: 'Wisuda melempar toga celebration', title: 'Celebration Moment', tag: 'Kampus Outdoor' },
  { src: '/images/wisuda-4.jpg', alt: 'Portrait wisuda elegan', title: 'Portrait Elegan', tag: 'Spot Classical' },
  { src: '/images/wisuda-5.jpg', alt: 'Foto wisuda bersama sahabat', title: 'Sahabat & Bestie', tag: 'Group Shoot' },
  { src: '/images/wisuda-6.jpg', alt: 'Wisuda outdoor botanical garden', title: 'Botanical Session', tag: 'Garden Aesthetic' },
];

export default function WisudaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-item').forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1';
                (el as HTMLElement).style.transform = 'translateY(0)';
              }, i * 100);
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
    setActiveIndex(Math.min(Math.max(newIndex, 0), WISUDA_PHOTOS.length - 1));
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
      id="wisuda"
      ref={sectionRef}
      style={{
        background: 'var(--cream)',
        padding: 'clamp(2.5rem, 5vw, 4rem) 1.25rem',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Section Header */}
        <div
          className="reveal-item"
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
            background: 'rgba(123,28,42,0.08)',
            color: 'var(--maroon)',
            padding: '0.3rem 1rem',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            marginBottom: '0.75rem',
            borderRadius: '2px',
          }}>
            Paket Wisuda
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 600,
            color: 'var(--charcoal)',
            lineHeight: 1.2,
            marginBottom: '0.5rem',
          }}>
            Abadikan Momen Kelulusanmu
          </h2>
          <div className="section-divider" />
          <p style={{
            fontSize: '0.92rem',
            color: 'var(--muted)',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: 1.65,
            fontFamily: 'Inter, sans-serif',
          }}>
            Sesi foto outdoor candid dan berkesan di area kampus Jogja &amp; Solo.
            Hasil foto natural, sinematik, dan penuh kenangan bersama orang tersayang.
          </p>
        </div>

        {/* ── Interactive Carousel / Swiper Gallery ── */}
        <div className="reveal-item" style={{ marginBottom: '2.5rem', position: 'relative' }}>

          {/* Swipe Hint Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '0 0.5rem',
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--maroon)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--maroon)' }} />
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
                  border: '1px solid rgba(123,28,42,0.2)',
                  background: 'white',
                  color: 'var(--maroon)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
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
                  border: '1px solid rgba(123,28,42,0.2)',
                  background: 'var(--maroon)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  boxShadow: '0 2px 8px rgba(123,28,42,0.25)',
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
            {WISUDA_PHOTOS.map((photo, i) => (
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
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(123,28,42,0.08)',
                  background: '#2A080E',
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
                  background: 'rgba(18, 3, 5, 0.75)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
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
            {WISUDA_PHOTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: activeIndex === i ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '100px',
                  background: activeIndex === i ? 'var(--maroon)' : 'rgba(123,28,42,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Theme & Price List Cards */}
        <div className="reveal-item" style={{ marginBottom: '3rem' }}>
          <div style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--maroon)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}>
            Pilihan Paket Wisuda &amp; Pricelist Transparan
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1rem',
          }}>
            {[
              { id: 'wisuda-outdoor', title: 'Wisuda Outdoor', price: 'Rp 450.000', desc: 'Sesi candid outdoor area kampus Jogja/Solo' },
              { id: 'wisuda-indoor', title: 'Wisuda Indoor', price: 'Rp 550.000', desc: 'Sesi indoor spot, hall kampus &amp; cafe' },
              { id: 'wisuda-studio', title: 'Wisuda Studio', price: 'Rp 650.000', desc: 'Studio setup lighting eksklusif Yeka' },
              { id: 'wisuda-all', title: 'Wisuda All-In', price: 'Rp 950.000', desc: 'Kombinasi Studio + Outdoor Campus Shoot' },
            ].map((pkg, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                border: '1px solid rgba(123,28,42,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: 'var(--charcoal)',
                    marginBottom: '0.3rem',
                  }}>
                    {pkg.title}
                  </h3>
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--maroon)',
                    marginBottom: '0.6rem',
                  }}>
                    {pkg.price}
                  </div>
                  <p style={{
                    fontSize: '0.78rem',
                    color: 'var(--muted)',
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
                    background: 'var(--maroon)',
                    color: 'white',
                    padding: '0.6rem 1rem',
                    borderRadius: '4px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: 500,
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

        {/* Feature Pills */}
        <div
          className="reveal-item"
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
          {['Outdoor Campus Shoot', 'Gaya Candid & Natural', 'Area Kampus Jogja & Solo', 'Hasil Film-Look Editorial'].map((tag, i) => (
            <span key={i} style={{
              border: '1px solid rgba(123,28,42,0.25)',
              color: 'var(--maroon)',
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
          className="reveal-item"
          style={{
            textAlign: 'center',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          <a
            href="#jadwal"
            id="cta-wisuda-jadwal"
            className="btn-primary"
            style={{ fontSize: '0.875rem', padding: '1rem 2.5rem' }}
          >
            Booking Sesi Wisuda
          </a>
          <p style={{
            marginTop: '0.75rem',
            fontSize: '0.75rem',
            color: 'var(--muted)',
            fontFamily: 'Inter, sans-serif',
          }}>
            Pilih tanggal &amp; jam — langsung terhubung ke WhatsApp kami
          </p>
        </div>
      </div>
    </section>
  );
}
