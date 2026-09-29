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

interface PackageData {
  id: string;
  category: 'wisuda' | 'wedding';
  title: string;
  price: string;
  desc: string;
  badge?: string;
  featured?: boolean;
  features: string[];
}

interface PhotoData {
  id: string;
  category: 'wisuda' | 'wedding';
  src: string;
  title: string;
  tag: string;
  alt?: string;
}

const DEFAULT_PACKAGES: PackageData[] = [
  {
    id: 'wisuda-outdoor',
    category: 'wisuda',
    title: 'Wisuda Outdoor',
    price: 'Rp 450.000',
    desc: 'Sesi candid outdoor area kampus Jogja/Solo',
    featured: true,
    badge: 'Terfavorit',
    features: [
      'Durasi 1,5 Jam Photoshoot',
      'ALL File Mentah (Drive H+1)',
      '15 Foto Color Graded Master',
      'Bebas Bawa s/d 5 Orang (Ortu/Bestie)',
    ],
  },
  {
    id: 'wisuda-indoor',
    category: 'wisuda',
    title: 'Wisuda Indoor',
    price: 'Rp 550.000',
    desc: 'Sesi indoor spot, hall kampus & cafe',
    featured: false,
    features: [
      'Durasi 1,5 Jam Photoshoot',
      'ALL File Mentah (Drive H+1)',
      '20 Foto Color Graded Master',
      'Spot Hall Kampus, Cafe & Indoor',
    ],
  },
  {
    id: 'wisuda-studio',
    category: 'wisuda',
    title: 'Wisuda Studio',
    price: 'Rp 650.000',
    desc: 'Studio setup lighting eksklusif Yeka',
    featured: false,
    features: [
      'Durasi 2 Jam Studio Session',
      'ALL File Mentah (Drive H+1)',
      '25 Foto Color Graded Master',
      'Cetak 1 Foto 10R + Frame Kayu',
    ],
  },
  {
    id: 'wisuda-all',
    category: 'wisuda',
    title: 'Wisuda All-In',
    price: 'Rp 950.000',
    desc: 'Kombinasi Studio + Outdoor Campus Shoot',
    featured: false,
    features: [
      'Durasi 3 Jam (Studio + Outdoor)',
      'ALL File Mentah (Drive H+1)',
      '40 Foto Color Graded Master',
      'Cetak 2 Foto 10R + Frame Kayu',
    ],
  },
  {
    id: 'wedding-adat',
    category: 'wedding',
    title: 'Prewedding Studio Adat Jawa',
    price: 'Rp 1.850.000',
    desc: 'Studio tirai merah, busana & makeup adat Jawa lengkap',
    featured: false,
    features: [
      'Include Busana & Makeup Adat Jawa',
      'Private Studio Tirai Merah Classical',
      'ALL File Mentah (Drive H+1)',
      '25 Foto Master Retouched & Edit',
      '1 Cetak Canvas Frame 40x60cm',
    ],
  },
  {
    id: 'wedding-outdoor',
    category: 'wedding',
    title: 'Prewedding Outdoor Scenic',
    price: 'Rp 2.250.000',
    desc: 'Lokasi outdoor Jogja/Solo + dokumentasi video reel',
    featured: true,
    badge: 'Paling Populer',
    features: [
      '2 Lokasi Outdoor Scenic (Jogja/Solo)',
      'ALL File Mentah (Drive H+1)',
      '35 Foto Master Retouched & Edit',
      'Video Cinematic Reel Full HD 60d',
      '1 Cetak Canvas Frame 40x60cm',
    ],
  },
  {
    id: 'wedding-intimate',
    category: 'wedding',
    title: 'Intimate Wedding Coverage',
    price: 'Rp 4.500.000',
    desc: 'Full-day coverage akad & resepsi + album cetak eksklusif',
    featured: false,
    badge: 'Lengkap & All-In',
    features: [
      'Full-Day Coverage Akad & Resepsi',
      'ALL File Mentah Flashdisk Box Kayu Yeka',
      '50 Foto Master Color Graded',
      'Album Photobook Hardcover Kulit 20 Hal',
      '1 Cetak Canvas 50x70cm + Frame Premium',
      'Video Cinematic Highlight Wedding 1-3 m',
    ],
  },
];

