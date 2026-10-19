'use client';
import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Wisuda', href: '#wisuda' },
    { label: 'Wedding & Prewedding', href: '#wedding' },
    { label: 'Tentang Kami', href: '#about' },
    { label: 'Cek Jadwal', href: '#jadwal' },
    { label: 'Testimoni', href: '#testimoni' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: isScrolled
          ? 'rgba(18, 3, 5, 0.94)'
          : 'linear-gradient(to bottom, rgba(18, 3, 5, 0.85) 0%, rgba(18, 3, 5, 0) 100%)',
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(4px)',
        borderBottom: isScrolled ? '1px solid rgba(201, 169, 75, 0.2)' : '1px solid transparent',
        boxShadow: isScrolled ? '0 8px 24px rgba(0, 0, 0, 0.35)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo & Tag */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#hero');
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            color: 'white',
          }}
        >
          <span
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#FFFDF9',
              lineHeight: 1.1,
            }}
          >
            YEKA CREATIVE STUDIO
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.62rem',
              color: '#C9A94B',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Female Photographer • Jogja &amp; Solo
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="navbar-desktop"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.84rem',
                color: 'rgba(255, 255, 255, 0.82)',
                textDecoration: 'none',
                fontWeight: 500,
                letterSpacing: '0.02em',
                transition: 'color 0.2s ease',
                padding: '0.4rem 0',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#C9A94B';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(255, 255, 255, 0.82)';
              }}
            >
              {link.label}
            </a>
          ))}

          {/* Primary Consultation / Booking CTA */}
          <a
            href="#jadwal"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#jadwal');
              trackEvent('navbar_cta_click', { destination: 'jadwal' });
            }}
            style={{
              background: 'linear-gradient(135deg, #7B1C2A 0%, #5A1320 100%)',
              color: 'white',
              border: '1px solid rgba(201, 169, 75, 0.4)',
              padding: '0.55rem 1.25rem',
              borderRadius: '6px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(123, 28, 42, 0.35)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.borderColor = '#C9A94B';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201, 169, 75, 0.4)';
            }}
          >
            Booking Jadwal
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka menu navigasi'}
          aria-expanded={mobileMenuOpen}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(201, 169, 75, 0.3)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            padding: 0,
          }}
          className="navbar-hamburger"
        >
          {mobileMenuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="7" x2="20" y2="7"></line>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="17" x2="20" y2="17"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'rgba(18, 3, 5, 0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(201, 169, 75, 0.2)',
            padding: '1.25rem 1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
          }}
          className="mobile-drawer"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.95rem',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 500,
                padding: '0.65rem 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {link.label}
            </a>
          ))}

          <a
            href="#jadwal"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#jadwal');
            }}
            style={{
              marginTop: '0.5rem',
              background: 'var(--maroon)',
              color: 'white',
              textAlign: 'center',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.88rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid rgba(201, 169, 75, 0.4)',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Cek Slot Jadwal &amp; Booking &rarr;
          </a>
        </div>
      )}
    </header>
  );
}
