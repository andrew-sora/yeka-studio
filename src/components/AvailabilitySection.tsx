'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { trackEvent } from '@/lib/analytics';

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

function formatRupiah(input: string): string {
  if (!input) return '';
  const rawNumbers = input.replace(/[^0-9]/g, '');
  if (!rawNumbers) return '';
  const formattedNumber = new Intl.NumberFormat('id-ID').format(parseInt(rawNumbers, 10));
  return `Rp ${formattedNumber}`;
}

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
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [submittedAttempt, setSubmittedAttempt] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [availablePackages, setAvailablePackages] = useState<{ title: string; price: string }[]>([
    { title: 'Wisuda Outdoor', price: 'Rp 450.000' },
    { title: 'Wisuda Indoor', price: 'Rp 550.000' },
    { title: 'Wisuda Studio', price: 'Rp 650.000' },
    { title: 'Wisuda All-In', price: 'Rp 950.000' },
    { title: 'Prewedding Studio Adat Jawa', price: 'Rp 1.850.000' },
    { title: 'Prewedding Outdoor Scenic', price: 'Rp 2.250.000' },
    { title: 'Intimate Wedding Coverage', price: 'Rp 4.500.000' },
  ]);

  useEffect(() => {
    const loadPkgs = () => {
      try {
        const stored = localStorage.getItem('yeka_package_overrides');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const formatted = parsed.map((p: any) => ({
              title: p.title,
              price: formatRupiah(p.price),
            }));
            setAvailablePackages(formatted);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadPkgs();
    window.addEventListener('storage', loadPkgs);
    window.addEventListener('yekaPackageUpdated', loadPkgs);
    return () => {
      window.removeEventListener('storage', loadPkgs);
      window.removeEventListener('yekaPackageUpdated', loadPkgs);
    };
  }, []);

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
    setValidationError(null);
  };

  // Listen to selectPackage custom event from pricing cards
  useEffect(() => {
    const handleSelectPackage = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedPackage(customEvent.detail);
        if (validationError) setValidationError(null);
      }
    };
    window.addEventListener('selectPackage', handleSelectPackage);
    return () => window.removeEventListener('selectPackage', handleSelectPackage);
  }, [validationError]);

  // Reset slot when date changes
  useEffect(() => {
    setSelectedSlot(null);
    setValidationError(null);
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

  const handleBookingSubmit = () => {
    setSubmittedAttempt(true);

    const missing: string[] = [];
    if (!selectedSlot) missing.push('Slot Jam');
    if (!guestName.trim()) missing.push('Nama Pemesan');
    if (!selectedPackage.trim()) missing.push('Paket Foto');

    if (missing.length > 0) {
      setValidationError(`Mohon lengkapi opsi wajib berikut: ${missing.join(', ')}.`);
      return;
    }

    setValidationError(null);

    const dateStr = `${selectedDate} ${MONTH_ID[viewMonth]} ${viewYear}`;
    const nameStr = guestName.trim();
    const msg = `Halo, saya ${nameStr}, mau booking paket ${selectedPackage} untuk tanggal ${dateStr} jam ${selectedSlot} WIB.`;

    trackEvent('whatsapp_click', {
      source: 'availability_calendar',
      package_title: selectedPackage,
      slot_date: dateStr,
      slot_time: selectedSlot || undefined,
      guest_name: nameStr,
    });

    const waUrl = `https://wa.me/6285952879644?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="jadwal"
      ref={sectionRef}
      style={{
        background: 'var(--cream)',
        padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(0.75rem, 2.5vw, 1.25rem)',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

        {/* ── Section Header ── */}
        <div
          className="reveal-avail"
          style={{
            textAlign: 'left',
            marginBottom: '2rem',
            maxWidth: '560px',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          <div style={{
            display: 'inline-block',
            background: 'rgba(123,28,42,0.08)',
            color: 'var(--maroon)',
            padding: '0.3rem 0.85rem',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            marginBottom: '0.6rem',
            borderRadius: '2px',
          }}>
            Cek Ketersediaan
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
            fontWeight: 600,
            color: 'var(--charcoal)',
            lineHeight: 1.15,
            marginBottom: '0.5rem',
          }}>
            Jadwal Sesi Foto
          </h2>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--muted)',
            lineHeight: 1.6,
            fontFamily: 'Inter, sans-serif',
          }}>
            Pilih tanggal di kalender untuk melihat ketersediaan slot jam. Amankan tanggal pilihanmu lebih awal sebelum terisi.
          </p>
        </div>

        {/* ── 3-Step Guided Booking Progress Indicator (Mobile-first compact 3-column bar) ── */}
        <div
          className="reveal-avail avail-stepper-container"
          style={{
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          {[
            {
              step: 'Tanggal',
              desc: selectedDate ? `${selectedDate} ${MONTH_ID[viewMonth].slice(0, 3)}` : 'Pilih Hari',
              active: true,
              done: !!selectedDate,
            },
            {
              step: 'Jam',
              desc: selectedSlot ? `${selectedSlot.split(' - ')[0]}` : selectedDate ? 'Pilih Jam' : 'Menunggu',
              active: !!selectedDate,
              done: !!selectedSlot,
            },
            {
              step: 'Booking',
              desc: selectedSlot ? 'Siap Kirim' : 'Kirim WA',
              active: !!selectedSlot,
              done: false,
            },
          ].map((s, i) => (
            <div
              key={i}
              className="avail-stepper-item"
              style={{
                background: 'white',
                border: s.done ? '1.5px solid #16A34A' : s.active ? '1.5px solid var(--maroon)' : '1px solid rgba(123,28,42,0.1)',
                padding: '0.6rem 0.85rem',
                borderRadius: '6px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                boxShadow: s.active ? '0 2px 8px rgba(123,28,42,0.06)' : 'none',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: s.done ? '#16A34A' : s.active ? 'var(--maroon)' : 'rgba(123,28,42,0.1)',
                  color: s.active || s.done ? 'white' : 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {s.done ? '✓' : i + 1}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
              }}>
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: s.done ? '#15803D' : s.active ? 'var(--maroon)' : 'var(--charcoal)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {s.step}
                </span>
                <span
                  className="avail-stepper-desc"
                  style={{
                    fontSize: '0.72rem',
                    color: s.done ? '#15803D' : 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                  }}
                >
                  • {s.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Calendar & Booking Layout (Mobile-first stacked -> Desktop 2-col) ── */}
        <div
          className="reveal-avail avail-main-grid"
          style={{
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
              padding: 'clamp(1rem, 2.5vw, 1.5rem)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              border: '1px solid rgba(123,28,42,0.08)',
              width: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            {/* Header: Month Title with Navigation Arrows & Legend */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '1.25rem',
              width: '100%',
            }}>
              {/* Month Navigation Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <button
                  onClick={() => changeMonth(-1)}
                  disabled={monthOffset === 0}
                  aria-label="Bulan sebelumnya"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(123,28,42,0.2)',
                    background: monthOffset === 0 ? 'rgba(0,0,0,0.04)' : 'white',
                    color: monthOffset === 0 ? '#CBD5E1' : 'var(--maroon)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: monthOffset === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '1.1rem',
                    transition: 'all 0.2s ease',
                    boxShadow: monthOffset === 0 ? 'none' : '0 2px 6px rgba(0,0,0,0.05)',
                    flexShrink: 0,
                  }}
                >
                  &#8249;
                </button>

                <div className="font-display" style={{
                  fontSize: 'clamp(1.15rem, 3.5vw, 1.35rem)',
                  fontWeight: 700,
                  color: 'var(--charcoal)',
                  textAlign: 'center',
                  flex: 1,
                  padding: '0 0.5rem',
                }}>
                  {MONTH_ID[viewMonth]} {viewYear}
                </div>

                <button
                  onClick={() => changeMonth(1)}
                  disabled={monthOffset >= 6}
                  aria-label="Bulan berikutnya"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--maroon)',
                    background: monthOffset >= 6 ? 'rgba(0,0,0,0.04)' : 'var(--maroon)',
                    color: monthOffset >= 6 ? '#CBD5E1' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: monthOffset >= 6 ? 'not-allowed' : 'pointer',
                    fontSize: '1.1rem',
                    transition: 'all 0.2s ease',
                    boxShadow: monthOffset >= 6 ? 'none' : '0 2px 10px rgba(123,28,42,0.3)',
                    flexShrink: 0,
                  }}
                >
                  &#8250;
                </button>
              </div>

              {/* Inline Legend Track */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.85rem',
                fontSize: '0.72rem',
                fontFamily: 'Inter, sans-serif',
                color: 'var(--muted)',
                fontWeight: 500,
                width: '100%',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A' }} />
                  Tersedia
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CA8A04' }} />
                  Terbatas
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626' }} />
                  Penuh
                </span>
              </div>
            </div>

            {/* Day labels (Strict 7 equal columns with minmax(0, 1fr)) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              gap: '3px',
              marginBottom: '0.5rem',
              width: '100%',
            }}>
              {DAY_SHORT.map(d => (
                <div key={d} style={{
                  textAlign: 'center',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  color: d === 'Min' || d === 'Sab' ? 'var(--maroon)' : 'var(--charcoal)',
                  padding: '0.25rem 0',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Days Grid (Strict 7 equal columns, no horizontal overflow) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              gap: '3px',
              width: '100%',
            }}>
              {/* Empty cells before first day */}
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <div key={`empty-${i}`} style={{ width: '100%', aspectRatio: '1' }} />
              ))}

              {/* Day cells */}
              {calendarDays.map((day) => {
                const isSelected = selectedDate === day.date;
                const isClickable = day.dateStatus === 'fully_available' || day.dateStatus === 'partially_booked';

                const cellStyle: React.CSSProperties = {
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'clamp(0.78rem, 2.6vw, 0.95rem)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  fontWeight: isSelected ? 700 : 500,
                  fontFamily: 'Inter, sans-serif',
                  cursor: isClickable ? 'pointer' : 'not-allowed',
                  boxSizing: 'border-box',
                  padding: 0,
                };

                if (isSelected) {
                  Object.assign(cellStyle, {
                    background: 'var(--maroon)',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(123,28,42,0.35)',
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
                    background: '#F8FAFC',
                    color: '#94A3B8',
                    border: '1px solid #E2E8F0',
                    textDecoration: 'line-through',
                  });
                } else if (day.dateStatus === 'partially_booked') {
                  Object.assign(cellStyle, {
                    background: 'white',
                    color: 'var(--charcoal)',
                    border: '1.5px solid #CA8A04',
                  });
                } else {
                  // fully_available
                  Object.assign(cellStyle, {
                    background: 'white',
                    color: 'var(--charcoal)',
                    border: '1px solid rgba(0,0,0,0.1)',
                  });
                }

                return (
                  <div
                    key={day.date}
                    onClick={isClickable ? () => {
                      const newDate = selectedDate === day.date ? null : day.date;
                      setSelectedDate(newDate);
                      if (newDate && window.innerWidth < 768 && slotPanelRef.current) {
                        setTimeout(() => {
                          slotPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 100);
                      }
                    } : undefined}
                    title={
                      day.dateStatus === 'fully_available' ? 'Tersedia Penuh (Klik untuk pilih jam)' :
                      day.dateStatus === 'partially_booked' ? 'Slot Terbatas (Klik untuk pilih jam)' :
                      day.dateStatus === 'fully_booked' ? 'Sudah Terisi Penuh (Tidak dapat dipilih)' : ''
                    }
                    style={cellStyle}
                  >
                    <span>{day.date}</span>

                    {/* Dot indicator underneath number */}
                    {day.dateStatus === 'fully_available' && (
                      <span style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: isSelected ? 'white' : '#16A34A',
                        marginTop: '2px',
                      }} />
                    )}

                    {day.dateStatus === 'partially_booked' && (
                      <span style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: isSelected ? 'white' : '#CA8A04',
                        marginTop: '2px',
                      }} />
                    )}

                    {day.dateStatus === 'fully_booked' && (
                      <span style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#DC2626',
                        marginTop: '2px',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Calendar Studio Policy Footer */}
            <div style={{
              marginTop: '0.85rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(123,28,42,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: 'var(--muted)',
              fontFamily: 'Inter, sans-serif',
            }}>
              <span>Operasional: 08.00 - 17.00 WIB</span>
              <span style={{ color: 'var(--maroon)', fontWeight: 600 }}>Studio &amp; Outdoor</span>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Slot Details & Booking Panel ── */}
          <div
            ref={slotPanelRef}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: 'clamp(1rem, 2.5vw, 1.5rem)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              border: '1px solid rgba(123,28,42,0.08)',
              width: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
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
                    padding: '2.5rem 1.25rem',
                    textAlign: 'center',
                    background: 'rgba(123,28,42,0.02)',
                    borderRadius: '12px',
                    border: '1px dashed rgba(123,28,42,0.15)',
                    marginTop: '0.75rem',
                  }}>
                    <div style={{
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: 'var(--maroon)',
                      fontFamily: 'Inter, sans-serif',
                      marginBottom: '0.35rem',
                    }}>
                      Pilih Tanggal Sesi
                    </div>
                    <div style={{
                      fontSize: '0.82rem',
                      color: 'var(--muted)',
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: 1.5,
                      maxWidth: '280px',
                      margin: '0 auto',
                    }}>
                      Klik salah satu tanggal berwarna hijau atau kuning pada kalender untuk melihat slot jam yang tersedia.
                    </div>
                  </div>
                )}
              </div>

              {/* Time Slot List Rows (Clean 2-Column Grid) */}
              {selectedDate && selectedDayData && (
                <div>
                  <div style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: submittedAttempt && !selectedSlot ? '#DC2626' : 'var(--muted)',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    marginBottom: '0.6rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span>SLOT JAM <span style={{ color: '#DC2626' }}>*</span></span>
                    {submittedAttempt && !selectedSlot && (
                      <span style={{ color: '#DC2626', textTransform: 'none', fontSize: '0.65rem' }}>
                        (Wajib Dipilih)
                      </span>
                    )}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.45rem',
                    marginBottom: '1rem',
                    padding: submittedAttempt && !selectedSlot ? '0.35rem' : '0',
                    borderRadius: '10px',
                    border: submittedAttempt && !selectedSlot ? '1.5px dashed #FCA5A5' : 'none',
                    background: submittedAttempt && !selectedSlot ? '#FEF2F2' : 'transparent',
                  }}>
                    {selectedDayData.slots.map((slotItem) => {
                      const isAvailable = slotItem.status === 'available';
                      const isPicked = selectedSlot === slotItem.time;

                      return (
                        <div
                          key={slotItem.time}
                          onClick={isAvailable ? () => {
                            setSelectedSlot(prev => prev === slotItem.time ? null : slotItem.time);
                            if (validationError) setValidationError(null);
                          } : undefined}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.55rem 0.65rem',
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
                            fontSize: '0.78rem',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            color: isPicked ? 'white' : isAvailable ? 'var(--charcoal)' : 'rgba(44,40,40,0.35)',
                            textDecoration: !isAvailable ? 'line-through' : 'none',
                          }}>
                            {slotItem.time}
                          </span>

                          <span style={{
                            fontSize: '0.62rem',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            color: isPicked ? 'white' : isAvailable ? '#15803D' : '#B91C1C',
                          }}>
                            {isAvailable ? 'ADA' : 'PENUH'}
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
                      color: submittedAttempt && !guestName.trim() ? '#DC2626' : 'var(--muted)',
                      marginBottom: '0.25rem',
                      fontWeight: 600,
                    }}>
                      Nama Pemesan <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Anda (Wajib)..."
                      value={guestName}
                      onChange={(e) => {
                        setGuestName(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        border: submittedAttempt && !guestName.trim() ? '1.5px solid #DC2626' : '1px solid rgba(123,28,42,0.2)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.8rem',
                        color: 'var(--charcoal)',
                        outline: 'none',
                        background: submittedAttempt && !guestName.trim() ? '#FEF2F2' : 'white',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.7rem',
                      fontFamily: 'Inter, sans-serif',
                      color: submittedAttempt && !selectedPackage.trim() ? '#DC2626' : 'var(--muted)',
                      marginBottom: '0.25rem',
                      fontWeight: 600,
                    }}>
                      Paket Foto Terpilih <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <select
                      value={selectedPackage}
                      onChange={(e) => {
                        setSelectedPackage(e.target.value);
                        if (validationError) setValidationError(null);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        border: submittedAttempt && !selectedPackage.trim() ? '1.5px solid #DC2626' : '1px solid rgba(123,28,42,0.2)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.8rem',
                        color: selectedPackage ? 'var(--charcoal)' : 'rgba(44,40,40,0.5)',
                        background: submittedAttempt && !selectedPackage.trim() ? '#FEF2F2' : 'white',
                        outline: 'none',
                      }}
                    >
                      <option value="" disabled>-- Pilih Paket Foto (Wajib) --</option>
                      {availablePackages.map((pkg, idx) => (
                        <option key={idx} value={pkg.title}>
                          {pkg.title} ({formatRupiah(pkg.price)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {validationError && (
                  <div style={{
                    background: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    color: '#991B1B',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontWeight: 500,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Transparent Booking Flow Explanation */}
                <div style={{
                  background: 'rgba(123, 28, 42, 0.04)',
                  border: '1px solid rgba(123, 28, 42, 0.12)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  marginBottom: '1rem',
                  fontSize: '0.74rem',
                  color: 'var(--muted)',
                  lineHeight: 1.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  <span style={{ color: 'var(--maroon)', fontSize: '0.9rem', flexShrink: 0, marginTop: '-1px' }}>ℹ</span>
                  <span>
                    <strong>Langkah selanjutnya:</strong> Detail pilihan Anda akan langsung disusun ke format pesan WhatsApp. Admin Yeka Studio akan memverifikasi ketersediaan dan panduan DP. Slot resmi terkunci setelah konfirmasi Admin.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleBookingSubmit}
                  id="cta-booking-slot-wa"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    textAlign: 'center',
                    background: '#25D366',
                    color: 'white',
                    padding: '0.95rem 1.25rem',
                    minHeight: '48px',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(37, 211, 102, 0.35)',
                    transition: 'all 0.25s ease',
                    width: '100%',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = '#1EBE5D';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = '#25D366';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>Request Booking via WhatsApp</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
