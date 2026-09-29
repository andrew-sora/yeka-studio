'use client';
import { useState, useEffect, useRef, useMemo } from 'react';

// ─── Types & Data ─────────────────────────────────────────────────────────────
type SlotStatus = 'available' | 'booked';
type DateAvailabilityStatus = 'fully_available' | 'partially_booked' | 'fully_booked' | 'past';

interface TimeSlot {
  time: string;
  status: SlotStatus;
}

interface CalendarDay {
  date: number;
  dateStatus: DateAvailabilityStatus;
  slots: TimeSlot[];
}

const MONTH_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const DAY_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// Generate slot data for any requested month and year
function buildMonthCalendar(targetYear: number, targetMonth: number, overrides: Record<string, any> = {}): CalendarDay[] {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  const isCurrentMonth = targetYear === currentYear && targetMonth === currentMonth;
  const isPastMonth = targetYear < currentYear || (targetYear === currentYear && targetMonth < currentMonth);

  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const days: CalendarDay[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const isPast = isPastMonth || (isCurrentMonth && d < currentDate);
    const dayOfWeek = new Date(targetYear, targetMonth, d).getDay();

    let slots: TimeSlot[] = [];

    if (isPast) {
      slots = [
        { time: '08.00 - 09.00', status: 'booked' },
        { time: '09.00 - 10.00', status: 'booked' },
        { time: '10.00 - 11.00', status: 'booked' },
        { time: '13.00 - 14.00', status: 'booked' },
        { time: '14.00 - 15.00', status: 'booked' },
        { time: '15.00 - 16.00', status: 'booked' },
      ];
    } else if (d % 5 === 0) {
      // Fully booked dates
      slots = [
        { time: '08.00 - 09.00', status: 'booked' },
        { time: '09.00 - 10.00', status: 'booked' },
        { time: '10.00 - 11.00', status: 'booked' },
        { time: '13.00 - 14.00', status: 'booked' },
        { time: '14.00 - 15.00', status: 'booked' },
        { time: '15.00 - 16.00', status: 'booked' },
      ];
    } else if (d % 2 === 0 || dayOfWeek === 0 || dayOfWeek === 6) {
      // Partially booked dates
      slots = [
        { time: '08.00 - 09.00', status: 'available' },
        { time: '09.00 - 10.00', status: 'booked' },
        { time: '10.00 - 11.00', status: 'available' },
        { time: '13.00 - 14.00', status: 'booked' },
        { time: '14.00 - 15.00', status: 'available' },
        { time: '15.00 - 16.00', status: 'booked' },
      ];
    } else {
      // Fully available dates
      slots = [
        { time: '08.00 - 09.00', status: 'available' },
        { time: '09.00 - 10.00', status: 'available' },
        { time: '10.00 - 11.00', status: 'available' },
        { time: '13.00 - 14.00', status: 'available' },
        { time: '14.00 - 15.00', status: 'available' },
        { time: '15.00 - 16.00', status: 'available' },
      ];
    }

    // Merge Admin Overrides if present
    const dateKey = `${targetYear}-${(targetMonth + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    const dayOverride = overrides[dateKey];
    if (dayOverride && !isPast) {
      if (dayOverride.status === 'fully_booked') {
        slots = slots.map((s) => ({ ...s, status: 'booked' }));
      } else if (Array.isArray(dayOverride.bookedSlots)) {
        slots = slots.map((s) => ({
          ...s,
          status: dayOverride.bookedSlots.includes(s.time) ? 'booked' : 'available',
        }));
      }
    }

    // Derive date status from slots
    let dateStatus: DateAvailabilityStatus = 'fully_available';
    if (isPast) {
      dateStatus = 'past';
    } else {
      const availableCount = slots.filter((s) => s.status === 'available').length;
      if (availableCount === 0) dateStatus = 'fully_booked';
      else if (availableCount < slots.length) dateStatus = 'partially_booked';
      else dateStatus = 'fully_available';
    }

    days.push({ date: d, dateStatus, slots });
  }

  return days;
}

export default function AvailabilitySection() {
  const today = useMemo(() => new Date(), []);
  const [monthOffset, setMonthOffset] = useState(0);
  const [adminOverrides, setAdminOverrides] = useState<Record<string, any>>({});

  // Load Admin overrides from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('yeka_slot_overrides');
      if (stored) {
        setAdminOverrides(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const targetDate = useMemo(() => {
    return new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  }, [today, monthOffset]);

  const viewYear = targetDate.getFullYear();
  const viewMonth = targetDate.getMonth();

  // Set default selected date to today or null when changing month
  const [selectedDate, setSelectedDate] = useState<number | null>(() => monthOffset === 0 ? today.getDate() : null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('Wisuda Outdoor');
  const [guestName, setGuestName] = useState<string>('');

  const sectionRef = useRef<HTMLDivElement>(null);
  const slotPanelRef = useRef<HTMLDivElement>(null);

  const calendarDays = useMemo(() => buildMonthCalendar(viewYear, viewMonth, adminOverrides), [viewYear, viewMonth, adminOverrides]);
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const selectedDayData = calendarDays.find(d => d.date === selectedDate);

  const changeMonth = (delta: number) => {
    const newOffset = Math.max(0, Math.min(6, monthOffset + delta));
    setMonthOffset(newOffset);
    setSelectedDate(newOffset === 0 ? today.getDate() : null);
    setSelectedSlot(null);
  };

  // Listen to selectPackage custom event from pricing cards
  useEffect(() => {
    const handleSelectPackage = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedPackage(customEvent.detail);
      }
    };
    window.addEventListener('selectPackage', handleSelectPackage);
    return () => window.removeEventListener('selectPackage', handleSelectPackage);
  }, []);

  // Reset slot when date changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate]);

  // Reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-avail').forEach((el, i) => {
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

  // Format WA pre-filled message
  const waPrefilledLink = useMemo(() => {
    if (!selectedDate) return null;
    const dateStr = `${selectedDate} ${MONTH_ID[viewMonth]} ${viewYear}`;
    const nameStr = guestName.trim() || '[Nama Klien]';
    const slotStr = selectedSlot ? `jam ${selectedSlot} WIB` : 'sesi foto';
    const msg = `Halo, saya ${nameStr}, mau booking paket ${selectedPackage} tanggal ${dateStr} ${slotStr}`;
    return `https://wa.me/6285952879644?text=${encodeURIComponent(msg)}`;
  }, [selectedDate, selectedSlot, selectedPackage, guestName, viewMonth, viewYear]);

  return (
    <section
      id="jadwal"
      ref={sectionRef}
      style={{
        background: 'var(--cream)',
        padding: 'clamp(2.5rem, 5vw, 4.5rem) 1.25rem',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

        {/* ── Section Header ── */}
        <div
          className="reveal-avail"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          <div>
            <div style={{
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--maroon)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              marginBottom: '0.4rem',
            }}>
              CEK KETERSEDIAAN
            </div>
            <h2 className="font-display" style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
              fontWeight: 600,
              color: 'var(--charcoal)',
              lineHeight: 1.15,
            }}>
              Jadwal Sesi Foto
            </h2>
          </div>

          <p style={{
            fontSize: '0.85rem',
            color: 'var(--muted)',
            maxWidth: '360px',
            lineHeight: 1.55,
            fontFamily: 'Inter, sans-serif',
          }}>
            Klik tanggal untuk melihat slot jam. Jadwal terbatas — segera amankan tanggalmu sebelum terisi.
          </p>
        </div>

        {/* ── 2-Column Desktop Grid Layout ── */}
        <div
          className="reveal-avail"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >

          {/* ── LEFT COLUMN: Calendar Grid Card ── */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: 'clamp(1.25rem, 3vw, 1.75rem)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              border: '1px solid rgba(123,28,42,0.08)',
            }}
          >
            {/* Header: Month Title with Navigation Arrows & Legend */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}>
              {/* Month Navigation Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => changeMonth(-1)}
                  disabled={monthOffset === 0}
                  aria-label="Bulan sebelumnya"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid rgba(123,28,42,0.2)',
                    background: monthOffset === 0 ? 'rgba(0,0,0,0.04)' : 'white',
                    color: monthOffset === 0 ? '#CBD5E1' : 'var(--maroon)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: monthOffset === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  &#8249;
                </button>

                <div className="font-display" style={{
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: 'var(--charcoal)',
                  minWidth: '150px',
                  textAlign: 'center',
                }}>
                  {MONTH_ID[viewMonth]} {viewYear}
                </div>

                <button
                  onClick={() => changeMonth(1)}
                  disabled={monthOffset >= 6}
                  aria-label="Bulan berikutnya"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--maroon)',
                    background: monthOffset >= 6 ? 'rgba(0,0,0,0.04)' : 'var(--maroon)',
                    color: monthOffset >= 6 ? '#CBD5E1' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: monthOffset >= 6 ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  &#8250;
                </button>
              </div>

              {/* Inline Legend Track */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.7rem',
                fontFamily: 'Inter, sans-serif',
                color: 'var(--muted)',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A' }} />
                  Tersedia
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#CA8A04' }} />
                  Sebagian
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#DC2626' }} />
                  Penuh
                </span>
              </div>
            </div>

            {/* Day labels */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              marginBottom: '0.75rem',
            }}>
              {DAY_SHORT.map(d => (
                <div key={d} style={{
                  textAlign: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: d === 'Min' || d === 'Sab' ? 'var(--muted)' : 'var(--charcoal)',
                  padding: '0.3rem 0',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '6px',
            }}>
              {/* Empty cells before first day */}
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <div key={`empty-${i}`} style={{ aspectRatio: '1' }} />
              ))}

              {/* Day cells */}
              {calendarDays.map((day) => {
                const isSelected = selectedDate === day.date;
                const isClickable = day.dateStatus === 'fully_available' || day.dateStatus === 'partially_booked';

                const cellStyle: React.CSSProperties = {
                  aspectRatio: '1',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.88rem',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  fontWeight: isSelected ? 700 : 500,
                  fontFamily: 'Inter, sans-serif',
                  cursor: isClickable ? 'pointer' : 'not-allowed',
                };

                if (isSelected) {
                  Object.assign(cellStyle, {
                    background: 'var(--maroon)',
                    color: 'white',
                    boxShadow: '0 4px 14px rgba(123,28,42,0.3)',
                    border: '1.5px solid var(--maroon)',
                  });
                } else if (day.dateStatus === 'past') {
                  Object.assign(cellStyle, {
                    background: 'transparent',
                    color: 'rgba(44,40,40,0.25)',
                    border: '1px solid transparent',
                  });
                } else if (day.dateStatus === 'fully_booked') {
                  Object.assign(cellStyle, {
                    background: 'rgba(0,0,0,0.03)',
                    color: 'rgba(44,40,40,0.35)',
                    border: '1px solid rgba(0,0,0,0.05)',
                  });
                } else if (day.dateStatus === 'partially_booked') {
                  Object.assign(cellStyle, {
                    background: 'white',
                    color: 'var(--charcoal)',
                    border: '1.5px solid #C9A94B',
                  });
                } else {
                  // fully_available
                  Object.assign(cellStyle, {
                    background: 'white',
                    color: 'var(--charcoal)',
                    border: '1px solid rgba(0,0,0,0.08)',
                  });
                }

                return (
                  <div
                    key={day.date}
                    onClick={isClickable ? () => setSelectedDate(prev => prev === day.date ? null : day.date) : undefined}
                    title={
                      day.dateStatus === 'fully_available' ? 'Tersedia Penuh (Klik untuk pilih jam)' :
                      day.dateStatus === 'partially_booked' ? 'Slot Terbatas (Klik untuk pilih jam)' :
                      day.dateStatus === 'fully_booked' ? 'Sudah Fully Booked' : ''
                    }
                    style={cellStyle}
                  >
                    <span>{day.date}</span>

                    {/* Dot indicator underneath number */}
                    {day.dateStatus === 'fully_available' && (
                      <span style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: isSelected ? 'white' : '#16A34A',
                        marginTop: '2px',
                      }} />
                    )}

                    {day.dateStatus === 'partially_booked' && (
                      <span style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: isSelected ? 'white' : '#CA8A04',
                        marginTop: '2px',
                      }} />
                    )}

                    {day.dateStatus === 'fully_booked' && (
                      <span style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: '#DC2626',
                        marginTop: '2px',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT COLUMN: Slot Details & Booking Panel ── */}
          <div
            ref={slotPanelRef}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: 'clamp(1.25rem, 3vw, 1.75rem)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              border: '1px solid rgba(123,28,42,0.08)',
              minHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Header inside Panel */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--maroon)',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  marginBottom: '0.2rem',
                }}>
                  TANGGAL DIPILIH
                </div>

                {selectedDate && selectedDayData ? (
                  <>
                    <div className="font-display" style={{
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      color: 'var(--charcoal)',
                      lineHeight: 1.2,
                      marginBottom: '0.4rem',
                    }}>
                      {selectedDate} {MONTH_ID[viewMonth]} {viewYear}
                    </div>

                    <span style={{
                      display: 'inline-block',
                      background: selectedDayData.dateStatus === 'fully_available' ? 'rgba(22,163,74,0.1)' :
                        selectedDayData.dateStatus === 'partially_booked' ? 'rgba(201,169,75,0.15)' : 'rgba(220,38,38,0.1)',
                      color: selectedDayData.dateStatus === 'fully_available' ? '#15803D' :
                        selectedDayData.dateStatus === 'partially_booked' ? '#946B00' : '#DC2626',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}>
                      {selectedDayData.dateStatus === 'fully_available' ? 'TERSEDIA PENUH' :
                       selectedDayData.dateStatus === 'partially_booked' ? 'SEBAGIAN TERSEDIA' : 'FULLY BOOKED'}
                    </span>
                  </>
                ) : (
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    fontStyle: 'italic',
                    marginTop: '0.2rem',
                  }}>
                    Silakan klik salah satu tanggal pada kalender.
                  </div>
                )}
              </div>

              {/* Time Slot List Rows */}
              {selectedDate && selectedDayData && (
                <div>
                  <div style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    marginBottom: '0.75rem',
                  }}>
                    SLOT JAM
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    marginBottom: '1.25rem',
                  }}>
                    {selectedDayData.slots.map((slotItem) => {
                      const isAvailable = slotItem.status === 'available';
                      const isPicked = selectedSlot === slotItem.time;

                      return (
                        <div
                          key={slotItem.time}
                          onClick={isAvailable ? () => setSelectedSlot(prev => prev === slotItem.time ? null : slotItem.time) : undefined}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.65rem 0.95rem',
                            borderRadius: '8px',
                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease',
                            border: isPicked
                              ? '1.5px solid var(--maroon)'
                              : isAvailable
                              ? '1px solid rgba(37,211,102,0.3)'
                              : '1px solid rgba(220,38,38,0.15)',
                            background: isPicked
                              ? 'var(--maroon)'
                              : isAvailable
                              ? 'rgba(37,211,102,0.06)'
                              : 'rgba(220,38,38,0.04)',
                          }}
                        >
                          <span style={{
                            fontSize: '0.85rem',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            color: isPicked ? 'white' : isAvailable ? 'var(--charcoal)' : 'rgba(44,40,40,0.35)',
                            textDecoration: !isAvailable ? 'line-through' : 'none',
                          }}>
                            {slotItem.time}
                          </span>

                          <span style={{
                            fontSize: '0.68rem',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            color: isPicked ? 'white' : isAvailable ? '#15803D' : '#B91C1C',
                          }}>
                            {isAvailable ? 'TERSEDIA' : 'TERISI'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Guest Details & Booking Button */}
            {selectedDate && selectedDayData && selectedDayData.dateStatus !== 'fully_booked' && (
              <div style={{
                borderTop: '1px solid rgba(0,0,0,0.06)',
                paddingTop: '1rem',
                marginTop: '0.5rem',
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.65rem',
                  marginBottom: '1rem',
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.7rem',
                      fontFamily: 'Inter, sans-serif',
                      color: 'var(--muted)',
                      marginBottom: '0.25rem',
                      fontWeight: 500,
                    }}>
                      Nama Pemesan:
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Anda..."
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(123,28,42,0.2)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.8rem',
                        color: 'var(--charcoal)',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.7rem',
                      fontFamily: 'Inter, sans-serif',
                      color: 'var(--muted)',
                      marginBottom: '0.25rem',
                      fontWeight: 500,
                    }}>
                      Paket Foto Terpilih:
                    </label>
                    <select
                      value={selectedPackage}
                      onChange={(e) => setSelectedPackage(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(123,28,42,0.2)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.8rem',
                        color: 'var(--charcoal)',
                        background: 'white',
                        outline: 'none',
                      }}
                    >
                      <option value="Wisuda Outdoor">Wisuda Outdoor (Rp 450.000)</option>
                      <option value="Wisuda Indoor">Wisuda Indoor (Rp 550.000)</option>
                      <option value="Wisuda Studio">Wisuda Studio (Rp 650.000)</option>
                      <option value="Wisuda All-In">Wisuda All-In (Rp 950.000)</option>
                      <option value="Prewedding Studio Adat Jawa">Prewedding Studio Adat Jawa (Rp 1.850.000)</option>
                      <option value="Prewedding Outdoor Scenic">Prewedding Outdoor Scenic (Rp 2.250.000)</option>
                      <option value="Intimate Wedding Coverage">Intimate Wedding Coverage (Rp 4.500.000)</option>
                    </select>
                  </div>
                </div>

                {waPrefilledLink && (
                  <a
                    href={waPrefilledLink}
                    id="cta-booking-slot-wa"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: 'var(--maroon)',
                      color: 'white',
                      padding: '0.85rem 1.25rem',
                      borderRadius: '8px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(123,28,42,0.25)',
                      transition: 'all 0.25s ease',
                      width: '100%',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--maroon-dark)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--maroon)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    Booking Tanggal Ini &rarr;
                  </a>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
