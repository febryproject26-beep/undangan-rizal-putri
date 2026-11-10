import React, { useState } from 'react';
import MonogramSvg from '../components/MonogramSvg';

export default function Sampul({
  onOpenInvitation,
  coupleTitle = 'Rizal & Putri',
  weddingDate = 'Jumat, 20 November 2026',
  venue = 'Cigugur, Kuningan',
  guestPropName = '',
}) {
  const [guestName] = useState(() => {
    if (guestPropName) return guestPropName;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const guestParam =
        urlParams.get('to') || urlParams.get('u') || urlParams.get('guest');
      if (guestParam) {
        try {
          return decodeURIComponent(guestParam);
        } catch {
          return guestParam;
        }
      }
    }
    return 'Bapak / Ibu / Saudara(i)';
  });

  const [isOpening, setIsOpening] = useState(false);

  const handleClickCover = () => {
    if (isOpening) return;
    setIsOpening(true);

    if (onOpenInvitation) {
      onOpenInvitation();
    }

    setTimeout(() => {
      setIsOpening(false);
    }, 600);
  };

  return (
    <main
      onClick={handleClickCover}
      className="w-full min-h-screen bg-surface flex flex-col justify-center items-center relative overflow-y-auto py-8 px-4 sm:px-6 select-none cursor-pointer"
      title="Klik buku sampul untuk masuk ke Beranda"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClickCover();
        }
      }}
    >
      {/* Background Ambience Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-fixed filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-tertiary-fixed filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-container/10 filter blur-2xl"></div>
      </div>

      {/* Decorative Botanical Corner - Top Left */}
      <div className="absolute top-6 left-6 w-32 h-32 pointer-events-none opacity-60 hidden sm:block">
        <svg
          className="w-full h-full text-primary-container"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          viewBox="0 0 120 120"
        >
          <path d="M10,110 C10,50 50,10 110,10" strokeLinecap="round" />
          <path
            d="M25,85 C20,70 30,55 45,55 C45,70 35,85 25,85 Z"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <path
            d="M55,55 C55,40 70,30 85,45 C70,45 55,40 55,55 Z"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <path
            d="M75,25 C65,15 80,5 95,20 C85,25 75,25 75,25 Z"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <circle cx="10" cy="110" fill="currentColor" r="2" />
          <circle cx="110" cy="10" fill="currentColor" r="2" />
        </svg>
      </div>

      {/* Decorative Botanical Corner - Bottom Right */}
      <div className="absolute bottom-6 right-6 w-32 h-32 pointer-events-none opacity-60 hidden sm:block rotate-180">
        <svg
          className="w-full h-full text-primary-container"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          viewBox="0 0 120 120"
        >
          <path d="M10,110 C10,50 50,10 110,10" strokeLinecap="round" />
          <path
            d="M25,85 C20,70 30,55 45,55 C45,70 35,85 25,85 Z"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <path
            d="M55,55 C55,40 70,30 85,45 C70,45 55,40 55,55 Z"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <path
            d="M75,25 C65,15 80,5 95,20 C85,25 75,25 75,25 Z"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <circle cx="10" cy="110" fill="currentColor" r="2" />
          <circle cx="110" cy="10" fill="currentColor" r="2" />
        </svg>
      </div>

      {/* Center Invitation Card (Buku Sampul) */}
      <div
        className={`relative z-10 w-full max-w-xl mx-auto bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl shadow-2xl px-6 py-10 sm:px-14 sm:py-14 text-center border border-primary-container/30 transition-all duration-500 ease-out transform ${isOpening
          ? 'scale-105 opacity-80'
          : 'hover:scale-[1.015] hover:shadow-[0_20px_50px_rgba(119,90,25,0.18)]'
          }`}
        id="invitation-card"
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-center space-x-3 mb-5">
          <span className="w-10 h-px bg-primary-container/40"></span>
          <span className="material-symbols-outlined text-primary-container text-xs">
            favorite
          </span>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
            The Holy Matrimony
          </span>
          <span className="material-symbols-outlined text-primary-container text-xs">
            favorite
          </span>
          <span className="w-10 h-px bg-primary-container/40"></span>
        </div>

        {/* Monogram Crest Avatar */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary-container/15 animate-ping opacity-30"></div>
          <div className="relative w-full h-full rounded-full bg-surface-container-low p-2 shadow-inner flex items-center justify-center border border-primary-container/30 group-hover:scale-105 transition-transform">
            <MonogramSvg initials="R & P" subtitle="WEDDING" size={88} />
          </div>
        </div>

        {/* Couple Title & Date */}
        <div className="space-y-1 mb-6">
          <p className="font-body-md text-body-md text-on-surface-variant italic">
            Bersama memohon rahmat dan ridho-Nya
          </p>
          <h1 className="font-display-lg text-display-lg-mobile sm:text-display-lg text-on-surface leading-tight tracking-tight">
            {coupleTitle}
          </h1>
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-outline-variant"></span>
            <span className="font-label-md text-label-md text-primary tracking-widest uppercase font-medium">
              {weddingDate}
            </span>
            <span className="h-px w-8 bg-outline-variant"></span>
          </div>
        </div>

        {/* Guest Name Box */}
        <div className="bg-surface-container-low/90 rounded-xl p-5 sm:p-6 mb-6 shadow-sm max-w-md mx-auto relative overflow-hidden border border-outline-variant/30">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-80"></div>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-1.5">
            Kepada Yth. Tamu Undangan
          </p>
          <h2
            className="font-headline-sm text-headline-sm text-on-surface mb-2 font-medium"
            id="guest-name"
          >
            {guestName}
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-secondary">
            <span className="material-symbols-outlined text-sm">place</span>
            <p className="font-body-md text-body-md">{venue}</p>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant/80 mt-3 pt-3 border-t border-outline-variant/30 italic">
            *Mohon maaf apabila terdapat kesalahan dalam penulisan nama atau gelar
          </p>
        </div>

        {/* Subtle Tap / Click Prompt */}
        <div className="flex flex-col items-center justify-center gap-2 pt-2">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-container/20 text-primary border border-primary-container/40 animate-pulse transition-all">
            <span className="material-symbols-outlined text-[18px]">
              touch_app
            </span>
            <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">
              Klik Sampul untuk Masuk
            </span>
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </div>
        </div>

        {/* Footer Hash & Audio Info */}
        <div className="mt-8 flex items-center justify-center gap-6 text-on-surface-variant opacity-75">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-primary-container">
              favorite
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">
              #RizalPutriStory
            </span>
          </div>
          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-primary-container">
              music_note
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">
              Audio Atmosphere
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
