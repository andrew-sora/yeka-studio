'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';

// Default PIN for Yeka Studio Owner/Admin
const DEFAULT_ADMIN_PIN = '1234';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

interface SlotOverride {
  dateKey: string; // YYYY-MM-DD
  status: 'fully_available' | 'partially_booked' | 'fully_booked';
  bookedSlots: string[];
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
  const [adminPin, setAdminPin] = useState(DEFAULT_ADMIN_PIN);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'packages' | 'photos' | 'reviews' | 'settings'>('calendar');

  // Change PIN State
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');

  // Calendar State
  const today = useMemo(() => new Date(), []);
  const [monthOffset, setMonthOffset] = useState(0);
  const targetDate = useMemo(() => new Date(today.getFullYear(), today.getMonth() + monthOffset, 1), [today, monthOffset]);
  const viewYear = targetDate.getFullYear();
  const viewMonth = targetDate.getMonth();

  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [overrides, setOverrides] = useState<Record<string, SlotOverride>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Package Management State
  const [packages, setPackages] = useState<PackageData[]>(DEFAULT_PACKAGES);
  const [selectedPkgId, setSelectedPkgId] = useState<string>('wisuda-outdoor');
  const [pkgFilterCategory, setPkgFilterCategory] = useState<'all' | 'wisuda' | 'wedding'>('all');
  const [pkgSearchQuery, setPkgSearchQuery] = useState('');

  // Package Form Fields
  const [pkgCategoryInput, setPkgCategoryInput] = useState<'wisuda' | 'wedding'>('wisuda');
  const [pkgTitleInput, setPkgTitleInput] = useState('');
  const [pkgPriceInput, setPkgPriceInput] = useState('');
  const [pkgDescInput, setPkgDescInput] = useState('');
  const [pkgBadgeInput, setPkgBadgeInput] = useState('');
  const [pkgFeaturedInput, setPkgFeaturedInput] = useState(false);
  const [pkgFeaturesInput, setPkgFeaturesInput] = useState('');

  // Photo Management State
  const [photos, setPhotos] = useState<PhotoData[]>(DEFAULT_PHOTOS);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>('wisuda-1');
  const [photoFilterCategory, setPhotoFilterCategory] = useState<'all' | 'wisuda' | 'wedding'>('all');
  const [photoSearchQuery, setPhotoSearchQuery] = useState('');
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const addPhotoFileInputRef = useRef<HTMLInputElement>(null);

