'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const WEDDING_PHOTOS = [
  { src: '/images/wedding-1.jpg', alt: 'Foto wedding adat Jawa studio Jogja', title: 'Studio Adat Jawa', tag: 'Signature Setup' },
  { src: '/images/wedding-2.jpg', alt: 'Prewedding kebaya merah maroon', title: 'Classic Beskap & Kebaya', tag: 'Indoor Studio' },
  { src: '/images/wedding-3.jpg', alt: 'Foto engagement outdoor garden', title: 'Intimate Outdoor', tag: 'Garden Prewedding' },
  { src: '/images/wedding-4.jpg', alt: 'Portrait pengantin kebaya putih gold', title: 'Kebaya Modern', tag: 'Editorial Look' },
];

const WEDDING_PACKAGES = [
  {
    title: 'Prewedding Studio Adat Jawa',
    price: 'Rp 1.850.000',
    desc: 'Studio tirai merah, busana &amp; makeup adat Jawa lengkap',
    featured: false,
    features: [
      'Include Busana &amp; Makeup Adat Jawa',
      'Private Studio Tirai Merah Classical',
      'ALL File Mentah (Drive H+1)',
      '25 Foto Master Retouched &amp; Edit',
      '1 Cetak Canvas Frame 40x60cm',
    ],
  },
  {
    title: 'Prewedding Outdoor Scenic',
    price: 'Rp 2.250.000',
    desc: 'Lokasi outdoor Jogja/Solo + dokumentasi video reel',
    featured: true,
    badge: 'Paling Populer',
    features: [
      '2 Lokasi Outdoor Scenic (Jogja/Solo)',
      'ALL File Mentah (Drive H+1)',
      '35 Foto Master Retouched &amp; Edit',
      'Video Cinematic Reel Full HD 60d',
      '1 Cetak Canvas Frame 40x60cm',
    ],
  },
  {
    title: 'Intimate Wedding Coverage',
    price: 'Rp 4.500.000',
    desc: 'Full-day coverage akad &amp; resepsi + album cetak eksklusif',
    featured: false,
    badge: 'Lengkap &amp; All-In',
    features: [
      'Full-Day Coverage Akad &amp; Resepsi',
      'ALL File Mentah Flashdisk Box Kayu Yeka',
      '50 Foto Master Color Graded',
      'Album Photobook Hardcover Kulit 20 Hal',
      '1 Cetak Canvas 50x70cm + Frame Premium',
      'Video Cinematic Highlight Wedding 1-3 m',
    ],
  },
];

export default function WeddingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const pkgCarouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePkgIndex, setActivePkgIndex] = useState(0);
  const [canScrollPhotos, setCanScrollPhotos] = useState(false);
  const [canScrollPkgs, setCanScrollPkgs] = useState(false);
  const [weddingPackages, setWeddingPackages] = useState(WEDDING_PACKAGES);
  const [weddingPhotos, setWeddingPhotos] = useState(WEDDING_PHOTOS);

