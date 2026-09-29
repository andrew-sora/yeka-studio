'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// Default PIN for Yeka Studio Owner/Admin
const ADMIN_PIN = '1234';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

interface SlotOverride {
  dateKey: string; // YYYY-MM-DD
  status: 'fully_available' | 'partially_booked' | 'fully_booked';
  bookedSlots: string[]; // List of booked slot strings e.g. ["09.00 - 10.00"]
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'packages' | 'reviews'>('calendar');

  // Calendar State
  const today = useMemo(() => new Date(), []);
  const [monthOffset, setMonthOffset] = useState(0);
  const targetDate = useMemo(() => new Date(today.getFullYear(), today.getMonth() + monthOffset, 1), [today, monthOffset]);
  const viewYear = targetDate.getFullYear();
  const viewMonth = targetDate.getMonth();

  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [overrides, setOverrides] = useState<Record<string, SlotOverride>>({});
  const [savedSuccessToast, setSavedSuccessToast] = useState(false);

  // Check auth session on load
  useEffect(() => {
    const auth = sessionStorage.getItem('yeka_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load slot overrides from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('yeka_slot_overrides');
      if (stored) {
        setOverrides(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      sessionStorage.setItem('yeka_admin_auth', 'true');
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('yeka_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  const currentDateKey = useMemo(() => {
    const m = (viewMonth + 1).toString().padStart(2, '0');
    const d = selectedDay.toString().padStart(2, '0');
    return `${viewYear}-${m}-${d}`;
  }, [viewYear, viewMonth, selectedDay]);

  const currentOverride = overrides[currentDateKey] || {
    dateKey: currentDateKey,
    status: 'fully_available',
    bookedSlots: [],
  };

  const toggleSlotBooked = (slotTime: string) => {
    const isBooked = currentOverride.bookedSlots.includes(slotTime);
    let newBooked = isBooked
      ? currentOverride.bookedSlots.filter((s) => s !== slotTime)
      : [...currentOverride.bookedSlots, slotTime];

    let newStatus: 'fully_available' | 'partially_booked' | 'fully_booked' = 'fully_available';
    if (newBooked.length >= 6) {
      newStatus = 'fully_booked';
    } else if (newBooked.length > 0) {
      newStatus = 'partially_booked';
    }

    const updated = {
      ...overrides,
      [currentDateKey]: {
        dateKey: currentDateKey,
        status: newStatus,
        bookedSlots: newBooked,
      },
    };

    setOverrides(updated);
    localStorage.setItem('yeka_slot_overrides', JSON.stringify(updated));
    showToast();
  };

  const setDayStatus = (status: 'fully_available' | 'partially_booked' | 'fully_booked') => {
    let booked: string[] = [];
    if (status === 'fully_booked') {
      booked = [
        '08.00 - 09.00',
        '09.00 - 10.00',
        '10.00 - 11.00',
        '13.00 - 14.00',
        '14.00 - 15.00',
        '15.00 - 16.00',
      ];
    }

    const updated = {
      ...overrides,
      [currentDateKey]: {
        dateKey: currentDateKey,
        status,
        bookedSlots: booked,
      },
    };

    setOverrides(updated);
    localStorage.setItem('yeka_slot_overrides', JSON.stringify(updated));
    showToast();
  };

  const showToast = () => {
    setSavedSuccessToast(true);
    setTimeout(() => setSavedSuccessToast(false), 2000);
  };

  // ── PIN LOGIN SCREEN ────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #120305 0%, #29080F 50%, #4C101B 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{
          maxWidth: '380px',
          width: '100%',
          background: 'white',
          borderRadius: '16px',
          padding: '2rem 1.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            color: 'var(--maroon)',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}>
            YEKA CREATIVE STUDIO
          </div>

          <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.5rem' }}>
            Admin Dashboard
          </h1>

          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
            Masukkan PIN rahasia Owner/Admin untuk mengelola jadwal &amp; slot booking.
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              maxLength={6}
              placeholder="Masukkan PIN (Default: 1234)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                textAlign: 'center',
                letterSpacing: '0.3em',
                borderRadius: '8px',
                border: pinError ? '2px solid #DC2626' : '1px solid rgba(123,28,42,0.25)',
                outline: 'none',
                marginBottom: '1rem',
              }}
            />

            {pinError && (
              <div style={{ color: '#DC2626', fontSize: '0.75rem', marginBottom: '1rem', fontWeight: 600 }}>
                PIN salah. Silakan coba lagi (Default PIN: 1234).
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'var(--maroon)',
                color: 'white',
                padding: '0.85rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              Masuk ke Dashboard &rarr;
            </button>
          </form>

          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/" style={{ fontSize: '0.75rem', color: 'var(--muted)', textDecoration: 'none' }}>
              &larr; Kembali ke Website Utama
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN ADMIN DASHBOARD ───────────────────────────────────────────────────
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();

  const allSlotsList = [
    '08.00 - 09.00',
    '09.00 - 10.00',
    '10.00 - 11.00',
    '13.00 - 14.00',
    '14.00 - 15.00',
    '15.00 - 16.00',
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      fontFamily: 'Inter, sans-serif',
      paddingBottom: '3rem',
    }}>
      {/* Admin Top Header */}
      <header style={{
        background: '#120305',
        color: 'white',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            background: 'var(--gold)',
            color: '#120305',
            padding: '0.2rem 0.5rem',
            borderRadius: '3px',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}>
            OWNER PANEL
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Yeka Studio Admin</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', textDecoration: 'none' }}>
            Lihat Web Utama ↗
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Keluar (Logout)
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {savedSuccessToast && (
        <div style={{
          position: 'fixed',
          top: '70px',
          right: '20px',
          background: '#16A34A',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          fontSize: '0.82rem',
          fontWeight: 600,
          zIndex: 100,
        }}>
          ✓ Perubahan Jadwal Disimpan &amp; Sinkron ke Web!
        </div>
      )}

      <main style={{ maxWidth: '1000px', margin: '2rem auto 0', padding: '0 1.25rem' }}>
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(123,28,42,0.1)',
          paddingBottom: '0.5rem',
        }}>
          <button
            onClick={() => setActiveTab('calendar')}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'calendar' ? 'var(--maroon)' : 'transparent',
              color: activeTab === 'calendar' ? 'white' : 'var(--charcoal)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            📅 Kelola Slot Jadwal
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'reviews' ? 'var(--maroon)' : 'transparent',
              color: activeTab === 'reviews' ? 'white' : 'var(--charcoal)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            💬 Kelola Testimoni Klien
          </button>
        </div>

        {/* ── TAB 1: CALENDAR OVERRIDES ── */}
        {activeTab === 'calendar' && (
          <div>
            <div style={{
              background: 'white',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(123,28,42,0.1)',
            }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.25rem' }}>
                Kontrol Slot &amp; Jadwal Real-Time
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                Klik tanggal pada kalender di bawah untuk mematikan jam yang sudah terisi (booked via WA) atau menutup tanggal secara penuh.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '1.5rem',
            }}>
              {/* Calendar Grid Box */}
              <div style={{
                background: 'white',
                borderRadius: '14px',
                padding: '1.25rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid rgba(123,28,42,0.08)',
              }}>
                {/* Month Navigator Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <button
                    onClick={() => setMonthOffset((prev) => Math.max(0, prev - 1))}
                    disabled={monthOffset === 0}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '1px solid rgba(123,28,42,0.2)',
                      background: monthOffset === 0 ? '#F1F5F9' : 'white',
                      cursor: monthOffset === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    &#8249;
                  </button>

                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--charcoal)' }}>
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </div>

                  <button
                    onClick={() => setMonthOffset((prev) => prev + 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '1px solid var(--maroon)',
                      background: 'var(--maroon)',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    &#8250;
                  </button>
                </div>

                {/* Day Labels */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                    <div key={d} style={{ color: 'var(--muted)' }}>{d}</div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                  {Array.from({ length: firstWeekday }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const m = (viewMonth + 1).toString().padStart(2, '0');
                    const d = dayNum.toString().padStart(2, '0');
                    const key = `${viewYear}-${m}-${d}`;
                    const dayOverride = overrides[key];
                    const isSelected = selectedDay === dayNum;

                    let bg = 'white';
                    let color = 'var(--charcoal)';
                    let border = '1px solid rgba(0,0,0,0.08)';

                    if (dayOverride?.status === 'fully_booked') {
                      bg = '#FEE2E2';
                      color = '#991B1B';
                      border = '1px solid #F87171';
                    } else if (dayOverride?.status === 'partially_booked') {
                      bg = '#FEF3C7';
                      color = '#92400E';
                      border = '1px solid #FBBF24';
                    }

                    if (isSelected) {
                      bg = 'var(--maroon)';
                      color = 'white';
                      border = '2px solid var(--maroon)';
                    }

                    return (
                      <div
                        key={dayNum}
                        onClick={() => setSelectedDay(dayNum)}
                        style={{
                          aspectRatio: '1',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          background: bg,
                          color: color,
                          border: border,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {dayNum}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Slot Management Control Panel */}
              <div style={{
                background: 'white',
                borderRadius: '14px',
                padding: '1.25rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid rgba(123,28,42,0.08)',
              }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--maroon)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  PENGATURAN TANGGAL
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '1rem' }}>
                  {selectedDay} {MONTH_NAMES[viewMonth]} {viewYear}
                </div>

                {/* Quick Status Setter */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.5rem' }}>
                    STATUS KETERSEDIAAN TANGGAL:
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setDayStatus('fully_available')}
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: '1px solid #16A34A',
                        background: currentOverride.status === 'fully_available' ? '#16A34A' : 'rgba(22,163,74,0.08)',
                        color: currentOverride.status === 'fully_available' ? 'white' : '#15803D',
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Tersedia Penuh
                    </button>

                    <button
                      onClick={() => setDayStatus('fully_booked')}
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: '1px solid #DC2626',
                        background: currentOverride.status === 'fully_booked' ? '#DC2626' : 'rgba(220,38,38,0.08)',
                        color: currentOverride.status === 'fully_booked' ? 'white' : '#B91C1C',
                        cursor: 'pointer',
                      }}
                    >
                      ✕ Tutup Penuh (Fully Booked)
                    </button>
                  </div>
                </div>

                {/* Toggle Individual Time Slots */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.5rem' }}>
                    KLIK SLOT JAM UNTUK MEMATIKAN / MENGAKTIFKAN:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {allSlotsList.map((slotTime) => {
                      const isBooked = currentOverride.bookedSlots.includes(slotTime);

                      return (
                        <div
                          key={slotTime}
                          onClick={() => toggleSlotBooked(slotTime)}
                          style={{
                            padding: '0.65rem 0.95rem',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            border: isBooked ? '1.5px solid #DC2626' : '1px solid #16A34A',
                            background: isBooked ? '#FEE2E2' : '#F0FDF4',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isBooked ? '#991B1B' : '#166534' }}>
                            {slotTime}
                          </span>

                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '100px',
                            background: isBooked ? '#DC2626' : '#16A34A',
                            color: 'white',
                          }}>
                            {isBooked ? 'TERISI (BOOKED)' : 'TERSEDIA'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: REVIEWS MANAGEMENT ── */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{
              background: 'white',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(123,28,42,0.1)',
            }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.25rem' }}>
                Moderasi &amp; Kelola Testimoni Customer
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                Ulasan yang dikirimkan customer dari website akan tercatat di bawah ini. Anda dapat menyetujui, menyembunyikan, atau menghapus ulasan yang tidak diinginkan.
              </p>
            </div>

            <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid rgba(123,28,42,0.08)' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '1rem' }}>
                Daftar Ulasan Customer Terbaru
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                ✓ Sistem secara otomatis menampilkan testimoni terbaru dari customer yang sudah terverifikasi di website utama.
                Untuk menghapus seluruh ulasan simulasi/test, Anda dapat mengklik tombol di bawah ini.
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <button
                  onClick={() => {
                    localStorage.removeItem('yeka_user_testimonials');
                    alert('Data ulasan tambahan telah dibersihkan.');
                    window.location.reload();
                  }}
                  style={{
                    background: '#FEE2E2',
                    color: '#991B1B',
                    border: '1px solid #F87171',
                    padding: '0.55rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  🗑️ Reset Data Ulasan Customer Tambahan
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
