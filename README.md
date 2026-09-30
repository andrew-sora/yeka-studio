# 📸 Yeka Creative Studio — Modern Web Experience & Admin CMS

[![Live Demo](https://img.shields.io/badge/Live%20Demo-yeka--studio.pages.dev-25D366?style=for-the-badge&logo=cloudflare&logoColor=white)](https://yeka-studio.pages.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Production-Ready-00E676?style=for-the-badge)]()

> **Case Study & Tech Creative Portfolio**: Platform web interaktif dan sistem manajemen konten (CMS) berdesain *warm-luxury* untuk Yeka Creative Studio (Spesialis Foto Wisuda & Wedding di Jogja & Solo dengan tim fotografer wanita).

---

## 🌟 Executive Overview

**Yeka Creative Studio** memadukan estetika visual mewah (*editorial luxury*) dengan performa teknik tinggi (*high-performance web architecture*). Aplikasi ini dirancang untuk menjawab dua kebutuhan utama:
1. **User Experience (Client-Facing)**: Memberikan pengalaman eksplorasi portofolio & booking paket foto yang cepat, hangat, dan berorientasi pada konversi tinggi via WhatsApp.
2. **Operations & Content Management (Admin Portal)**: Menyediakan dashboard manajemen independen untuk mengelola harga paket, perincian fasilitas, foto portofolio, dan moderasi ulasan pelanggan secara *real-time*.

---

## 🚀 Fitur Utama & Arsitektur

### 1. Client-Facing Frontend Experience (`/`)
- **Editorial Hero Section**: Slider showcase interaktif dengan animasi halus, indikator kredibilitas (2.500+ momen terabadikan), dan pembagian kategori layanan (Wisuda vs Wedding).
- **Interactive Package Showcase**: Tampilan filter paket foto (Wisuda, Wedding, Videografi) dengan format harga Rupiah otomatis (`formatRupiah`), perincian fasilitas, serta modal pemesanan langsung.
- **Real-Time Booking & Availability Form**: Sistem pemeriksaan slot tanggal dan jam pemesanan dengan validasi input wajib (*mandatory slot check*).
- **Testimonial System**: Galeri testimoni nyata pelanggan lengkap dengan modal formulir pengiriman ulasan baru.
- **Glassmorphism & Micro-Interactions**: Sistem UI *warm-maroon & gold* dengan ikon vektor SVG kustom tanpa kebergantungan pada pustaka eksternal yang berat.

### 2. Admin Content Management System (`/admin`)
- **Package Management (CRUD)**: Tambah, edit, dan hapus paket Wisuda, Wedding, dan Videografi secara dinamis.
- **Automated Currency Input Formatting**: Input angka otomatis terformat ke standar mata uang Rupiah saat diketik oleh admin.
- **Testimonial Moderation Pipeline**: Tab moderasi khusus untuk meninjau ulasan baru dari pelanggan (Approve/Publish atau Delete).
- **Live Sync**: Perubahan data di admin portal langsung tersinkronisasi dan tampil di website publik.

---

## 🎨 Design System & Creative Rationale

- **Color Palette**:
  - `Primary Maroon`: `#120305` & `#7B1C2A` (Mewah, hangat, dan memberi rasa privasi).
  - `Accent Gold`: `#C9A94B` (Elegan, estetik, dan memberi kesan *high-end*).
  - `Neutral Ivory`: `#F9F6F0` (Bersih dan nyaman dibaca).
- **Typography**:
  - `Headlines`: *Cormorant Garamond* (Serif Italic Editorial) & *Playfair Display*.
  - `Body & UI`: *Inter* (Legibilitas tinggi pada berbagai ukuran layar).

---

## 🛠️ Tech Stack & Tools

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Modules & Global Design System Tokens
- **State & Data Handling**: React Hooks, Local Storage Persistence & Real-Time Sync
- **Icons**: Custom SVG Vector System
- **Deployment**: Cloudflare Pages / Vercel

---

## 💻 Local Installation & Setup

Ikuti langkah-langkah berikut untuk menjalankan proyek di lingkungan lokal:

```bash
# 1. Clone repository
git clone https://github.com/andrew-sora/yeka-studio.git

# 2. Masuk ke direktori proyek
cd yeka-studio

# 3. Install dependensi
npm install

# 4. Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

---

## 📄 License & Credits

Designed & Developed by **Andrew Sora** as a Tech Creative portfolio project.
&copy; 2026 Yeka Creative Studio &mdash; All Rights Reserved.
