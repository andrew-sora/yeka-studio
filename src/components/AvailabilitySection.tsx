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

// Generate slot data for current month
function buildCurrentMonthCalendar(): CalendarDay[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDate = today.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: CalendarDay[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const isPast = d < todayDate;
    const dayOfWeek = new Date(year, month, d).getDay();

    let slots: TimeSlot[] = [];

    if (isPast) {
      slots = [
        { time: '09.00', status: 'booked' },
        { time: '11.00', status: 'booked' },
        { time: '13.00', status: 'booked' },
        { time: '15.00', status: 'booked' },
      ];
    } else if (d % 5 === 0) {
      // Fully booked dates
      slots = [
        { time: '09.00', status: 'booked' },
        { time: '11.00', status: 'booked' },
        { time: '13.00', status: 'booked' },
        { time: '15.00', status: 'booked' },
      ];
    } else if (d % 2 === 0 || dayOfWeek === 0 || dayOfWeek === 6) {
      // Partially booked dates
      slots = [
        { time: '09.00', status: 'booked' },
        { time: '11.00', status: 'available' },
        { time: '13.00', status: d % 4 === 0 ? 'booked' : 'available' },
        { time: '15.00', status: 'available' },
      ];
    } else {
      // Fully available dates
      slots = [
        { time: '09.00', status: 'available' },
        { time: '11.00', status: 'available' },
        { time: '13.00', status: 'available' },
        { time: '15.00', status: 'available' },
      ];
    }

    // Derive date status from slots
    let dateStatus: DateAvailabilityStatus = 'fully_available';
    if (isPast) {
      dateStatus = 'past';
    } else {
      const availableCount = slots.filter(s => s.status === 'available').length;
      if (availableCount === 0) dateStatus = 'fully_booked';
      else if (availableCount < slots.length) dateStatus = 'partially_booked';
      else dateStatus = 'fully_available';
    }

    days.push({ date: d, dateStatus, slots });
  }

  return days;
}

