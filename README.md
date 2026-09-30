# Yeka Creative Studio — Modern Web Experience & Admin CMS

[![Live Demo](https://img.shields.io/badge/Live%20Demo-yeka--studio.pages.dev-25D366?style=for-the-badge&logo=cloudflare&logoColor=white)](https://yeka-studio.pages.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Case Study & Tech Creative Portfolio: Web application and Content Management System (CMS) built for Yeka Creative Studio (Graduation & Wedding photography services in Yogyakarta & Solo).

---

## Executive Overview

Yeka Creative Studio combines warm-luxury editorial aesthetics with high-performance web architecture. The application is built to serve two core objectives:
1. Client-Facing User Experience: High-converting portfolio exploration, real-time availability booking, and direct WhatsApp consultation.
2. Content & Operations Management: Dedicated admin CMS dashboard to manage photo packages, pricing auto-formatting, portfolio items, and customer review moderation.

---

## Features & System Architecture

### 1. Client-Facing Frontend (`/`)
- Editorial Hero Section: Interactive showcase slider with fluid transitions, social proof indicators, and distinct service category breakdown.
- Dynamic Package Showcase: Interactive package filtering (Wisuda, Wedding, Videography) with automatic Rupiah currency formatting (`formatRupiah`), package details, and instant booking modal.
- Booking & Availability Validation: Interactive date & slot picker with mandatory input verification.
- Testimonial System: Customer reviews display with modal form submission for new client feedback.
- Custom SVG Vector System: Warm-maroon & gold design system built with lightweight inline SVG vector icons.

### 2. Admin Content Management System (`/admin`)
- Package Management (CRUD): Dynamic package creation, editing, and deletion across all service categories.
- Automated Currency Input Formatting: Real-time currency string formatting to standard Rupiah format during admin data entry.
- Review Moderation Pipeline: Moderation queue to review, approve/publish, or reject user-submitted testimonials.
- Live Data Synchronization: Instant data synchronization between administrative updates and the client-facing website.

---

## Design System & Rationale

- Color Palette:
  - Primary Maroon: `#120305` & `#7B1C2A` (Privacy, warmth, and luxury).
  - Accent Gold: `#C9A94B` (High-end aesthetic emphasis).
  - Neutral Ivory: `#F9F6F0` (High contrast readability).
- Typography:
  - Headlines: Cormorant Garamond (Serif Italic Editorial) & Playfair Display.
  - Body & UI: Inter (Clean legibility across all screen viewports).

---

## Tech Stack

- Framework: Next.js 16 (App Router, Turbopack)
- Language: TypeScript
- Styling: Custom Design System & CSS Modules
- Data Handling: React Hooks, Local Storage Persistence & Real-Time Sync
- Deployment: Cloudflare Pages

---

## Local Installation & Setup

```bash
# 1. Clone repository
git clone https://github.com/andrew-sora/yeka-studio.git

# 2. Navigate to project directory
cd yeka-studio

# 3. Install dependencies
npm install

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Credits & License

Designed & Developed by Andrew Sora.  
Copyright &copy; 2026 Yeka Creative Studio. All Rights Reserved.
