'use client';
import { useState, useRef, useEffect } from 'react';

const FAQS = [
  {
    q: 'Berapa lama proses pengiriman file foto?',
    a: 'Seluruh file foto mentah (all unedited photos) akan kami kirimkan via Google Drive dalam waktu 24 jam (H+1). Untuk foto pilihan yang di-retouch & color grading estetik, proses pengerjaan berkisar 3-5 hari kerja.',
  },
  {
    q: 'Apakah harga paket sudah nett & include semua file?',
    a: 'Ya, benar! Semua harga paket yang tertera di website sudah transparan, nett, dan sudah mencakup seluruh file hasil sesi foto Anda tanpa ada biaya tersembunyi.',
  },
  {
    q: 'Mengapa memilih tim Female Photographer Yeka Studio?',
    a: 'Tim fotografer perempuan kami mengerti betul sudut pose terbaik wanita & pasangan. Suasana photoshoot dijamin super rileks, santai, ramah, dan ramah untuk calon wisudawati/pengantin yang hijab maupun yang pemalu di depan kamera.',
  },
  {
    q: 'Bagaimana cara booking dan mengunci tanggal sesi foto?',
    a: 'Sangat mudah! Cukup pilih tanggal pada form jadwal di website ini atau tekan tombol WhatsApp. Tim kami akan langsung mengonfirmasi ketersediaan slot dan memberikan langkah penguncian jadwal (DP).',
  },
  {
    q: 'Apakah melayani lokasi foto di luar area Jogja & Solo?',
    a: 'Fokus utama layanan kami adalah di area Yogyakarta dan Surakarta (Solo). Untuk permintaan lokasi di luar dua area tersebut, silakan konsultasikan via WhatsApp untuk detail akomodasi & jadwal.',
  },
];

export default function FaqSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-faq').forEach((el, i) => {
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

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      style={{
        background: 'var(--cream-dark)',
        padding: 'clamp(2.5rem, 5vw, 4.5rem) 1.25rem',
        borderTop: '1px solid rgba(123,28,42,0.08)',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Section Header */}
        <div
          className="reveal-faq"
          style={{
            textAlign: 'center',
            marginBottom: '2.5rem',
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
            Pertanyaan Umum
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 600,
            color: 'var(--charcoal)',
            lineHeight: 1.2,
            marginBottom: '0.5rem',
          }}>
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <div className="section-divider" />
          <p style={{
            fontSize: '0.92rem',
            color: 'var(--muted)',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.65,
            fontFamily: 'Inter, sans-serif',
          }}>
            Semua hal yang perlu Anda ketahui sebelum memesan sesi foto di Yeka Creative Studio.
          </p>
        </div>

        {/* Accordion Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="reveal-faq"
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  border: isOpen ? '1.5px solid var(--maroon)' : '1px solid rgba(123,28,42,0.1)',
                  boxShadow: isOpen ? '0 4px 20px rgba(123,28,42,0.08)' : '0 2px 8px rgba(0,0,0,0.03)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  opacity: 0,
                  transform: 'translateY(24px)',
                }}
              >
                <button
                  onClick={() => toggleFaq(i)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    padding: '1.15rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: isOpen ? 'var(--maroon)' : 'var(--charcoal)',
                    lineHeight: 1.4,
                  }}>
                    {faq.q}
                  </span>
                  <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isOpen ? 'var(--maroon)' : 'rgba(123,28,42,0.06)',
                    color: isOpen ? 'white' : 'var(--maroon)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 400,
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}>
                    &#9662;
                  </span>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 1.25rem 1.25rem',
                    fontSize: '0.85rem',
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.7,
                    borderTop: '1px solid rgba(123,28,42,0.06)',
                    paddingTop: '0.85rem',
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