export default function AvailabilitySection() {
  const today = new Date();
  const viewMonth = today.getMonth();
  const viewYear = today.getFullYear();

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('Paket Wisuda Outdoor');
  const [guestName, setGuestName] = useState<string>('');

  const sectionRef = useRef<HTMLDivElement>(null);
  const slotPanelRef = useRef<HTMLDivElement>(null);

  const calendarDays = useMemo(() => buildCurrentMonthCalendar(), []);
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const selectedDayData = calendarDays.find(d => d.date === selectedDate);

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

  // Scroll to slot panel when date selected
  useEffect(() => {
    if (selectedDate !== null && slotPanelRef.current) {
      setTimeout(() => {
        slotPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [selectedDate]);

  // Format WA pre-filled message per Section 5 requirement
  const waPrefilledLink = useMemo(() => {
    if (!selectedDate || !selectedSlot) return null;
    const dateStr = `${selectedDate} ${MONTH_ID[viewMonth]} ${viewYear}`;
    const nameStr = guestName.trim() || '[Nama Klien]';
    const msg = `Halo, saya ${nameStr}, mau booking paket ${selectedPackage} tanggal ${dateStr} jam ${selectedSlot} WIB`;
    return `https://wa.me/6285952879644?text=${encodeURIComponent(msg)}`;
  }, [selectedDate, selectedSlot, selectedPackage, guestName, viewMonth, viewYear]);

  return (
    <section
      id="jadwal"
      ref={sectionRef}
      style={{
        background: 'var(--cream)',
        padding: 'clamp(2.5rem, 5vw, 4rem) 1.25rem',
      }}
    >
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>

        {/* ── Section Header ── */}
        <div
          className="reveal-avail"
          style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
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
            marginBottom: '0.5rem',
            borderRadius: '2px',
          }}>
            Cek Ketersediaan
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.3rem)',
            fontWeight: 600,
            color: 'var(--charcoal)',
            lineHeight: 1.2,
            marginBottom: '0.5rem',
          }}>
            Pilih Tanggal &amp; Jadwalkan
          </h2>
          <div className="section-divider" />
          <p style={{
            fontSize: '0.88rem',
            color: 'var(--muted)',
            maxWidth: '460px',
            margin: '0 auto',
            lineHeight: 1.6,
            fontFamily: 'Inter, sans-serif',
          }}>
            Cek langsung slot kosong bulan ini. Klik tanggal &rarr; pilih jam &rarr; isi nama &rarr; terhubung ke WhatsApp kami.
          </p>
        </div>

        {/* ── Calendar Card (Compact View) ── */}
        <div
          className="reveal-avail"
          style={{
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
            border: '1px solid rgba(123,28,42,0.1)',
          }}
        >
          {/* Header Month Title */}
          <div style={{
            background: 'var(--maroon)',
            color: 'white',
            padding: '0.85rem 1rem',
            textAlign: 'center',
          }}>
            <div className="font-display" style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}>
              {MONTH_ID[viewMonth]} {viewYear}
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: '#C9A94B',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
              marginTop: '1px',
            }}>
              Jadwal Sesi Wisuda, Wedding &amp; Prewedding
            </div>
          </div>

          <div style={{ padding: '0.85rem 0.75rem 0.75rem' }}>
            {/* Day labels */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '3px',
              marginBottom: '4px',
            }}>
              {DAY_SHORT.map(d => (
                <div key={d} style={{
                  textAlign: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: d === 'Min' || d === 'Sab' ? 'var(--muted)' : 'var(--charcoal)',
                  padding: '0.2rem 0',
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
              {calendarDays.map((day) => {
                const isSelected = selectedDate === day.date;
                const isClickable = day.dateStatus === 'fully_available' || day.dateStatus === 'partially_booked';

                const cellStyle: React.CSSProperties = {
                  aspectRatio: '1',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  cursor: isClickable ? 'pointer' : 'not-allowed',
                };

                if (day.dateStatus === 'past') {
                  Object.assign(cellStyle, {
                    background: 'transparent',
                    color: 'rgba(44,40,40,0.2)',
                    border: '1.5px solid transparent',
                  });
                } else if (day.dateStatus === 'fully_booked') {
                  Object.assign(cellStyle, {
                    background: 'rgba(0,0,0,0.04)',
                    color: 'rgba(44,40,40,0.3)',
                    border: '1.5px solid rgba(0,0,0,0.06)',
                    textDecoration: 'line-through',
                  });
                } else if (day.dateStatus === 'partially_booked') {
                  Object.assign(cellStyle, {
                    background: isSelected ? 'var(--maroon)' : 'rgba(201,169,75,0.12)',
                    color: isSelected ? 'white' : 'var(--charcoal)',
                    border: `1.5px solid ${isSelected ? 'var(--maroon)' : 'rgba(201,169,75,0.5)'}`,
                  });
                } else {
                  // fully_available
                  Object.assign(cellStyle, {
                    background: isSelected ? 'var(--maroon)' : 'white',
                    color: isSelected ? 'white' : 'var(--charcoal)',
                    border: `1.5px solid ${isSelected ? 'var(--maroon)' : 'rgba(123,28,42,0.2)'}`,
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

                    {day.dateStatus === 'partially_booked' && (
                      <span style={{
                        fontSize: '0.5rem',
                        fontWeight: 500,
                        color: isSelected ? 'rgba(255,255,255,0.9)' : '#B48418',
                        marginTop: '1px',
                        letterSpacing: 0,
                      }}>
                        Terbatas
                      </span>
                    )}

                    {day.dateStatus === 'fully_available' && (
                      <span style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--maroon)',
                        marginTop: '2px',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex',
              gap: '1.25rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}>
              {[
                { color: 'white', border: 'rgba(123,28,42,0.25)', label: 'Tersedia Penuh' },
                { color: 'rgba(201,169,75,0.15)', border: 'rgba(201,169,75,0.5)', label: 'Slot Terbatas (Clickable)' },
                { color: 'rgba(0,0,0,0.04)', border: 'rgba(0,0,0,0.08)', label: 'Fully Booked (Non-Clickable)' },
              ].map(({ color, border, label }) => (
                <div key={label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.72rem',
                  color: 'var(--muted)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '3px',
                    background: color,
                    border: `1.5px solid ${border}`,
                  }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Slot Breakdown & Guest Flow Booking Form ── */}
        <div
          ref={slotPanelRef}
          style={{
            marginTop: '1.5rem',
            maxHeight: selectedDate && selectedDayData?.dateStatus !== 'fully_booked' ? '600px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {selectedDate && selectedDayData && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
              border: '1px solid rgba(123,28,42,0.1)',
            }}>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--maroon)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}>
                {selectedDate} {MONTH_ID[viewMonth]} {viewYear} — Pilih Jam Sesi:
              </div>

              {/* Time Slots Grid */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.6rem',
                marginBottom: '1.5rem',
              }}>
                {selectedDayData.slots.map((slotItem) => {
                  const isAvailable = slotItem.status === 'available';
                  const isPicked = selectedSlot === slotItem.time;

                  return (
                    <button
                      key={slotItem.time}
                      disabled={!isAvailable}
                      onClick={isAvailable ? () => setSelectedSlot(prev => prev === slotItem.time ? null : slotItem.time) : undefined}
                      style={{
                        padding: '0.55rem 1.1rem',
                        borderRadius: '6px',
                        border: `1.5px solid ${
                          !isAvailable ? 'rgba(0,0,0,0.08)' :
                          isPicked ? 'var(--maroon)' : 'rgba(123,28,42,0.2)'
                        }`,
                        background: !isAvailable ? 'rgba(0,0,0,0.04)' : isPicked ? 'var(--maroon)' : 'white',
                        color: !isAvailable ? 'rgba(0,0,0,0.3)' : isPicked ? 'white' : 'var(--charcoal)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        textDecoration: !isAvailable ? 'line-through' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {slotItem.time} WIB {!isAvailable && '(Terisi)'}
                    </button>
                  );
                })}
              </div>

              {/* Guest Form (appears when slot selected) */}
              {selectedSlot && (
                <div style={{
                  borderTop: '1px solid rgba(123,28,42,0.1)',
                  paddingTop: '1.25rem',
                  marginTop: '1rem',
                }}>
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--charcoal)',
                    marginBottom: '1rem',
                  }}>
                    Lengkapi Detail Booking (Guest Flow):
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontFamily: 'Inter, sans-serif',
                        color: 'var(--muted)',
                        marginBottom: '0.3rem',
                        fontWeight: 500,
                      }}>
                        Nama Pemesan:
                      </label>
                      <input
                        type="text"
                        placeholder="Masukkan nama Anda..."
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.9rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(123,28,42,0.2)',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.85rem',
                          color: 'var(--charcoal)',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontFamily: 'Inter, sans-serif',
                        color: 'var(--muted)',
                        marginBottom: '0.3rem',
                        fontWeight: 500,
                      }}>
                        Paket Foto Terpilih:
                      </label>
                      <select
                        value={selectedPackage}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.9rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(123,28,42,0.2)',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.85rem',
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
                      Request Booking — Kirim Pesan ke WhatsApp
                    </a>
                  )}
                </div>
              )}

              {!selectedSlot && (
                <p style={{
                  fontSize: '0.78rem',
                  color: 'var(--muted)',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic',
                }}>
                  Pilih jam di atas untuk melanjutkan ke pengisian nama &amp; WhatsApp.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Note */}
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
            Kalender ini menampilkan ketersediaan bulan berjalan. Konfirmasi final via WhatsApp.
          </p>
        </div>

      </div>
    </section>
  );
}