function formatRupiah(input: string): string {
  if (!input) return '';
  const rawNumbers = input.replace(/[^0-9]/g, '');
  if (!rawNumbers) return '';
  const formattedNumber = new Intl.NumberFormat('id-ID').format(parseInt(rawNumbers, 10));
  return `Rp ${formattedNumber}`;
}

  // Load package and photo overrides from localStorage if saved by Owner via Admin
  useEffect(() => {
    try {
      const storedPkgs = localStorage.getItem('yeka_package_overrides');
      if (storedPkgs) {
        const parsed = JSON.parse(storedPkgs);
        if (Array.isArray(parsed)) {
          const overrides = parsed
            .filter((p: any) => p.category === 'wedding' || p.id?.startsWith('wedding'))
            .map((p: any) => ({
              ...p,
              price: formatRupiah(p.price),
            }));
          if (overrides.length > 0) {
            setWeddingPackages(overrides);
          }
        }
      }

      const storedPhotos = localStorage.getItem('yeka_photo_overrides');
      if (storedPhotos) {
        const parsed = JSON.parse(storedPhotos);
        if (Array.isArray(parsed)) {
          const overrides = parsed.filter((p: any) => p.category === 'wedding' || p.id?.startsWith('wedding'));
          if (overrides.length > 0) {
            setWeddingPhotos(overrides);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      if (carouselRef.current) {
        setCanScrollPhotos(carouselRef.current.scrollWidth > carouselRef.current.clientWidth + 5);
      }
      if (pkgCarouselRef.current) {
        setCanScrollPkgs(pkgCarouselRef.current.scrollWidth > pkgCarouselRef.current.clientWidth + 5);
      }
    };

    checkOverflow();
    const t1 = setTimeout(checkOverflow, 50);
    const t2 = setTimeout(checkOverflow, 250);

    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [weddingPackages, weddingPhotos]);

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
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) {
      setActiveIndex(0);
      return;
    }
    const scrollPosition = container.scrollLeft;
    if (scrollPosition >= maxScroll - 8) {
      setActiveIndex(weddingPhotos.length - 1);
    } else {
      const progress = Math.max(0, Math.min(1, scrollPosition / maxScroll));
      const newIndex = Math.round(progress * (weddingPhotos.length - 1));
      setActiveIndex(newIndex);
    }
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
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;
    const targetScroll = (maxScroll / (weddingPhotos.length - 1)) * index;
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  const handlePkgScroll = () => {
    if (!pkgCarouselRef.current) return;
    const container = pkgCarouselRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) {
      setActivePkgIndex(0);
      return;
    }
    const scrollPosition = container.scrollLeft;
    if (scrollPosition >= maxScroll - 8) {
      setActivePkgIndex(weddingPackages.length - 1);
    } else {
      const progress = Math.max(0, Math.min(1, scrollPosition / maxScroll));
      const newIndex = Math.round(progress * (weddingPackages.length - 1));
      setActivePkgIndex(newIndex);
    }
  };

  const scrollPkg = (direction: 'left' | 'right') => {
    if (!pkgCarouselRef.current) return;
    const container = pkgCarouselRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollToPkgIndex = (index: number) => {
    if (!pkgCarouselRef.current) return;
    const container = pkgCarouselRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;
    const targetScroll = (maxScroll / (weddingPackages.length - 1)) * index;
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="wedding"
      ref={sectionRef}
      style={{
        background: '#1a0508',
        padding: 'clamp(3rem, 6vw, 6rem) clamp(0.75rem, 2.5vw, 1.5rem)',
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
            marginBottom: '0.85rem',
          }}>
            Keindahan Momen<br />
            <span style={{ color: '#C9A94B', fontStyle: 'italic' }}>Yang Tak Terlupakan</span>
          </h2>
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
              Portofolio Wedding &amp; Prewedding
            </div>

            {/* Navigation Buttons with 44px touch target */}
            <div style={{ display: canScrollPhotos ? 'flex' : 'none', gap: '0.65rem' }}>
              <button
                onClick={() => scroll('left')}
                aria-label="Foto sebelumnya"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1.5px solid rgba(212,175,55,0.4)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#D4AF37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                }}
              >
                &#8249;
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Foto berikutnya"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1.5px solid #D4AF37',
                  background: '#D4AF37',
                  color: '#1a0508',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  boxShadow: '0 2px 10px rgba(212,175,55,0.35)',
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
            {weddingPhotos.map((photo, i) => (
              <div
                key={i}
                className="img-zoom"
                style={{
                  flex: '0 0 clamp(230px, 32vw, 280px)',
                  scrollSnapAlign: 'start',
                  aspectRatio: '3/4',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.55)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  background: '#120305',
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt || photo.title}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                  sizes="(max-width: 768px) 75vw, 30vw"
                />

                {/* Glassmorphism Bottom Info Card */}
                <div style={{
                  position: 'absolute',
                  bottom: '0.75rem',
                  left: '0.75rem',
                  right: '0.75rem',
                  background: 'rgba(26, 5, 8, 0.88)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                }}>
                  <div style={{
                    fontSize: '0.64rem',
                    color: '#D4AF37',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                  }}>
                    {photo.tag}
                  </div>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: '#FFFDF9',
                    lineHeight: 1.2,
                    marginTop: '2px',
                  }}>
                    {photo.title}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Navigation Tracker */}
          <div style={{
            display: canScrollPhotos ? 'flex' : 'none',
            justifyContent: 'center',
            gap: '0.4rem',
            marginTop: '0.75rem',
          }}>
            {weddingPhotos.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Lihat foto wedding ${i + 1}`}
                style={{
                  width: activeIndex === i ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '100px',
                  background: activeIndex === i ? '#D4AF37' : 'rgba(212,175,55,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Theme & Price List Cards */}
        <div className="reveal-wedding" style={{ marginBottom: '3rem', position: 'relative' }}>
          {/* Header & Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '0 0.5rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            <div style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#D4AF37',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4AF37' }} />
              Pilihan Paket Wedding &amp; Prewedding Transparan
            </div>

            {/* Mobile-only Navigation Buttons */}
            <div className="mobile-wedding-pkg-controls" style={{ display: 'none', gap: '0.5rem' }}>
              <button
                onClick={() => scrollPkg('left')}
                aria-label="Paket sebelumnya"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1.5px solid rgba(212,175,55,0.4)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#D4AF37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  transition: 'all 0.2s ease',
                }}
              >
                &#8249;
              </button>
              <button
                onClick={() => scrollPkg('right')}
                aria-label="Paket berikutnya"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1.5px solid #D4AF37',
                  background: '#D4AF37',
                  color: '#1a0508',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  boxShadow: '0 2px 8px rgba(212,175,55,0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                &#8250;
              </button>
            </div>
          </div>

          {/* Quick Mobile Package Selector Pills */}
          <div
            className="mobile-wedding-pkg-controls"
            style={{
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              paddingBottom: '0.65rem',
              marginBottom: '0.5rem',
              scrollbarWidth: 'none',
            }}
          >
            {weddingPackages.map((pkg, i) => (
              <button
                key={`pill-wed-${i}`}
                onClick={() => scrollToPkgIndex(i)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '100px',
                  fontSize: '0.74rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  border: activePkgIndex === i ? '1.5px solid #D4AF37' : '1px solid rgba(212,175,55,0.25)',
                  background: activePkgIndex === i ? '#D4AF37' : 'rgba(255,255,255,0.06)',
                  color: activePkgIndex === i ? '#1a0508' : '#F5EBE0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                {pkg.title} • {pkg.price}
              </button>
            ))}
          </div>

          {/* Responsive Grid on Desktop / Swipeable on Mobile (via globals.css) */}
          <div
            ref={pkgCarouselRef}
            onScroll={handlePkgScroll}
            className="wedding-pkg-container no-scrollbar"
          >
            {weddingPackages.map((pkg, i) => (
              <div
                key={i}
                className="wedding-pkg-card"
                style={{
                  background: pkg.featured
                    ? 'linear-gradient(145deg, rgba(123,28,42,0.55) 0%, rgba(30,8,12,0.9) 100%)'
                    : 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem 1.25rem',
                  borderRadius: '14px',
                  border: pkg.featured ? '2px solid #D4AF37' : '1px solid rgba(212,175,55,0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  boxShadow: pkg.featured ? '0 12px 36px rgba(212,175,55,0.22)' : '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                {pkg.featured && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#D4AF37',
                    color: '#1a0508',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '0.3rem 0.95rem',
                    borderRadius: '100px',
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(212,175,55,0.35)',
                  }}>
                    {pkg.badge || 'Paling Populer'}
                  </div>
                )}
                <div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.38rem',
                    fontWeight: 700,
                    color: '#FFFDF9',
                    marginBottom: '0.35rem',
                    lineHeight: 1.25,
                  }}>
                    {pkg.title}
                  </h3>
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#D4AF37',
                    marginBottom: '0.65rem',
                  }}>
                    {pkg.price}
                  </div>
                  <p style={{
                    fontSize: '0.84rem',
                    color: '#F1F5F9',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.55,
                    marginBottom: '1rem',
                  }} dangerouslySetInnerHTML={{ __html: pkg.desc }} />

                  {pkg.features && (
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '0 0 1.25rem 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      borderTop: '1px dashed rgba(212,175,55,0.3)',
                      paddingTop: '0.85rem',
                    }}>
                      {pkg.features.map((feat, fIdx) => (
                        <li key={fIdx} style={{
                          fontSize: '0.78rem',
                          color: '#E2E8F0',
                          fontFamily: 'Inter, sans-serif',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.45rem',
                          lineHeight: 1.4,
                        }}>
                          <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>✓</span>
                          <span dangerouslySetInnerHTML={{ __html: feat }} />
                        </li>
                      ))}
                    </ul>
                  )}
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    background: pkg.featured ? '#D4AF37' : 'rgba(212,175,55,0.15)',
                    color: pkg.featured ? '#1a0508' : '#D4AF37',
                    border: '1.5px solid #D4AF37',
                    padding: '0.75rem 1rem',
                    minHeight: '44px',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textDecoration: 'none',
                    marginTop: 'auto',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = '#D4AF37';
                    (e.currentTarget as HTMLElement).style.color = '#1a0508';
                  }}
                  onMouseLeave={e => {
                    if (!pkg.featured) {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.15)';
                      (e.currentTarget as HTMLElement).style.color = '#D4AF37';
                    }
                  }}
                >
                  Pilih Paket Ini
                </a>
              </div>
            ))}
          </div>

          {/* Mobile Dots Navigation Tracker */}
          <div className="mobile-wedding-pkg-dots" style={{
            display: 'none',
            justifyContent: 'center',
            gap: '0.4rem',
            marginTop: '1rem',
          }}>
            {weddingPackages.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToPkgIndex(i)}
                aria-label={`Ke paket wedding ${i + 1}`}
                style={{
                  width: activePkgIndex === i ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '100px',
                  background: activePkgIndex === i ? '#D4AF37' : 'rgba(212,175,55,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Feature tags */}
        <div
          className="reveal-wedding feature-pills-grid"
          style={{
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          {['Studio Indoor Eksklusif', 'Konsep Adat Jawa & Modern', 'Wedding, Engagement, Prewedding', 'Editorial Luxury Look'].map((tag, i) => (
            <span key={i} className="feature-pill-item" style={{
              border: '1px solid rgba(201,169,75,0.3)',
              color: 'rgba(255,255,255,0.8)',
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