  // Photo Form Fields
  const [photoCategoryInput, setPhotoCategoryInput] = useState<'wisuda' | 'wedding'>('wisuda');
  const [photoSrcInput, setPhotoSrcInput] = useState('');
  const [photoTitleInput, setPhotoTitleInput] = useState('');
  const [photoTagInput, setPhotoTagInput] = useState('');
  const [photoAltInput, setPhotoAltInput] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('yeka_admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    try {
      const storedPin = localStorage.getItem('yeka_admin_pin');
      if (storedPin) setAdminPin(storedPin);

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

  // Update Package Edit Form when selection changes
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

  // Update Photo Edit Form when selection changes
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
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === adminPin) {
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

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length < 4) {
      alert('PIN minimal 4 karakter.');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      alert('Konfirmasi PIN baru tidak cocok.');
      return;
    }
    setAdminPin(newPinInput);
    localStorage.setItem('yeka_admin_pin', newPinInput);
    setNewPinInput('');
    setConfirmPinInput('');
    showToast('PIN Admin berhasil diperbarui!');
  };

  // Calendar Key & Override Helpers
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
    showToast('Status slot jam berhasil diperbarui.');
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
    showToast('Status tanggal berhasil diperbarui.');
  };

  // Filtered Packages & Photos Lists
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchCategory = pkgFilterCategory === 'all' || pkg.category === pkgFilterCategory;
      const matchSearch = pkg.title.toLowerCase().includes(pkgSearchQuery.toLowerCase()) ||
                          pkg.price.toLowerCase().includes(pkgSearchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [packages, pkgFilterCategory, pkgSearchQuery]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((ph) => {
      const matchCategory = photoFilterCategory === 'all' || ph.category === photoFilterCategory;
      const matchSearch = ph.title.toLowerCase().includes(photoSearchQuery.toLowerCase()) ||
                          ph.tag.toLowerCase().includes(photoSearchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [photos, photoFilterCategory, photoSearchQuery]);

  // Package Handlers
  const handleAddNewPackage = () => {
    const newId = `pkg-${Date.now()}`;
    const newPkg: PackageData = {
      id: newId,
      category: 'wisuda',
      title: 'Paket Baru',
      price: 'Rp 500.000',
      desc: 'Deskripsi singkat paket baru',
      featured: false,
      badge: '',
      features: ['Durasi 1.5 Jam Photoshoot', 'ALL File Mentah (Drive)'],
    };
    const updated = [newPkg, ...packages];
    setPackages(updated);
    setSelectedPkgId(newId);
    localStorage.setItem('yeka_package_overrides', JSON.stringify(updated));
    showToast('Paket baru berhasil ditambahkan.');
  };

  const handleDeletePackage = (idToDelete: string) => {
    if (packages.length <= 1) return alert('Minimal harus ada 1 paket.');
    if (!confirm('Hapus paket ini dari website?')) return;
    const updated = packages.filter((p) => p.id !== idToDelete);
    setPackages(updated);
    setSelectedPkgId(updated[0].id);
    localStorage.setItem('yeka_package_overrides', JSON.stringify(updated));
    showToast('Paket berhasil dihapus.');
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
    showToast('Detail paket berhasil disimpan.');
  };

  const handleResetPackages = () => {
    if (confirm('Kembalikan seluruh paket ke pengaturan awal?')) {
      setPackages(DEFAULT_PACKAGES);
      setSelectedPkgId(DEFAULT_PACKAGES[0].id);
      localStorage.removeItem('yeka_package_overrides');
      showToast('Paket berhasil di-reset.');
    }
  };

  // Photo Handlers & File Reader Upload (From Device Gallery)
  const handleAddPhotoFromGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran file foto maksimal 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const newId = `photo-${Date.now()}`;
        const cat = photoFilterCategory !== 'all' ? photoFilterCategory : 'wisuda';
        const newPhoto: PhotoData = {
          id: newId,
          category: cat,
          src: reader.result,
          title: 'Foto Baru',
          tag: cat === 'wisuda' ? 'Area Jogja & Solo' : 'Signature Setup',
          alt: 'Foto portofolio Yeka Creative Studio',
        };
        const updated = [newPhoto, ...photos];
        setPhotos(updated);
        setSelectedPhotoId(newId);
        localStorage.setItem('yeka_photo_overrides', JSON.stringify(updated));
        showToast('✓ Foto berhasil diunggah dari galeri! Silakan isi judul & lokasi.');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePhotoEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran file foto maksimal 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoSrcInput(reader.result);
        showToast('Gambar foto berhasil diganti!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddBlankPhotoUrl = () => {
    const newId = `photo-${Date.now()}`;
    const cat = photoFilterCategory !== 'all' ? photoFilterCategory : 'wisuda';
    const newPhoto: PhotoData = {
      id: newId,
      category: cat,
      src: '/images/wisuda-1.jpg',
      title: 'Foto Baru (URL)',
      tag: 'Lokasi Photoshoot',
      alt: 'Foto portofolio',
    };
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    setSelectedPhotoId(newId);
    localStorage.setItem('yeka_photo_overrides', JSON.stringify(updated));
    showToast('Foto baru via URL ditambahkan. Masukkan link gambar.');
  };

  const handleDeletePhoto = (idToDelete: string) => {
    if (photos.length <= 1) return alert('Minimal harus ada 1 foto.');
    if (!confirm('Hapus foto ini dari galeri portofolio?')) return;
    const updated = photos.filter((ph) => ph.id !== idToDelete);
    setPhotos(updated);
    setSelectedPhotoId(updated[0].id);
    localStorage.setItem('yeka_photo_overrides', JSON.stringify(updated));
    showToast('Foto berhasil dihapus.');
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
    showToast('Foto portofolio berhasil disimpan.');
  };

  const handleResetPhotos = () => {
    if (confirm('Kembalikan galeri foto ke pengaturan awal?')) {
      setPhotos(DEFAULT_PHOTOS);
      setSelectedPhotoId(DEFAULT_PHOTOS[0].id);
      localStorage.removeItem('yeka_photo_overrides');
      showToast('Galeri foto di-reset.');
    }
  };

  // ── AUTH / LOGIN SCREEN ───────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}>
        <div style={{
          maxWidth: '360px',
          width: '100%',
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '2.25rem 2rem',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7B1C2A' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Yeka Studio Admin
            </span>
          </div>

          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Masuk ke Owner Portal
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            Masukkan PIN rahasia untuk mengelola jadwal, harga paket, dan foto.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                PIN KEAMANAN
              </label>
              <input
                type="password"
                maxLength={6}
                placeholder="••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  letterSpacing: '0.4em',
                  borderRadius: '8px',
                  border: pinError ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                  outline: 'none',
                  background: '#F8FAFC',
                  color: '#0F172A',
                  fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {pinError && (
              <div style={{ color: '#DC2626', fontSize: '0.75rem', marginBottom: '1rem', fontWeight: 500 }}>
                PIN salah. Masukkan PIN yang terdaftar.
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                background: '#0F172A',
                color: '#FFFFFF',
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
            >
              Masuk Dashboard
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link href="/" style={{ fontSize: '0.78rem', color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>
              &larr; Kembali ke Website Utama
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN DASHBOARD (Clean Modern SaaS UI) ──────────────────────────────────
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
      background: '#F8FAFC',
      color: '#0F172A',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      paddingBottom: '4rem',
    }}>
      {/* Hidden File Picker for Direct Gallery Add */}
      <input
        type="file"
        ref={addPhotoFileInputRef}
        accept="image/*"
        onChange={handleAddPhotoFromGallery}
        style={{ display: 'none' }}
      />

      {/* Top Navbar */}
      <header style={{
        background: '#0F172A',
        color: '#FFFFFF',
        padding: '0.85rem 1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #1E293B',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            background: 'rgba(255,255,255,0.1)',
            color: '#E2E8F0',
            padding: '0.2rem 0.55rem',
            borderRadius: '4px',
            letterSpacing: '0.05em',
          }}>
            OWNER PORTAL
          </div>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F8FAFC' }}>
            Yeka Creative Studio
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link href="/" style={{ color: '#94A3B8', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 500 }}>
            Lihat Web Utama ↗
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              color: '#CBD5E1',
              border: '1px solid #334155',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '64px',
          right: '24px',
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '0.65rem 1.1rem',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          fontSize: '0.82rem',
          fontWeight: 500,
          border: '1px solid #334155',
          zIndex: 100,
        }}>
          ✓ {toastMessage}
        </div>
      )}

      {/* Main Container */}
      <main style={{ maxWidth: '1120px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
        {/* Navigation Tabs Bar */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          padding: '0.35rem',
          display: 'flex',
          gap: '0.35rem',
          marginBottom: '1.75rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        }}>
          <button
            onClick={() => setActiveTab('calendar')}
            style={{
              flex: 1,
              padding: '0.6rem 0.85rem',
              borderRadius: '7px',
              border: 'none',
              background: activeTab === 'calendar' ? '#0F172A' : 'transparent',
              color: activeTab === 'calendar' ? '#FFFFFF' : '#64748B',
              fontWeight: activeTab === 'calendar' ? 600 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Jadwal &amp; Slot
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            style={{
              flex: 1,
              padding: '0.6rem 0.85rem',
              borderRadius: '7px',
              border: 'none',
              background: activeTab === 'packages' ? '#0F172A' : 'transparent',
              color: activeTab === 'packages' ? '#FFFFFF' : '#64748B',
              fontWeight: activeTab === 'packages' ? 600 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Kelola Paket &amp; Harga
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            style={{
              flex: 1,
              padding: '0.6rem 0.85rem',
              borderRadius: '7px',
              border: 'none',
              background: activeTab === 'photos' ? '#0F172A' : 'transparent',
              color: activeTab === 'photos' ? '#FFFFFF' : '#64748B',
              fontWeight: activeTab === 'photos' ? 600 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Foto Portofolio
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              flex: 1,
              padding: '0.6rem 0.85rem',
              borderRadius: '7px',
              border: 'none',
              background: activeTab === 'reviews' ? '#0F172A' : 'transparent',
              color: activeTab === 'reviews' ? '#FFFFFF' : '#64748B',
              fontWeight: activeTab === 'reviews' ? 600 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Testimoni Klien
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '0.6rem 0.85rem',
              borderRadius: '7px',
              border: 'none',
              background: activeTab === 'settings' ? '#0F172A' : 'transparent',
              color: activeTab === 'settings' ? '#FFFFFF' : '#64748B',
              fontWeight: activeTab === 'settings' ? 600 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Pengaturan PIN
          </button>
        </div>

        {/* ── TAB 1: CALENDAR & SLOTS ── */}
        {activeTab === 'calendar' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.5rem' }}>
            {/* Calendar Box */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0,0,0,0.02)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <button
                  onClick={() => setMonthOffset((prev) => Math.max(0, prev - 1))}
                  disabled={monthOffset === 0}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    background: monthOffset === 0 ? '#F8FAFC' : '#FFFFFF',
                    color: monthOffset === 0 ? '#94A3B8' : '#0F172A',
                    cursor: monthOffset === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  &lsaquo;
                </button>

                <div style={{ fontWeight: 600, fontSize: '1rem', color: '#0F172A' }}>
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </div>

                <button
                  onClick={() => setMonthOffset((prev) => prev + 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  &rsaquo;
                </button>
              </div>

              {/* Day Labels */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.5rem' }}>
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* Grid Days */}
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

                  let bg = '#FFFFFF';
                  let color = '#0F172A';
                  let border = '1px solid #E2E8F0';

                  if (dayOverride?.status === 'fully_booked') {
                    bg = '#FEF2F2';
                    color = '#991B1B';
                    border = '1px solid #FCA5A5';
                  } else if (dayOverride?.status === 'partially_booked') {
                    bg = '#FFFBEB';
                    color = '#92400E';
                    border = '1px solid #FCD34D';
                  }

                  if (isSelected) {
                    bg = '#0F172A';
                    color = '#FFFFFF';
                    border = '1px solid #0F172A';
                  }

                  return (
                    <div
                      key={dayNum}
                      onClick={() => setSelectedDay(dayNum)}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer',
                        background: bg,
                        color: color,
                        border: border,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {dayNum}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Day Control Panel */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0,0,0,0.02)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Pengaturan Tanggal
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>
                {selectedDay} {MONTH_NAMES[viewMonth]} {viewYear}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                  KETERSEDIAAN HARI
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setDayStatus('fully_available')}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      border: '1px solid #CBD5E1',
                      background: currentOverride.status === 'fully_available' ? '#0F172A' : '#FFFFFF',
                      color: currentOverride.status === 'fully_available' ? '#FFFFFF' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    Buka Tanggal
                  </button>

                  <button
                    onClick={() => setDayStatus('fully_booked')}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      border: '1px solid #FCA5A5',
                      background: currentOverride.status === 'fully_booked' ? '#DC2626' : '#FEF2F2',
                      color: currentOverride.status === 'fully_booked' ? '#FFFFFF' : '#991B1B',
                      cursor: 'pointer',
                    }}
                  >
                    Tutup Full
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                  SLOT JAM INDIVIDUAL
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {allSlotsList.map((slotTime) => {
                    const isBooked = currentOverride.bookedSlots.includes(slotTime);
                    return (
                      <div
                        key={slotTime}
                        onClick={() => toggleSlotBooked(slotTime)}
                        style={{
                          padding: '0.6rem 0.85rem',
                          borderRadius: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          border: isBooked ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
                          background: isBooked ? '#FEF2F2' : '#F8FAFC',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ fontSize: '0.82rem', fontWeight: 500, color: isBooked ? '#991B1B' : '#334155' }}>
                          {slotTime}
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          background: isBooked ? '#DC2626' : '#10B981',
                          color: '#FFFFFF',
                        }}>
                          {isBooked ? 'Terisi' : 'Tersedia'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: PACKAGES & PRICING MANAGER ── */}
        {activeTab === 'packages' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.5rem' }}>
            {/* Left: Package List with Search & Filter */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0,0,0,0.02)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                  DAFTAR PAKET ({filteredPackages.length})
                </span>
                <button
                  onClick={handleAddNewPackage}
                  style={{
                    background: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  + Tambah Paket
                </button>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', background: '#F8FAFC', padding: '0.2rem', borderRadius: '6px', border: '1px solid #E2E8F0', marginBottom: '0.5rem' }}>
                  {(['all', 'wisuda', 'wedding'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPkgFilterCategory(cat)}
                      style={{
                        flex: 1,
                        padding: '0.3rem',
                        fontSize: '0.72rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: pkgFilterCategory === cat ? '#FFFFFF' : 'transparent',
                        color: pkgFilterCategory === cat ? '#0F172A' : '#64748B',
                        fontWeight: pkgFilterCategory === cat ? 600 : 500,
                        cursor: 'pointer',
                        boxShadow: pkgFilterCategory === cat ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                        textTransform: 'capitalize',
                      }}
                    >
                      {cat === 'all' ? 'Semua' : cat}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Cari nama paket atau harga..."
                  value={pkgSearchQuery}
                  onChange={(e) => setPkgSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    fontSize: '0.78rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '420px', overflowY: 'auto' }}>
                {filteredPackages.map((pkg) => {
                  const isSelected = selectedPkgId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkgId(pkg.id)}
                      style={{
                        padding: '0.7rem 0.85rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: isSelected ? '1.5px solid #0F172A' : '1px solid #E2E8F0',
                        background: isSelected ? '#F8FAFC' : '#FFFFFF',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                          {pkg.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                          {pkg.price} &bull; <span style={{ textTransform: 'capitalize' }}>{pkg.category}</span>
                        </div>
                      </div>

                      {pkg.featured && (
                        <span style={{
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          background: '#F1F5F9',
                          color: '#334155',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px',
                          border: '1px solid #CBD5E1',
                        }}>
                          {pkg.badge || 'HOT'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                <button
                  onClick={handleResetPackages}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    color: '#64748B',
                    border: '1px dashed #CBD5E1',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Reset Seluruh Paket ke Default
                </button>
              </div>
            </div>

            {/* Right: Package Edit Form + Live Preview */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0,0,0,0.02)',
            }}>
              <form onSubmit={handleSavePackage}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    Edit Detail Paket
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleDeletePackage(selectedPkgId)}
                    style={{
                      background: '#FEF2F2',
                      color: '#DC2626',
                      border: '1px solid #FCA5A5',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Hapus Paket
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                      Kategori
                    </label>
                    <select
                      value={pkgCategoryInput}
                      onChange={(e) => setPkgCategoryInput(e.target.value as 'wisuda' | 'wedding')}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.82rem',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        outline: 'none',
                        background: '#FFFFFF',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="wisuda">Wisuda</option>
                      <option value="wedding">Wedding / Prewedding</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                      Badge Label (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Terfavorit"
                      value={pkgBadgeInput}
                      onChange={(e) => setPkgBadgeInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.82rem',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Nama Paket *
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgTitleInput}
                    onChange={(e) => setPkgTitleInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.65rem',
                      fontSize: '0.82rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Harga *
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgPriceInput}
                    onChange={(e) => setPkgPriceInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.65rem',
                      fontSize: '0.82rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Deskripsi Singkat
                  </label>
                  <input
                    type="text"
                    value={pkgDescInput}
                    onChange={(e) => setPkgDescInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.65rem',
                      fontSize: '0.82rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="pkgFeatured"
                    checked={pkgFeaturedInput}
                    onChange={(e) => setPkgFeaturedInput(e.target.checked)}
                    style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                  />
                  <label htmlFor="pkgFeatured" style={{ fontSize: '0.78rem', fontWeight: 500, color: '#334155', cursor: 'pointer' }}>
                    Tampilkan sebagai paket unggulan (Highlighted Card)
                  </label>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Fasilitas / Inklusi (1 Per Baris)
                  </label>
                  <textarea
                    rows={4}
                    value={pkgFeaturesInput}
                    onChange={(e) => setPkgFeaturesInput(e.target.value)}
                    placeholder="Contoh:&#10;Durasi 1.5 Jam Photoshoot&#10;ALL File Mentah (Drive)"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.65rem',
                      fontSize: '0.8rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Real-time Live Preview Card */}
                <div style={{ marginBottom: '1.25rem', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    LIVE PREVIEW KARTU PAKET WEB:
                  </div>
                  <div style={{
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    border: pkgFeaturedInput ? '2px solid #7B1C2A' : '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}>
                    {pkgBadgeInput && (
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, background: '#7B1C2A', color: '#FFFFFF', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                        {pkgBadgeInput}
                      </span>
                    )}
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
                      {pkgTitleInput || 'Nama Paket'}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#7B1C2A' }}>
                      {pkgPriceInput || 'Rp 0'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                      {pkgDescInput || 'Deskripsi singkat paket'}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: '#0F172A',
                    color: '#FFFFFF',
                    padding: '0.7rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Simpan Perubahan Paket
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── TAB 3: PORTFOLIO PHOTO MANAGER ── */}
        {activeTab === 'photos' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.5rem' }}>
            {/* Left: Photo Grid List with Search & Filter */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0,0,0,0.02)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                  PORTOFOLIO FOTO ({filteredPhotos.length})
                </span>
                
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {/* Primary Add Photo Button -> Directly Triggers Device Gallery / File Picker */}
                  <button
                    onClick={() => addPhotoFileInputRef.current?.click()}
                    title="Pilih foto dari Galeri HP / Komputer"
                    style={{
                      background: '#0F172A',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    📷 + Tambah Foto
                  </button>

                  <button
                    onClick={handleAddBlankPhotoUrl}
                    title="Tambah via Link URL Gambar"
                    style={{
                      background: '#F1F5F9',
                      color: '#475569',
                      border: '1px solid #CBD5E1',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Via URL
                  </button>
                </div>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', background: '#F8FAFC', padding: '0.2rem', borderRadius: '6px', border: '1px solid #E2E8F0', marginBottom: '0.5rem' }}>
                  {(['all', 'wisuda', 'wedding'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPhotoFilterCategory(cat)}
                      style={{
                        flex: 1,
                        padding: '0.3rem',
                        fontSize: '0.72rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: photoFilterCategory === cat ? '#FFFFFF' : 'transparent',
                        color: photoFilterCategory === cat ? '#0F172A' : '#64748B',
                        fontWeight: photoFilterCategory === cat ? 600 : 500,
                        cursor: 'pointer',
                        boxShadow: photoFilterCategory === cat ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                        textTransform: 'capitalize',
                      }}
                    >
                      {cat === 'all' ? 'Semua' : cat}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Cari judul foto atau spot..."
                  value={photoSearchQuery}
                  onChange={(e) => setPhotoSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    fontSize: '0.78rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: '0.65rem',
                maxHeight: '440px',
                overflowY: 'auto',
                paddingRight: '0.2rem',
              }}>
                {filteredPhotos.map((ph) => {
                  const isSelected = selectedPhotoId === ph.id;
                  return (
                    <div
                      key={ph.id}
                      onClick={() => setSelectedPhotoId(ph.id)}
                      style={{
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: isSelected ? '2px solid #0F172A' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                        background: '#F8FAFC',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ height: '85px', overflow: 'hidden', background: '#0F172A', position: 'relative' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ph.src}
                          alt={ph.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span style={{
                          position: 'absolute',
                          bottom: '3px',
                          left: '3px',
                          fontSize: '0.55rem',
                          fontWeight: 600,
                          background: 'rgba(15,23,42,0.85)',
                          color: '#FFFFFF',
                          padding: '0.1rem 0.3rem',
                          borderRadius: '3px',
                          textTransform: 'capitalize',
                        }}>
                          {ph.category}
                        </span>
                      </div>
                      <div style={{ padding: '0.35rem', fontSize: '0.7rem', fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ph.title}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                <button
                  onClick={handleResetPhotos}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    color: '#64748B',
                    border: '1px dashed #CBD5E1',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Reset Galeri Foto ke Default
                </button>
              </div>
            </div>

            {/* Right: Photo Edit Form + Replace Image from Device */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0,0,0,0.02)',
            }}>
              <form onSubmit={handleSavePhoto}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    Edit Detail Foto
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(selectedPhotoId)}
                    style={{
                      background: '#FEF2F2',
                      color: '#DC2626',
                      border: '1px solid #FCA5A5',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Hapus Foto
                  </button>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Kategori Foto
                  </label>
                  <select
                    value={photoCategoryInput}
                    onChange={(e) => setPhotoCategoryInput(e.target.value as 'wisuda' | 'wedding')}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.65rem',
                      fontSize: '0.82rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      outline: 'none',
                      background: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="wisuda">Wisuda (Galeri Wisuda)</option>
                    <option value="wedding">Wedding (Galeri Wedding)</option>
                  </select>
                </div>

                {/* Replace Image Button for selected photo */}
                <div style={{ marginBottom: '1rem', background: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.4rem' }}>
                    📷 Ganti File Gambar Foto Ini
                  </label>
                  
                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept="image/*"
                    onChange={handlePhotoEditFileUpload}
                    style={{ display: 'none' }}
                  />

                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      color: '#0F172A',
                      border: '1px solid #CBD5E1',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    📁 Pilih Gambar Baru dari Galeri HP / PC
                  </button>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Path / URL Gambar (`src`) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/images/wisuda-1.jpg"
                    value={photoSrcInput}
                    onChange={(e) => setPhotoSrcInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.65rem',
                      fontSize: '0.82rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Judul Foto / Caption *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UGM Balairung Session"
                    value={photoTitleInput}
                    onChange={(e) => setPhotoTitleInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.65rem',
                      fontSize: '0.82rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Tag Lokasi / Keterangan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Area Jogja & Solo"
                    value={photoTagInput}
                    onChange={(e) => setPhotoTagInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.65rem',
                      fontSize: '0.82rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Text Alt SEO (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Deskripsi foto untuk SEO Google"
                    value={photoAltInput}
                    onChange={(e) => setPhotoAltInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.65rem',
                      fontSize: '0.82rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Real-Time Live Preview Photo */}
                <div style={{ marginBottom: '1.25rem', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    LIVE PREVIEW PORTOFOLIO:
                  </div>
                  <div style={{
                    width: '160px',
                    aspectRatio: '3/4',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    position: 'relative',
                    background: '#0F172A',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    margin: '0 auto',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoSrcInput || '/images/wisuda-1.jpg'}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      right: '8px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: '6px',
                      padding: '0.4rem 0.5rem',
                      color: 'white',
                    }}>
                      <div style={{ fontSize: '0.55rem', color: '#FCD34D', textTransform: 'uppercase', fontWeight: 600 }}>
                        {photoTagInput || 'Tag Lokasi'}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {photoTitleInput || 'Judul Foto'}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: '#0F172A',
                    color: '#FFFFFF',
                    padding: '0.7rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Simpan Perubahan Foto
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── TAB 4: REVIEWS MODERATION ── */}
        {activeTab === 'reviews' && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px 0 rgba(0,0,0,0.02)',
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
              Moderasi Ulasan Customer
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Ulasan baru yang dikirimkan customer dari form website disimpan secara otomatis di database lokal browser.
            </p>

            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#475569' }}>
              Seluruh ulasan terverifikasi dan testimoni default tampil secara otomatis di website utama. Jika Anda ingin mematikan atau mereset data ulasan tambahan hasil testing, gunakan tombol di bawah ini.
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={() => {
                  localStorage.removeItem('yeka_user_testimonials');
                  showToast('Data ulasan tambahan berhasil dibersihkan.');
                }}
                style={{
                  background: '#FEF2F2',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reset Ulasan Tambahan (Testing Data)
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 5: PIN & SECURITY SETTINGS ── */}
        {activeTab === 'settings' && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '1.5rem',
            maxWidth: '500px',
            margin: '0 auto',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px 0 rgba(0,0,0,0.02)',
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
              Pengaturan PIN Keamanan Admin
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Ubah PIN login Owner/Admin untuk mengamankan akses ke halaman pengelola jadwal dan harga ini.
            </p>

            <form onSubmit={handleChangePin}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  PIN BARU (MIN. 4 ANGKA/KARAKTER)
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="Masukkan PIN baru"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    fontSize: '0.9rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  KONFIRMASI PIN BARU
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="Ulangi PIN baru"
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    fontSize: '0.9rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  padding: '0.7rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Simpan PIN Rahasia Baru
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
