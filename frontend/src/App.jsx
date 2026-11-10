import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import FallingPetals from './components/FallingPetals';
import { Sampul, Beranda, Gallery, Ucapan, Monogram } from './pages';

export default function App() {
  // Awalan yang muncul SELALU buku sampul
  const [isCoverOpen, setIsCoverOpen] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Kunci scroll halaman ketika sampul aktif & pastikan di posisi paling atas
  useEffect(() => {
    if (isCoverOpen) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCoverOpen]);

  // Bersihkan hash URL lama saat pertama kali dimuat agar selalu mulai dari sampul
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  }, []);

  // Deteksi bagian yang sedang aktif saat di-scroll
  useEffect(() => {
    const sections = [
      'hero',
      'mempelai',
      'acara',
      'lokasi-acara',
      'galeri',
      'love-story',
      'monogram',
      'amplop-digital',
      'ucapan-form',
    ];

    const handleScroll = () => {
      if (isCoverOpen) return;

      setShowBackToTop(window.scrollY > 400);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCoverOpen]);

  // Handler saat buku sampul diklik: Masuk ke Beranda & mulai putar musik
  const handleOpenInvitation = () => {
    setIsCoverOpen(false);
    setIsMusicPlaying(true);

    setTimeout(() => {
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleScrollTo = (sectionId) => {
    setIsCoverOpen(false);
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveDate = () => {
    const title = encodeURIComponent('Pernikahan Rizal & Putri');
    const details = encodeURIComponent(
      'Akad Nikah & Syukuran Pernikahan Rizal Pratama & Putri Anindya di Cigugur, Kuningan.'
    );
    const location = encodeURIComponent(
      'Lingk. Manis RT.02 RW.01 Kel. Cigugur, Kec. Cigugur, Kab. Kuningan, Jawa Barat'
    );
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261120T010000Z/20261120T060000Z&details=${details}&location=${location}`;
    window.open(gCalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container relative">
      {/* 
        Full-Screen Opening Cover / Sampul
        Selalu muncul pertama kali saat halaman dibuka.
        Saat diklik 'Buka Undangan', tirai meluncur ke atas dan masuk ke Beranda.
      */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-700 ease-in-out transform ${
          isCoverOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <Sampul onOpenInvitation={handleOpenInvitation} />
      </div>

      {/* Sticky Top Navigation (Hanya tampil setelah masuk ke undangan) */}
      <Navbar
        activeSection={activeSection}
        onScrollTo={handleScrollTo}
        onSaveDate={handleSaveDate}
        onOpenCover={() => setIsCoverOpen(true)}
      />

      {/* 
        Single Landing Page Main Flow
        Mulai dari Beranda (Hero, Ayat Suci, Profil, Acara, Lokasi),
        Galeri, Monogram, hingga Buku Tamu & RSVP
      */}
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)] flex flex-col">
        {/* Section 1: Beranda (Hero, Ayat Suci, Countdown, Mempelai, Acara, Lokasi) */}
        <section id="section-beranda" className="w-full">
          <Beranda onNavigate={handleScrollTo} />
        </section>

        {/* Section 2: Galeri Foto, Video Sinematik & Love Story Timeline */}
        <section id="section-gallery" className="w-full border-t border-outline-variant/30">
          <Gallery onNavigate={handleScrollTo} />
        </section>

        {/* Section 3: Monogram Insignia Showcase */}
        <section id="monogram" className="w-full bg-surface-container-low border-t border-outline-variant/30">
          <Monogram />
        </section>

        {/* Section 4: Amplop Digital, Buku Tamu & Dinding Ucapan Para Tamu */}
        <section id="section-ucapan" className="w-full">
          <Ucapan />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Romantic Falling Flower Petals Overlay (Aktif setelah sampul dibuka) */}
      <FallingPetals isActive={!isCoverOpen} />

      {/* Persistent Floating Music Player */}
      <MusicPlayer
        isPlaying={isMusicPlaying}
        onToggle={(state) => setIsMusicPlaying(state)}
      />

      {/* Back to Top Floating Button */}
      {showBackToTop && !isCoverOpen && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface flex items-center justify-center shadow-lg border border-outline-variant/30 hover:bg-primary hover:text-on-primary transition-all duration-300"
          title="Kembali ke atas"
          aria-label="Kembali ke atas"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_upward
          </span>
        </button>
      )}
    </div>
  );
}
