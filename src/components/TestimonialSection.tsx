'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Testimonial {
  id: string | number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  tag: string;
  date: string;
  chat: string;
  highlight: string;
  isUserAdded?: boolean;
}

const INITIAL_TESTIMONIALS: Testimonial[] = [
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
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (carouselRef.current) {
        setCanScroll(carouselRef.current.scrollWidth > carouselRef.current.clientWidth + 10);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [testimonials]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    tag: 'Wisuda Campus',
    rating: 5,
    chat: '',
  });

  // Load stored user reviews from localStorage on client side
  useEffect(() => {
    try {
      const saved = localStorage.getItem('yeka_user_testimonials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTestimonials([...parsed, ...INITIAL_TESTIMONIALS]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) {
      setActiveIndex(0);
      return;
    }
    const scrollPosition = container.scrollLeft;
    if (scrollPosition >= maxScroll - 8) {
      setActiveIndex(testimonials.length - 1);
    } else {
      const progress = Math.max(0, Math.min(1, scrollPosition / maxScroll));
      const newIndex = Math.round(progress * (testimonials.length - 1));
      setActiveIndex(newIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;
    const targetScroll = (maxScroll / (testimonials.length - 1)) * index;
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.chat.trim()) return;

    const newTesti: Testimonial = {
      id: Date.now(),
      name: formData.name.trim(),
      role: formData.role.trim() || 'Klien Yeka Studio',
      avatar: '/images/wisuda-2.jpg',
      rating: formData.rating,
      tag: formData.tag,
      date: 'Baru saja',
      chat: formData.chat.trim(),
      highlight: 'Ulasan Terbaru Klien',
      isUserAdded: true,
    };

    const updatedList = [newTesti, ...testimonials];
    setTestimonials(updatedList);

    // Save user added review to localStorage
    try {
      const userAdded = updatedList.filter((t) => t.isUserAdded);
      localStorage.setItem('yeka_user_testimonials', JSON.stringify(userAdded));
    } catch (err) {
      console.error(err);
    }

    setSubmitted(true);
    setFormData({ name: '', role: '', tag: 'Wisuda Campus', rating: 5, chat: '' });

    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      scrollToIndex(0);
    }, 1800);
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
            marginBottom: '1.75rem',
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

        {/* Add Testimonial Form Modal/Expander */}
        {showForm && (
          <div
            id="form-tulis-testimoni"
            className="animate-fade-in-up"
            style={{
              maxWidth: '540px',
              margin: '0 auto 2.25rem auto',
              background: 'white',
              borderRadius: '14px',
              padding: '1.35rem 1.25rem',
              border: '1.5px solid rgba(123,28,42,0.2)',
              boxShadow: '0 10px 30px rgba(123,28,42,0.12)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(37,211,102,0.12)',
                  border: '1px solid rgba(37,211,102,0.3)',
                  color: '#16A34A',
                  marginBottom: '0.5rem',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.35rem', color: 'var(--maroon)', fontWeight: 700 }}>
                  Terima Kasih Atas Ulasan Anda!
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: '0.35rem' }}>
                  Testimoni Anda telah berhasil diterbitkan di galeri di bawah ini.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--charcoal)',
                  fontFamily: 'Cormorant Garamond, serif',
                  marginBottom: '1rem',
                  borderBottom: '1px solid rgba(123,28,42,0.1)',
                  paddingBottom: '0.5rem',
                }}>
                  Bagikan Pengalaman Foto Anda di Yeka Studio
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '0.25rem' }}>
                      Nama Anda / Pasangan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Rina &amp; Bestie / Adit"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(123,28,42,0.2)',
                        outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '0.25rem' }}>
                      Kategori Sesi *
                    </label>
                    <select
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(123,28,42,0.2)',
                        outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                        background: 'white',
                      }}
                    >
                      <option value="Wisuda Campus">Wisuda Campus (Outdoor)</option>
                      <option value="Prewedding &amp; Studio">Prewedding &amp; Studio</option>
                      <option value="Wedding Session">Wedding Session</option>
                      <option value="Foto Personal">Foto Personal / Studio</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '0.25rem' }}>
                    Lokasi / Detail Sesi (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Wisuda UGM Balairung / Studio Jogja"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.8rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(123,28,42,0.2)',
                      outline: 'none',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '0.25rem' }}>
                    Rating Pengalaman *
                  </label>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '1.25rem',
                          color: star <= formData.rating ? '#F59E0B' : '#CBD5E1',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '0.25rem' }}>
                    Cerita / Kesan Ulasan Anda *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tuliskan pengalaman manis Anda berfoto bersama tim female photographer Yeka Studio..."
                    value={formData.chat}
                    onChange={(e) => setFormData({ ...formData, chat: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.8rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(123,28,42,0.2)',
                      outline: 'none',
                      fontFamily: 'Inter, sans-serif',
                      resize: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: 'var(--maroon)',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                  }}
                >
                  Kirim &amp; Terbitkan Testimoni
                </button>
              </form>
            )}
          </div>
        )}

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
              justifyContent: canScroll ? 'flex-start' : 'center',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              padding: '0.5rem 0.25rem 1.25rem',
            }}
          >
            {testimonials.map((item, i) => (
              <div
                key={i}
                style={{
                  flex: '0 0 auto',
                  width: 'clamp(280px, 85vw, 340px)',
                  scrollSnapAlign: 'start',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(123,28,42,0.08)',
                  border: item.isUserAdded ? '2px solid var(--maroon)' : '1px solid rgba(123,28,42,0.1)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
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
                    {item.isUserAdded ? 'Baru' : 'Verified'}
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
                    <div style={{ color: '#F59E0B', fontSize: '0.85rem' }}>
                      {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                    </div>
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
            display: canScroll ? 'flex' : 'none',
            justifyContent: 'center',
            gap: '0.4rem',
            marginTop: '0.5rem',
          }}>
            {testimonials.map((_, i) => (
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

          {/* Prominent High-Contrast Call-To-Action Banner at Bottom */}
          <div style={{
            maxWidth: '680px',
            margin: '2.5rem auto 0 auto',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF6F0 100%)',
            borderRadius: '16px',
            padding: '1.75rem 1.5rem',
            border: '1.5px solid rgba(123, 28, 42, 0.15)',
            boxShadow: '0 8px 30px rgba(123, 28, 42, 0.08)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--maroon)',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '0.35rem',
            }}>
              BAGIKAN PENGALAMAN BAHAGIA ANDA
            </div>

            <h3 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.25rem, 3.5vw, 1.6rem)',
              fontWeight: 700,
              color: 'var(--charcoal)',
              marginBottom: '0.5rem',
              lineHeight: 1.25,
            }}>
              Pernah Sesi Photoshoot bersama Yeka Studio?
            </h3>

            <p style={{
              fontSize: '0.83rem',
              color: 'var(--muted)',
              fontFamily: 'Inter, sans-serif',
              maxWidth: '480px',
              margin: '0 auto 1.25rem auto',
              lineHeight: 1.5,
            }}>
              Ulasan dan kesan jujur Anda sangat berharga untuk calon wisudawati &amp; pasangan pengantin lainnya di Jogja &amp; Solo.
            </p>

            <button
              id="btn-tulis-testimoni"
              onClick={() => {
                const nextState = !showForm;
                setShowForm(nextState);
                if (nextState) {
                  setTimeout(() => {
                    const formEl = document.getElementById('form-tulis-testimoni');
                    if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 100);
                }
              }}
              style={{
                background: 'var(--maroon)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.75rem',
                borderRadius: '100px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 6px 20px rgba(123,28,42,0.25)',
                transition: 'all 0.25s ease',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                {!showForm && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                )}
                {showForm ? 'Tutup Form Ulasan' : 'Tulis Testimoni Anda'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
