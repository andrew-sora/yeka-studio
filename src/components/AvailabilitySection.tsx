'use client';
import { useState, useEffect, useRef, useMemo } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
type DayStatus = 'available' | 'booked' | 'pending' | 'past' | 'empty';

interface CalendarDay {
  date: number;
  status: DayStatus;
  slots: string[];
}

// ─── Dummy Data Generator ────────────────────────────────────────────────────
// Seeded pattern supaya konsisten tiap render (tidak random)
const BOOKED_OFFSETS  = [1, 4, 7, 10, 14, 17, 21, 25];
const PENDING_OFFSETS = [3, 9, 15, 22];
const ALL_SLOTS = ['07.00', '08.00', '09.00', '10.00', '13.00', '14.00', '15.00', '16.00', '17.00'];

// Tiap tanggal available punya subset slot (variasi supaya realistis)
const SLOT_PATTERN: Record<number, string[]> = {
  0: ['09.00', '13.00', '16.00'],
  1: ['07.00', '08.00', '14.00', '17.00'],
  2: ['09.00', '10.00', '15.00'],
  3: ['08.00', '13.00', '16.00'],
  4: ['07.00', '10.00', '14.00', '17.00'],
  5: ['09.00', '15.00', '16.00'],
};

function buildCalendar(year: number, month: number): CalendarDay[] {
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  const isCurrentMonth = year === todayYear && month === todayMonth;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: CalendarDay[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const isPast = isCurrentMonth && d < todayDate;
    const dayOfWeek = new Date(year, month, d).getDay(); // 0=Sun, 6=Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let status: DayStatus = 'available';
    if (isPast) status = 'past';
    else if (BOOKED_OFFSETS.includes(d)) status = 'booked';
    else if (PENDING_OFFSETS.includes(d)) status = 'pending';
    else if (isWeekend) status = 'booked'; // weekend = penuh by default

    const slotIdx = d % 6;
    const slots = status === 'available' ? SLOT_PATTERN[slotIdx] || ALL_SLOTS.slice(0, 3) : [];

    days.push({ date: d, status, slots });
  }
  return days;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const MONTH_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const DAY_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function buildWALink(date: number, month: number, year: number, slot: string): string {
  const dateStr = `${date} ${MONTH_ID[month]} ${year}`;
  const msg = `Halo Yeka Studio! Saya mau request booking sesi foto pada:\nTanggal: ${dateStr}\nJam: ${slot} WIB\n\nBoleh dikonfirmasi ketersediaannya? Terima kasih.`;
  return `https://wa.me/6285952879644?text=${encodeURIComponent(msg)}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
interface DayCellProps {
  day: CalendarDay;
  isSelected: boolean;
  onClick: () => void;
}

function DayCell({ day, isSelected, onClick }: DayCellProps) {
  const { date, status } = day;

  const styleMap: Record<DayStatus, React.CSSProperties> = {
    available: {
      background: isSelected ? 'var(--maroon)' : 'white',
      color: isSelected ? 'white' : 'var(--charcoal)',
      border: `1.5px solid ${isSelected ? 'var(--maroon)' : 'rgba(123,28,42,0.2)'}`,
      cursor: 'pointer',
      fontWeight: 600,
    },
    booked: {
      background: 'rgba(0,0,0,0.04)',
      color: 'rgba(44,40,40,0.3)',
      border: '1.5px solid rgba(0,0,0,0.06)',
      cursor: 'not-allowed',
      textDecoration: 'line-through',
    },
    pending: {
      background: 'rgba(201,169,75,0.12)',
      color: 'rgba(150,110,20,0.9)',
      border: '1.5px solid rgba(201,169,75,0.35)',
      cursor: 'not-allowed',
    },
    past: {
      background: 'transparent',
      color: 'rgba(44,40,40,0.2)',
      border: '1.5px solid transparent',
      cursor: 'default',
    },
    empty: {
      background: 'transparent',
      border: '1.5px solid transparent',
      cursor: 'default',
    },
  };

  return (
    <div
      onClick={status === 'available' ? onClick : undefined}
      title={status === 'available' ? 'Klik untuk lihat slot jam' : status === 'booked' ? 'Sudah penuh' : status === 'pending' ? 'Menunggu konfirmasi' : ''}
      style={{
        aspectRatio: '1',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.82rem',
        transition: 'all 0.2s ease',
        position: 'relative',
        ...styleMap[status],
      }}
      onMouseEnter={e => {
        if (status === 'available' && !isSelected) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(123,28,42,0.08)';
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)';
        }
      }}
      onMouseLeave={e => {
        if (status === 'available' && !isSelected) {
          (e.currentTarget as HTMLElement).style.background = 'white';
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }
      }}
    >
      <span>{date}</span>
      {status === 'available' && (
        <span style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--maroon)',
          marginTop: '2px',
        }} />
      )}
      {status === 'pending' && (
        <span style={{ fontSize: '0.45rem', marginTop: '1px', letterSpacing: 0 }}>pending</span>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AvailabilitySection() {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const slotPanelRef = useRef<HTMLDivElement>(null);

  // Reset slot when date changes
  useEffect(() => { setSelectedSlot(null); }, [selectedDate]);

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

  // Scroll to slot panel on mobile when date selected
  useEffect(() => {
    if (selectedDate !== null && slotPanelRef.current) {
      setTimeout(() => {
        slotPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [selectedDate]);

  const calendarDays = useMemo(() => buildCalendar(viewYear, viewMonth), [viewYear, viewMonth]);

  // First weekday of the month (0=Sun)
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();

  // Navigate months (max 3 months ahead from today)
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);
  const canGoPrev = !(viewYear === today.getFullYear() && viewMonth === today.getMonth());
  const canGoNext = new Date(viewYear, viewMonth + 1, 1) < maxMonth;

  function goToPrev() {
    if (!canGoPrev) return;
    setSelectedDate(null);
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function goToNext() {
    if (!canGoNext) return;
    setSelectedDate(null);
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const selectedDayData = calendarDays.find(d => d.date === selectedDate);
  const waLink = selectedDate && selectedSlot
    ? buildWALink(selectedDate, viewMonth, viewYear, selectedSlot)
    : null;

  return (
    <section
      id="jadwal"
      ref={sectionRef}
      style={{
        background: 'var(--cream-dark)',
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
      }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* ── Section Header ── */}
        <div
          className="reveal-avail"
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
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
            marginBottom: '1rem',
            borderRadius: '2px',
          }}>
            Cek Ketersediaan
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 600,
            color: 'var(--charcoal)',
            lineHeight: 1.2,
            marginBottom: '0.75rem',
          }}>
            Pilih Tanggal &amp; Jadwalkan
          </h2>
          <div className="section-divider" />
          <p style={{
            fontSize: '1rem',
            color: 'var(--muted)',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.75,
            fontFamily: 'Inter, sans-serif',
          }}>
            Cek langsung slot yang masih kosong. Klik tanggal &rarr; pilih jam &rarr; langsung terhubung ke WhatsApp kami.
          </p>
        </div>

        {/* ── Calendar Card ── */}
        <div
          className="reveal-avail"
          style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
            border: '1px solid rgba(123,28,42,0.1)',
          }}
        >
          {/* Header Month Nav */}
          <div style={{
            background: 'var(--maroon)',
            color: 'white',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <button
              onClick={goToPrev}
              disabled={!canGoPrev}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: canGoPrev ? 'white' : 'rgba(255,255,255,0.3)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '1.1rem',
                cursor: canGoPrev ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={e => { if (canGoPrev) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; }}
              aria-label="Bulan sebelumnya"
            >
              ‹
            </button>

            <div style={{ textAlign: 'center' }}>
              <span className="font-display" style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}>
                {MONTH_ID[viewMonth]} {viewYear}
              </span>
              <div style={{
                fontSize: '0.68rem',
                color: '#C9A94B',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
                marginTop: '1px',
              }}>
                Jadwal Studio &amp; Outdoor
              </div>
            </div>

            <button
              onClick={goToNext}
              disabled={!canGoNext}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: canGoNext ? 'white' : 'rgba(255,255,255,0.3)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '1.1rem',
                cursor: canGoNext ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={e => { if (canGoNext) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; }}
              aria-label="Bulan berikutnya"
            >
              ›
            </button>
          </div>

          <div style={{ padding: '1.25rem 1rem 1rem' }}>
            {/* Day labels */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              marginBottom: '6px',
            }}>
              {DAY_SHORT.map(d => (
                <div key={d} style={{
                  textAlign: 'center',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: d === 'Min' || d === 'Sab' ? 'var(--muted)' : 'var(--charcoal)',
                  padding: '0.25rem 0',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'uppercase',
                }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
            }}>
              {/* Empty cells before first day */}
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <div key={`empty-${i}`} style={{ aspectRatio: '1' }} />
              ))}
              {/* Day cells */}
              {calendarDays.map((day) => (
                <DayCell
                  key={day.date}
                  day={day}
                  isSelected={selectedDate === day.date}
                  onClick={() => setSelectedDate(prev => prev === day.date ? null : day.date)}
                />
              ))}
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}>
              {[
                { color: 'white', border: 'rgba(123,28,42,0.25)', dot: 'var(--maroon)', label: 'Tersedia' },
                { color: 'rgba(0,0,0,0.04)', border: 'rgba(0,0,0,0.08)', dot: 'rgba(0,0,0,0.2)', label: 'Penuh' },
                { color: 'rgba(201,169,75,0.12)', border: 'rgba(201,169,75,0.4)', dot: 'rgba(150,110,20,0.7)', label: 'Pending' },
                { color: 'var(--maroon)', border: 'var(--maroon)', dot: 'white', label: 'Dipilih' },
              ].map(({ color, border, dot, label }) => (
                <div key={label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.72rem',
                  color: 'var(--muted)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    background: color,
                    border: `1.5px solid ${border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: dot }} />
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Slot Panel (slides in when date selected) ── */}
        <div
          ref={slotPanelRef}
          style={{
            marginTop: '1.5rem',
            maxHeight: selectedDate && selectedDayData?.status === 'available' ? '500px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {selectedDate && selectedDayData?.status === 'available' && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
              border: '1px solid rgba(123,28,42,0.1)',
            }}>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--maroon)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}>
                {selectedDate} {MONTH_ID[viewMonth]} {viewYear} — Pilih Jam:
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.6rem',
                marginBottom: '1.5rem',
              }}>
                {selectedDayData.slots.map((slot) => {
                  const isPickedSlot = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      id={`slot-${selectedDate}-${slot.replace('.', '')}`}
                      onClick={() => setSelectedSlot(prev => prev === slot ? null : slot)}
                      style={{
                        padding: '0.55rem 1.1rem',
                        borderRadius: '6px',
                        border: `1.5px solid ${isPickedSlot ? 'var(--maroon)' : 'rgba(123,28,42,0.2)'}`,
                        background: isPickedSlot ? 'var(--maroon)' : 'white',
                        color: isPickedSlot ? 'white' : 'var(--charcoal)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        letterSpacing: '0.04em',
                      }}
                      onMouseEnter={e => {
                        if (!isPickedSlot) {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(123,28,42,0.06)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--maroon)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isPickedSlot) {
                          (e.currentTarget as HTMLElement).style.background = 'white';
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(123,28,42,0.2)';
                        }
                      }}
                    >
                      {slot} WIB
                    </button>
                  );
                })}
              </div>

              {/* WA CTA — muncul setelah slot dipilih */}
              <div style={{
                maxHeight: selectedSlot ? '100px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.35s ease',
              }}>
                {selectedSlot && waLink && (
                  <a
                    href={waLink}
                    id="cta-booking-slot-wa"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      background: '#25D366',
                      color: 'white',
                      padding: '0.9rem 2rem',
                      borderRadius: '6px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
                      transition: 'all 0.25s ease',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(37,211,102,0.4)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(37,211,102,0.3)';
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Request Booking — {selectedDate} {MONTH_ID[viewMonth]}, {selectedSlot} WIB
                  </a>
                )}
              </div>

              {!selectedSlot && (
                <p style={{
                  fontSize: '0.78rem',
                  color: 'var(--muted)',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic',
                }}>
                  Pilih jam di atas untuk lanjut ke WhatsApp kami.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Note ── */}
        <div
          className="reveal-avail"
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          <p style={{
            fontSize: '0.78rem',
            color: 'var(--muted)',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.7,
          }}>
            Kalender ini menampilkan perkiraan ketersediaan. Konfirmasi final via WhatsApp.
          </p>
        </div>

      </div>
    </section>
  );
}