const DEFAULT_PHOTOS: PhotoData[] = [
  { id: 'wisuda-1', category: 'wisuda', src: '/images/wisuda-1.jpg', title: 'Outdoor Campus Shoot', tag: 'Area Jogja & Solo', alt: 'Foto wisuda outdoor campus Jogja' },
  { id: 'wisuda-2', category: 'wisuda', src: '/images/wisuda-2.jpg', title: 'Candid & Natural', tag: 'UGM Balairung', alt: 'Wisuda UGM candid joyful' },
  { id: 'wisuda-3', category: 'wisuda', src: '/images/wisuda-3.jpg', title: 'Celebration Moment', tag: 'Kampus Outdoor', alt: 'Wisuda melempar toga celebration' },
  { id: 'wisuda-4', category: 'wisuda', src: '/images/wisuda-4.jpg', title: 'Portrait Elegan', tag: 'Spot Classical', alt: 'Portrait wisuda elegan' },
  { id: 'wisuda-5', category: 'wisuda', src: '/images/wisuda-5.jpg', title: 'Sahabat & Bestie', tag: 'Group Shoot', alt: 'Foto wisuda bersama sahabat' },
  { id: 'wisuda-6', category: 'wisuda', src: '/images/wisuda-6.jpg', title: 'Botanical Session', tag: 'Garden Aesthetic', alt: 'Wisuda outdoor botanical garden' },

  { id: 'wedding-1', category: 'wedding', src: '/images/wedding-1.jpg', title: 'Studio Adat Jawa', tag: 'Signature Setup', alt: 'Foto wedding adat Jawa studio Jogja' },
  { id: 'wedding-2', category: 'wedding', src: '/images/wedding-2.jpg', title: 'Classic Beskap & Kebaya', tag: 'Indoor Studio', alt: 'Prewedding kebaya merah maroon' },
  { id: 'wedding-3', category: 'wedding', src: '/images/wedding-3.jpg', title: 'Intimate Outdoor', tag: 'Garden Prewedding', alt: 'Foto engagement outdoor garden' },
  { id: 'wedding-4', category: 'wedding', src: '/images/wedding-4.jpg', title: 'Kebaya Modern', tag: 'Editorial Look', alt: 'Portrait pengantin kebaya putih gold' },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'packages' | 'photos' | 'reviews'>('calendar');

  // Calendar State
  const today = useMemo(() => new Date(), []);
  const [monthOffset, setMonthOffset] = useState(0);
  const targetDate = useMemo(() => new Date(today.getFullYear(), today.getMonth() + monthOffset, 1), [today, monthOffset]);
  const viewYear = targetDate.getFullYear();
  const viewMonth = targetDate.getMonth();

  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [overrides, setOverrides] = useState<Record<string, SlotOverride>>({});
  const [savedSuccessToast, setSavedSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Package Management State
  const [packages, setPackages] = useState<PackageData[]>(DEFAULT_PACKAGES);
  const [selectedPkgId, setSelectedPkgId] = useState<string>('wisuda-outdoor');
  const [pkgCategoryInput, setPkgCategoryInput] = useState<'wisuda' | 'wedding'>('wisuda');
  const [pkgTitleInput, setPkgTitleInput] = useState('');
  const [pkgPriceInput, setPkgPriceInput] = useState('');
  const [pkgDescInput, setPkgDescInput] = useState('');
  const [pkgBadgeInput, setPkgBadgeInput] = useState('');
  const [pkgFeaturedInput, setPkgFeaturedInput] = useState(false);
  const [pkgFeaturesInput, setPkgFeaturesInput] = useState('');

  // Photo Portfolio Management State
  const [photos, setPhotos] = useState<PhotoData[]>(DEFAULT_PHOTOS);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>('wisuda-1');
  const [photoCategoryInput, setPhotoCategoryInput] = useState<'wisuda' | 'wedding'>('wisuda');
  const [photoSrcInput, setPhotoSrcInput] = useState('');
  const [photoTitleInput, setPhotoTitleInput] = useState('');
  const [photoTagInput, setPhotoTagInput] = useState('');
  const [photoAltInput, setPhotoAltInput] = useState('');

  // Check auth session on load
  useEffect(() => {
    const auth = sessionStorage.getItem('yeka_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load saved overrides from localStorage
  useEffect(() => {
    try {
      const storedSlots = localStorage.getItem('yeka_slot_overrides');
      if (storedSlots) setOverrides(JSON.parse(storedSlots));

      const storedPkgs = localStorage.getItem('yeka_package_overrides');
      if (storedPkgs) setPackages(JSON.parse(storedPkgs));

      const storedPhotos = localStorage.getItem('yeka_photo_overrides');
      if (storedPhotos) setPhotos(JSON.parse(storedPhotos));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync Package Edit Form when selected package changes
  useEffect(() => {
    const currentPkg = packages.find((p) => p.id === selectedPkgId) || packages[0];
    if (currentPkg) {
      setPkgCategoryInput(currentPkg.category);
      setPkgTitleInput(currentPkg.title);
      setPkgPriceInput(currentPkg.price);
      setPkgDescInput(currentPkg.desc);
      setPkgBadgeInput(currentPkg.badge || '');
      setPkgFeaturedInput(currentPkg.featured || false);
      setPkgFeaturesInput(currentPkg.features ? currentPkg.features.join('\n') : '');
    }
  }, [selectedPkgId, packages]);

  // Sync Photo Edit Form when selected photo changes
  useEffect(() => {
    const currentPhoto = photos.find((ph) => ph.id === selectedPhotoId) || photos[0];
    if (currentPhoto) {
      setPhotoCategoryInput(currentPhoto.category);
      setPhotoSrcInput(currentPhoto.src);
      setPhotoTitleInput(currentPhoto.title);
      setPhotoTagInput(currentPhoto.tag);
      setPhotoAltInput(currentPhoto.alt || '');
    }
  }, [selectedPhotoId, photos]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setSavedSuccessToast(true);
    setTimeout(() => setSavedSuccessToast(false), 2400);
  };

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
    const newBooked = isBooked
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
    showToast('✓ Status Slot Jam Berhasil Diperbarui!');
  };

  const setDayStatus = (status: 'fully_available' | 'partially_booked' | 'fully_booked') => {
    let booked: string[] = [];
    if (status === 'fully_booked') {
      booked = ['08.00 - 09.00', '09.00 - 10.00', '10.00 - 11.00', '13.00 - 14.00', '14.00 - 15.00', '15.00 - 16.00'];
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
    showToast('✓ Status Tanggal Berhasil Diperbarui!');
  };

  // ── PACKAGE MANAGEMENT HANDLERS ─────────────────────────────────────────────
  const handleAddNewPackage = () => {
    const newId = `pkg-${Date.now()}`;
    const newPkg: PackageData = {
      id: newId,
      category: 'wisuda',
      title: 'Paket Wisuda Baru',
      price: 'Rp 500.000',
      desc: 'Deskripsi paket baru Yeka Studio',
      featured: false,
      badge: '',
      features: ['Durasi 1,5 Jam Photoshoot', 'ALL File Mentah (Drive H+1)'],
    };
    const updated = [newPkg, ...packages];
    setPackages(updated);
    setSelectedPkgId(newId);
    localStorage.setItem('yeka_package_overrides', JSON.stringify(updated));
    showToast('✨ Paket Baru Ditambahkan! Silakan lengkapi detailnya.');
  };

  const handleDeletePackage = (idToDelete: string) => {
    if (packages.length <= 1) {
      alert('Minimal harus ada 1 paket di sistem.');
      return;
    }
    if (!confirm('Apakah Anda yakin ingin menghapus paket ini?')) return;

    const updated = packages.filter((p) => p.id !== idToDelete);
    setPackages(updated);
    setSelectedPkgId(updated[0].id);
    localStorage.setItem('yeka_package_overrides', JSON.stringify(updated));
    showToast('🗑️ Paket Berhasil Dihapus!');
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPkgs = packages.map((pkg) => {
      if (pkg.id === selectedPkgId) {
        return {
          ...pkg,
          category: pkgCategoryInput,
          title: pkgTitleInput.trim(),
          price: pkgPriceInput.trim(),
          desc: pkgDescInput.trim(),
          badge: pkgBadgeInput.trim(),
          featured: pkgFeaturedInput,
          features: pkgFeaturesInput.split('\n').map((f) => f.trim()).filter((f) => f.length > 0),
        };
      }
      return pkg;
    });

    setPackages(updatedPkgs);
    localStorage.setItem('yeka_package_overrides', JSON.stringify(updatedPkgs));
    showToast('✓ detail Paket Berhasil Disimpan & Live di Website!');
  };

  const handleResetPackages = () => {
    if (confirm('Kembalikan seluruh daftar paket ke tampilan default pabrik?')) {
      setPackages(DEFAULT_PACKAGES);
      setSelectedPkgId(DEFAULT_PACKAGES[0].id);
      localStorage.removeItem('yeka_package_overrides');
      showToast('🔄 Paket Berhasil Di-reset ke Default!');
    }
  };

  // ── PHOTO PORTFOLIO MANAGEMENT HANDLERS ────────────────────────────────────
  const handleAddNewPhoto = () => {
    const newId = `photo-${Date.now()}`;
    const newPhoto: PhotoData = {
      id: newId,
      category: 'wisuda',
      src: '/images/wisuda-1.jpg',
      title: 'Foto Portofolio Baru',
      tag: 'Kampus Outdoor',
      alt: 'Foto portofolio Yeka Creative Studio',
    };
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    setSelectedPhotoId(newId);
    localStorage.setItem('yeka_photo_overrides', JSON.stringify(updated));
    showToast('✨ Foto Baru Ditambahkan! Silakan atur URL & Judulnya.');
  };

  const handleDeletePhoto = (idToDelete: string) => {
    if (photos.length <= 1) {
      alert('Minimal harus ada 1 foto di portofolio.');
      return;
    }
    if (!confirm('Apakah Anda yakin ingin menghapus foto ini dari portofolio?')) return;

    const updated = photos.filter((ph) => ph.id !== idToDelete);
    setPhotos(updated);
    setSelectedPhotoId(updated[0].id);
    localStorage.setItem('yeka_photo_overrides', JSON.stringify(updated));
    showToast('🗑️ Foto Berhasil Dihapus!');
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPhotos = photos.map((ph) => {
      if (ph.id === selectedPhotoId) {
        return {
          ...ph,
          category: photoCategoryInput,
          src: photoSrcInput.trim(),
          title: photoTitleInput.trim(),
          tag: photoTagInput.trim(),
          alt: photoAltInput.trim() || photoTitleInput.trim(),
        };
      }
      return ph;
    });

    setPhotos(updatedPhotos);
    localStorage.setItem('yeka_photo_overrides', JSON.stringify(updatedPhotos));
    showToast('✓ Portofolio Foto Berhasil Disimpan & Live di Web!');
  };

  const handleResetPhotos = () => {
    if (confirm('Kembalikan seluruh galeri foto portofolio ke default awal?')) {
      setPhotos(DEFAULT_PHOTOS);
      setSelectedPhotoId(DEFAULT_PHOTOS[0].id);
      localStorage.removeItem('yeka_photo_overrides');
      showToast('🔄 Galeri Foto Berhasil Di-reset ke Default!');
    }
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
            Masukkan PIN rahasia Owner/Admin untuk mengelola jadwal, paket, foto portofolio &amp; ulasan.
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
      {/* Admin Header */}
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
          {toastMessage}
        </div>
      )}

      <main style={{ maxWidth: '1080px', margin: '2rem auto 0', padding: '0 1.25rem' }}>
        {/* Main Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(123,28,42,0.1)',
          paddingBottom: '0.5rem',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => setActiveTab('calendar')}
            style={{
              padding: '0.6rem 1.15rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'calendar' ? 'var(--maroon)' : 'transparent',
              color: activeTab === 'calendar' ? 'white' : 'var(--charcoal)',
              fontWeight: 600,
              fontSize: '0.83rem',
              cursor: 'pointer',
            }}
          >
            📅 Kelola Slot Jadwal
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            style={{
              padding: '0.6rem 1.15rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'packages' ? 'var(--maroon)' : 'transparent',
              color: activeTab === 'packages' ? 'white' : 'var(--charcoal)',
              fontWeight: 600,
              fontSize: '0.83rem',
              cursor: 'pointer',
            }}
          >
            💰 Kelola Paket &amp; Harga
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            style={{
              padding: '0.6rem 1.15rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'photos' ? 'var(--maroon)' : 'transparent',
              color: activeTab === 'photos' ? 'white' : 'var(--charcoal)',
              fontWeight: 600,
              fontSize: '0.83rem',
              cursor: 'pointer',
            }}
          >
            🖼️ Kelola Foto Portofolio
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '0.6rem 1.15rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'reviews' ? 'var(--maroon)' : 'transparent',
              color: activeTab === 'reviews' ? 'white' : 'var(--charcoal)',
              fontWeight: 600,
              fontSize: '0.83rem',
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

                {/* Days Grid */}
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

        {/* ── TAB 2: PACKAGES & PRICING MANAGER ── */}
        {activeTab === 'packages' && (
          <div>
            <div style={{
              background: 'white',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(123,28,42,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.25rem' }}>
                  Kelola Paket &amp; Harga (Wisuda &amp; Wedding)
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                  Ubah harga, deskripsi, poin inklusi, atau tambah/hapus paket secara instan tanpa koding.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleAddNewPackage}
                  style={{
                    background: 'var(--maroon)',
                    color: 'white',
                    border: 'none',
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ➕ Tambah Paket Baru
                </button>
                <button
                  onClick={handleResetPackages}
                  style={{
                    background: '#F1F5F9',
                    color: 'var(--charcoal)',
                    border: '1px solid #CBD5E1',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  🔄 Reset Default
                </button>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: '1.5rem',
            }}>
              {/* Package Selector List */}
              <div style={{
                background: 'white',
                borderRadius: '14px',
                padding: '1.25rem',
                border: '1px solid rgba(123,28,42,0.08)',
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--maroon)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  DAFTAR PAKET AKTIF ({packages.length}):
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {packages.map((pkg) => {
                    const isSelected = selectedPkgId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPkgId(pkg.id)}
                        style={{
                          padding: '0.75rem 0.95rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border: isSelected ? '2px solid var(--maroon)' : '1px solid rgba(0,0,0,0.08)',
                          background: isSelected ? 'rgba(123,28,42,0.06)' : 'white',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--charcoal)' }}>
                            {pkg.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--maroon)', fontWeight: 600, marginTop: '2px' }}>
                            {pkg.price} &bull; <span style={{ textTransform: 'capitalize', color: 'var(--muted)', fontWeight: 400 }}>{pkg.category}</span>
                          </div>
                        </div>

                        {pkg.featured && (
                          <span style={{
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            background: 'var(--gold)',
                            color: '#120305',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                          }}>
                            {pkg.badge || 'HOT'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Package Edit Form */}
              <div style={{
                background: 'white',
                borderRadius: '14px',
                padding: '1.25rem',
                border: '1px solid rgba(123,28,42,0.08)',
              }}>
                <form onSubmit={handleSavePackage}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--charcoal)' }}>
                      Edit Detail Paket
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeletePackage(selectedPkgId)}
                      style={{
                        background: '#FEE2E2',
                        color: '#991B1B',
                        border: '1px solid #F87171',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      🗑️ Hapus Paket Ini
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.25rem' }}>
                        KATEGORI PAKET *
                      </label>
                      <select
                        value={pkgCategoryInput}
                        onChange={(e) => setPkgCategoryInput(e.target.value as 'wisuda' | 'wedding')}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.75rem',
                          fontSize: '0.85rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(123,28,42,0.2)',
                          outline: 'none',
                          fontFamily: 'Inter, sans-serif',
                          background: 'white',
                        }}
                      >
                        <option value="wisuda">🎓 Wisuda</option>
                        <option value="wedding">💍 Wedding / Prewedding</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.25rem' }}>
                        BADGE LABEL (Opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Terfavorit, Promo"
                        value={pkgBadgeInput}
                        onChange={(e) => setPkgBadgeInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.75rem',
                          fontSize: '0.85rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(123,28,42,0.2)',
                          outline: 'none',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.25rem' }}>
                      NAMA / JUDUL PAKET *
                    </label>
                    <input
                      type="text"
                      required
                      value={pkgTitleInput}
                      onChange={(e) => setPkgTitleInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(123,28,42,0.2)',
                        outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.25rem' }}>
                      HARGA PAKET * (Contoh: Rp 450.000)
                    </label>
                    <input
                      type="text"
                      required
                      value={pkgPriceInput}
                      onChange={(e) => setPkgPriceInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(123,28,42,0.2)',
                        outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.25rem' }}>
                      DESKRIPSI SINGKAT PAKET
                    </label>
                    <input
                      type="text"
                      value={pkgDescInput}
                      onChange={(e) => setPkgDescInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(123,28,42,0.2)',
                        outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id="pkgFeatured"
                      checked={pkgFeaturedInput}
                      onChange={(e) => setPkgFeaturedInput(e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor="pkgFeatured" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--charcoal)', cursor: 'pointer' }}>
                      Tandai Sebagai Paket Unggulan (Highlight Border)
                    </label>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.25rem' }}>
                      RINCIAN CHECKLIST INKLUSI (1 Poin Per Baris):
                    </label>
                    <textarea
                      rows={5}
                      value={pkgFeaturesInput}
                      onChange={(e) => setPkgFeaturesInput(e.target.value)}
                      placeholder="Contoh:&#10;Durasi 1,5 Jam Photoshoot&#10;ALL File Mentah (Drive H+1)&#10;15 Foto Color Graded Master"
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(123,28,42,0.2)',
                        outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                        resize: 'vertical',
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
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    💾 Simpan Perubahan Paket Ini &rarr;
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: PHOTO PORTFOLIO MANAGER ── */}
        {activeTab === 'photos' && (
          <div>
            <div style={{
              background: 'white',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(123,28,42,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.25rem' }}>
                  Kelola Galeri Foto Portofolio
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                  Tambah foto hasil photoshoot terbaru, ganti URL foto, ubah judul/tag spot, atau hapus foto lama dari galeri web.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleAddNewPhoto}
                  style={{
                    background: 'var(--maroon)',
                    color: 'white',
                    border: 'none',
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ➕ Tambah Foto Baru
                </button>
                <button
                  onClick={handleResetPhotos}
                  style={{
                    background: '#F1F5F9',
                    color: 'var(--charcoal)',
                    border: '1px solid #CBD5E1',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  🔄 Reset Default
                </button>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: '1.5rem',
            }}>
              {/* Photo Selector & Preview List */}
              <div style={{
                background: 'white',
                borderRadius: '14px',
                padding: '1.25rem',
                border: '1px solid rgba(123,28,42,0.08)',
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--maroon)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  DAFTAR FOTO PORTOFOLIO ({photos.length}):
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '0.75rem',
                  maxHeight: '520px',
                  overflowY: 'auto',
                  paddingRight: '0.25rem',
                }}>
                  {photos.map((ph) => {
                    const isSelected = selectedPhotoId === ph.id;
                    return (
                      <div
                        key={ph.id}
                        onClick={() => setSelectedPhotoId(ph.id)}
                        style={{
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: isSelected ? '2.5px solid var(--maroon)' : '1px solid #E2E8F0',
                          cursor: 'pointer',
                          background: '#F8FAFC',
                          boxShadow: isSelected ? '0 4px 12px rgba(123,28,42,0.2)' : 'none',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                        }}
                      >
                        <div style={{ height: '90px', position: 'relative', overflow: 'hidden', background: '#2A080E' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ph.src}
                            alt={ph.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <span style={{
                            position: 'absolute',
                            top: '4px',
                            left: '4px',
                            fontSize: '0.55rem',
                            fontWeight: 700,
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '3px',
                            textTransform: 'capitalize',
                          }}>
                            {ph.category}
                          </span>
                        </div>
                        <div style={{ padding: '0.4rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--charcoal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ph.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Photo Edit Form */}
              <div style={{
                background: 'white',
                borderRadius: '14px',
                padding: '1.25rem',
                border: '1px solid rgba(123,28,42,0.08)',
              }}>
                <form onSubmit={handleSavePhoto}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--charcoal)' }}>
                      Edit Detail Foto
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(selectedPhotoId)}
                      style={{
                        background: '#FEE2E2',
                        color: '#991B1B',
                        border: '1px solid #F87171',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      🗑️ Hapus Foto Ini
                    </button>
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.25rem' }}>
                      KATEGORI FOTO *
                    </label>
                    <select
                      value={photoCategoryInput}
                      onChange={(e) => setPhotoCategoryInput(e.target.value as 'wisuda' | 'wedding')}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(123,28,42,0.2)',
                        outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                        background: 'white',
                      }}
                    >
                      <option value="wisuda">🎓 Wisuda (Masuk Galeri Wisuda)</option>
                      <option value="wedding">💍 Wedding (Masuk Galeri Wedding)</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.25rem' }}>
                      URL / PATH GAMBAR (`src`) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: /images/wisuda-1.jpg atau https://..."
                      value={photoSrcInput}
                      onChange={(e) => setPhotoSrcInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(123,28,42,0.2)',
                        outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    />
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '3px' }}>
                      Bisa menggunakan path lokal file di `/images/...` atau URL publik (Unsplash, Cloudinary, dll).
                    </div>
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.25rem' }}>
                      JUDUL / CAPTION FOTO *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: UGM Balairung Session"
                      value={photoTitleInput}
                      onChange={(e) => setPhotoTitleInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(123,28,42,0.2)',
                        outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.25rem' }}>
                      TAG LOKASI / KETERANGAN *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Area Jogja & Solo"
                      value={photoTagInput}
                      onChange={(e) => setPhotoTagInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(123,28,42,0.2)',
                        outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.25rem' }}>
                      TEXT ALT DESKRIPSI GAMBAR (Opsional untuk SEO)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Foto wisuda outdoor area kampus Jogja"
                      value={photoAltInput}
                      onChange={(e) => setPhotoAltInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(123,28,42,0.2)',
                        outline: 'none',
                        fontFamily: 'Inter, sans-serif',
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
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    💾 Simpan Perubahan Foto Ini &rarr;
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: REVIEWS MANAGEMENT ── */}
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
                Ulasan yang dikirimkan customer dari website akan tersimpan otomatis di sistem local storage web. Anda dapat mereset atau membersihkan ulasan bila diperlukan.
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
                    showToast('Data ulasan tambahan telah dibersihkan.');
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
