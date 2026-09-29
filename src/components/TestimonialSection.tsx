'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Dhea & Bestie',
    role: 'Wisuda UGM Balairung',
    avatar: '/images/wisuda-1.jpg',
    rating: 5,
    tag: 'Wisuda Campus',
    date: 'Kemarin, 14.20',
    chat: 'Kak Yeka makasiii bgt buat hasil fotonya 😭❤️ Bagus bgt natural, tone warnanya sukaaa! Tim fotografer mbak-mbaknya ramah bgt, temen-temenku pada tanyain fotografernya siapa!',
    highlight: 'Hasil natural & tim cewek ramah bgt!',
  },
  {
    id: 2,
    name: 'Anisa & Fajar',
    role: 'Prewedding Adat Jawa & Studio',
    avatar: '/images/wedding-1.jpg',
    rating: 5,
    tag: 'Prewedding & Studio',
    date: '2 hari lalu, 18.05',
    chat: 'Mbak Yeka, fotonya udah masuk drive! Suka bgt hasilnya tone warnanya estetik & luxury sesuai ekspektasi kita. Makasih udah sabar bgt ngarahin gaya ya mbak 🥰🙏',
    highlight: 'Tone estetik & sabar ngarahin gaya!',
  },
  {
    id: 3,
    name: 'Rania A.',
    role: 'Wisuda UNS Solo',
    avatar: '/images/wisuda-3.jpg',
    rating: 5,
    tag: 'Wisuda Outdoor',
    date: 'Minggu lalu, 11.45',
    chat: 'Pengiriman filenya cepet bgt padahal baru kemarin lusa foto! Recommended bgt tim fotografer ceweknya bikin rileks & gak canggung selama sesi outdoor ✨',
    highlight: 'File cepet & gak canggung!',
  },
  {
    id: 4,
    name: 'Tania & Partner',
    role: 'Engagement & Prewedding',
    avatar: '/images/wedding-3.jpg',
    rating: 5,
    tag: 'Wedding Session',
    date: '3 hari lalu, 20.10',
    chat: 'Hasil cetaknya rapi bgt & angle fotonya pas bikin keliatan tinggi. Makasih banyak Yeka Studio, next time kalau wisuda magister pasti foto di Yeka lagi ❤️',
    highlight: 'Angle pas & langganan lagi!',
  },
];

export default function TestimonialSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-testi').forEach((el, i) => {
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
    const cardWidth = container.firstElementChild ? (container.firstElementChild as HTMLElement).offsetWidth + 16 : 300;
    const newIndex = Math.round(scrollPosition / cardWidth);
    setActiveIndex(Math.min(Math.max(newIndex, 0), TESTIMONIALS.length - 1));
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
      id="testimoni"
      ref={sectionRef}
      style={{
        background: 'var(--cream)',
        padding: 'clamp(2.5rem, 5vw, 4.5rem) 1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* Section Header */}
        <div
          className="reveal-testi"
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
            Cerita Klien Kami
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 600,
            color: 'var(--charcoal)',
            lineHeight: 1.2,
            marginBottom: '0.5rem',
          }}>
            KATA MEREKA TENTANG YEKA
          </h2>
          <div className="section-divider" />
          <p style={{
            fontSize: '0.92rem',
            color: 'var(--muted)',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.65,
            fontFamily: 'Inter, sans-serif',
          }}>
            Tangkapan layar nyata apresiasi dari para wisudawati &amp; pasangan pengantin di Jogja &amp; Solo.
          </p>
        </div>

        {/* Carousel / Cards Track */}
        <div
          className="reveal-testi"
          style={{
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
            position: 'relative',
          }}
        >
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '1.25rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              padding: '0.5rem 0.25rem 1.25rem',
            }}
          >
            {TESTIMONIALS.map((item, i) => (
              <div
                key={i}
                style={{
                  flex: '0 0 auto',
                  width: 'clamp(280px, 85vw, 340px)',
                  scrollSnapAlign: 'start',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(123,28,42,0.08)',
                  border: '1px solid rgba(123,28,42,0.1)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* WA Chat Card Header */}
                <div style={{
                  background: '#075E54',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: 'white',
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1.5px solid #25D366',
                    flexShrink: 0,
                  }}>
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="80px"
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.name}
                    </div>
                    <div style={{
                      fontSize: '0.68rem',
                      color: 'rgba(255,255,255,0.78)',
                      fontFamily: 'Inter, sans-serif',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.role}
                    </div>
                  </div>
                  <div style={{
                    background: '#25D366',
                    color: '#075E54',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '100px',
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Verified
                  </div>
                </div>

                {/* WA Chat Body */}
                <div style={{
                  padding: '1.25rem 1rem',
                  background: '#ECE5DD',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  {/* Rating Stars */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    marginBottom: '0.75rem',
                  }}>
                    <div style={{ color: '#F59E0B', fontSize: '0.85rem' }}>★★★★★</div>
                    <span style={{
                      fontSize: '0.68rem',
                      background: 'rgba(123,28,42,0.1)',
                      color: 'var(--maroon)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '100px',
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {item.tag}
                    </span>
                  </div>

                  {/* Chat Bubble Component */}
                  <div style={{
                    background: '#DCF8C6',
                    borderRadius: '8px 8px 0px 8px',
                    padding: '0.85rem 0.95rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    position: 'relative',
                    marginBottom: '0.75rem',
                  }}>
                    <p style={{
                      fontSize: '0.82rem',
                      color: '#2C2828',
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: 1.55,
                      margin: 0,
                    }}>
                      &ldquo;{item.chat}&rdquo;
                    </p>
                    <div style={{
                      textAlign: 'right',
                      fontSize: '0.6rem',
                      color: 'rgba(0,0,0,0.45)',
                      marginTop: '0.35rem',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {item.date} ✓✓
                    </div>
                  </div>

                  {/* Highlight pill */}
                  <div style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'var(--maroon)',
                    background: 'white',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(123,28,42,0.15)',
                    textAlign: 'center',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    ✦ {item.highlight}
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.4rem',
            marginTop: '0.5rem',
          }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
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
      </div>
    </section>
  );
}
