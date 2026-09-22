'use client';
import { useState, useEffect } from 'react';

export default function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        zIndex: 99,
        background: 'rgba(26, 5, 8, 0.92)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(201, 169, 75, 0.3)',
        padding: '0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom, 0px))',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        animation: 'fadeInUp 0.3s ease forwards',
      }}
      className="md:hidden"
    >
      <a
        href="#jadwal"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById('jadwal');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        style={{
          flex: 1,
          background: 'var(--maroon)',
          color: 'white',
          textAlign: 'center',
          padding: '0.75rem 0.5rem',
          borderRadius: '6px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.8rem',
          fontWeight: 600,
          textDecoration: 'none',
          border: '1px solid rgba(201,169,75,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
        }}
      >
        <span>📅</span>
        <span>Cek Slot &amp; Jadwal</span>
      </a>

      <a
        href="https://wa.me/6285952879644?text=Halo%20Yeka%20Studio!%20Saya%20ingin%20tanya%20jadwal%20dan%20pricelist%20foto%20%F0%9F%93%B8"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1,
          background: '#25D366',
          color: 'white',
          textAlign: 'center',
          padding: '0.75rem 0.5rem',
          borderRadius: '6px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.8rem',
          fontWeight: 600,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span>Chat WA</span>
      </a>
    </div>
  );
}
