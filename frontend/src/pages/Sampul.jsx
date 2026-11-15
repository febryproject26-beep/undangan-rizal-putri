import React, { useState, useEffect } from 'react';
import MonogramSvg from '../components/MonogramSvg';

export default function Sampul({
  onOpenInvitation,
  coupleTitle = 'Rizal & Putri',
  weddingDate = 'Jumat, 20 November 2026',
  venue = 'Cigugur, Kuningan',
  guestPropName = '',
  onGuestNameChange,
}) {
  // Role 1 = 'creator' (Pembuat Nama Tamu & Link Undangan)
  // Role 2 = 'guest' (Penerima Undangan - Bersih, tanpa tombol buat link)
  const [role, setRole] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      // Parameter khusus untuk mengaktifkan Role 1 (Pembuat Undangan)
      if (
        urlParams.get('role') === 'admin' ||
        urlParams.get('role') === 'creator' ||
        urlParams.get('admin') === 'true' ||
        urlParams.get('pengundang') === 'true'
      ) {
        try {
          localStorage.setItem('undangan_user_role', 'creator');
        } catch {}
        return 'creator';
      }

      // Jika membuka tautan khusus tamu (?to=... atau ?role=guest), WAJIB Role 2
      if (urlParams.get('to') || urlParams.get('role') === 'guest') {
        return 'guest';
      }

      // Cek apakah perangkat ini sebelumnya sudah login sebagai pembuat undangan
      try {
        const savedRole = localStorage.getItem('undangan_user_role');
        if (savedRole === 'creator') return 'creator';
      } catch {}
    }
    return 'guest'; // Default: Role 2 (Penerima Undangan)
  });

  const [guestName, setGuestName] = useState(() => {
    if (guestPropName) return guestPropName;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const guestParam =
        urlParams.get('to') ||
        urlParams.get('tamu') ||
        urlParams.get('nama') ||
        urlParams.get('u') ||
        urlParams.get('guest') ||
        urlParams.get('kpd') ||
        urlParams.get('kepada');
      if (guestParam) {
        try {
          return decodeURIComponent(guestParam.replace(/\+/g, ' ')).trim();
        } catch {
          return guestParam.replace(/\+/g, ' ').trim();
        }
      }
    }
    return '';
  });

  useEffect(() => {
    if (guestPropName !== undefined && guestPropName !== guestName) {
      setGuestName(guestPropName);
    }
  }, [guestPropName]);

  const [isOpening, setIsOpening] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [inputGuest, setInputGuest] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2800);
  };

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

  const handleOpenModal = (e) => {
    e.stopPropagation();
    setInputGuest(guestName || '');
    setIsCopied(false);
    setIsModalOpen(true);
  };

  const handleApplyName = (e) => {
    if (e) e.stopPropagation();
    const cleanName = inputGuest.trim();
    setGuestName(cleanName);
    if (onGuestNameChange) {
      onGuestNameChange(cleanName);
    }

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (cleanName) {
        url.searchParams.set('to', cleanName);
      } else {
        url.searchParams.delete('to');
      }
      window.history.replaceState(null, '', url.toString());
    }

    setIsModalOpen(false);
    showToast('Nama tamu berhasil diperbarui di sampul!');
  };

  const getFullShareLink = (nameToShare) => {
    if (typeof window === 'undefined') return '';
    const base = window.location.origin + window.location.pathname;
    const targetName = (nameToShare || '').trim();
    return targetName ? `${base}?to=${encodeURIComponent(targetName)}` : base;
  };

  const handleCopyLink = (e) => {
    if (e) e.stopPropagation();
    const cleanName = inputGuest.trim() || guestName.trim();
    const shareUrl = getFullShareLink(cleanName);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setIsCopied(true);
        showToast('Tautan undangan berhasil disalin!');
        setTimeout(() => setIsCopied(false), 2000);
      });
    } else {
      const tempInput = document.createElement('textarea');
      tempInput.value = shareUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      setIsCopied(true);
      showToast('Tautan undangan berhasil disalin!');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = (e) => {
    if (e) e.stopPropagation();
    const cleanName = inputGuest.trim() || guestName.trim() || 'Bapak/Ibu/Saudara/i';
    const shareUrl = getFullShareLink(cleanName);

    const waText = `Kepada Yth. Bapak/Ibu/Saudara/i *${cleanName}*,\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri momen istimewa pernikahan kami:\n\n*${coupleTitle}*\n🗓️ ${weddingDate}\n📍 ${venue}\n\nUntuk informasi jadwal & lokasi selengkapnya, silakan buka tautan undangan digital berikut:\n${shareUrl}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.\n\nTerima kasih.`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Toggle beralih ke Role 2 (Preview sebagai Tamu)
  const handleSwitchToGuest = (e) => {
    if (e) e.stopPropagation();
    setRole('guest');
    try {
      localStorage.setItem('undangan_user_role', 'guest');
    } catch {}
    showToast('Beralih ke Role 2 (Mode Penerima Undangan)');
  };

  // Verifikasi PIN untuk beralih ke Role 1 (Pembuat Undangan)
  const handleVerifyPin = (e) => {
    if (e) e.stopPropagation();
    if (pinInput.trim() === '2026' || pinInput.trim().toLowerCase() === 'admin') {
      setRole('creator');
      try {
        localStorage.setItem('undangan_user_role', 'creator');
      } catch {}
      setIsPinModalOpen(false);
      setPinInput('');
      setPinError('');
      showToast('Berhasil masuk ke Role 1 (Pembuat Undangan)!');
    } else {
      setPinError('PIN yang Anda masukkan salah!');
    }
  };

  return (
    <main
      onClick={handleClickCover}
      className="w-full min-h-screen bg-surface flex flex-col justify-center items-center relative overflow-y-auto py-6 sm:py-10 px-3 sm:px-6 select-none cursor-pointer"
      title="Klik buku sampul untuk masuk ke Beranda"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClickCover();
        }
      }}
    >
      {/* Toast Notification */}
      <div
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-inverse-surface text-inverse-on-surface rounded-full shadow-xl flex items-center justify-center gap-2 transition-all duration-300 pointer-events-none ${
          isToastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        <span className="material-symbols-outlined text-[18px] text-primary-fixed">
          check_circle
        </span>
        <span className="font-label-md text-xs sm:text-sm">
          {toastMessage}
        </span>
      </div>

      {/* Akses Role 1 (Discreet Lock Button di Sudut Kanan Atas) */}
      {role !== 'creator' && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPinInput('');
            setPinError('');
            setIsPinModalOpen(true);
          }}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-surface-container-high/30 hover:bg-surface-container-high text-on-surface-variant/30 hover:text-primary transition-all flex items-center justify-center text-xs"
          title="Akses Pembuat Undangan (Role 1)"
        >
          <span className="material-symbols-outlined text-[15px]">settings</span>
        </button>
      )}

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

      {/* Role 1 Status Pill (Hanya tampil saat Role 1 Aktif) */}
      {role === 'creator' && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-20 mb-3 px-3.5 py-1.5 rounded-full bg-primary-container/90 text-on-primary-container shadow-md border border-primary/30 flex items-center gap-2 text-xs font-medium"
        >
          <span className="material-symbols-outlined text-sm text-primary">
            admin_panel_settings
          </span>
          <span>Role 1: <strong>Pembuat Undangan</strong></span>
          <span className="w-1 h-1 rounded-full bg-primary/40"></span>
          <button
            type="button"
            onClick={handleSwitchToGuest}
            className="px-2 py-0.5 rounded-full bg-surface text-on-surface hover:bg-primary hover:text-on-primary text-[10px] font-semibold transition-all border border-outline-variant/30"
            title="Beralih ke tampilan penerima undangan (Role 2)"
          >
            Lihat Sebagai Tamu (Role 2)
          </button>
        </div>
      )}

      {/* Center Invitation Card (Buku Sampul) */}
      <div
        className={`relative z-10 w-full max-w-lg md:max-w-xl mx-auto bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl shadow-2xl px-4 py-6 sm:px-10 sm:py-10 md:px-14 md:py-12 text-center border border-primary-container/30 transition-all duration-500 ease-out transform ${
          isOpening
            ? 'scale-105 opacity-80'
            : 'hover:scale-[1.015] hover:shadow-[0_20px_50px_rgba(119,90,25,0.18)]'
        }`}
        id="invitation-card"
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3.5 sm:mb-5">
          <span className="w-8 sm:w-10 h-px bg-primary-container/40"></span>
          <span className="material-symbols-outlined text-primary-container text-xs">
            favorite
          </span>
          <span className="font-label-sm text-[10px] sm:text-label-sm uppercase tracking-widest text-primary font-semibold">
            The Holy Matrimony
          </span>
          <span className="material-symbols-outlined text-primary-container text-xs">
            favorite
          </span>
          <span className="w-8 sm:w-10 h-px bg-primary-container/40"></span>
        </div>

        {/* Monogram Crest Avatar */}
        <div className="relative mx-auto w-20 h-20 sm:w-28 sm:h-28 mb-3.5 sm:mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary-container/15 animate-ping opacity-30"></div>
          <div className="relative w-full h-full rounded-full bg-surface-container-low p-2 shadow-inner flex items-center justify-center border border-primary-container/30 group-hover:scale-105 transition-transform">
            <MonogramSvg initials="R & P" subtitle="WEDDING" size={80} className="w-full h-full" />
          </div>
        </div>

        {/* Couple Title & Date */}
        <div className="space-y-1 mb-4 sm:mb-6">
          <p className="font-body-md text-xs sm:text-body-md text-on-surface-variant italic">
            Bersama memohon rahmat dan ridho-Nya
          </p>
          <h1 className="font-display-lg text-4xl sm:text-5xl md:text-display-lg text-on-surface leading-tight tracking-tight">
            {coupleTitle}
          </h1>
          <div className="pt-1.5 sm:pt-2 flex items-center justify-center gap-2 sm:gap-3">
            <span className="h-px w-6 sm:w-8 bg-outline-variant"></span>
            <span className="font-label-md text-[11px] sm:text-label-md text-primary tracking-wider sm:tracking-widest uppercase font-medium">
              {weddingDate}
            </span>
            <span className="h-px w-6 sm:w-8 bg-outline-variant"></span>
          </div>
        </div>

        {/* Guest Name Box (Bagian Saudara / Saudari) */}
        <div className="bg-surface-container-low/90 rounded-2xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 shadow-sm max-w-md mx-auto relative overflow-hidden border border-outline-variant/30">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-80"></div>
          
          <p className="font-label-sm text-[10px] sm:text-label-sm text-on-surface-variant uppercase tracking-wider sm:tracking-widest mb-1.5 font-medium">
            Kepada Yth. Bapak / Ibu / Saudara / i:
          </p>
          
          <h2
            className="font-headline-sm text-lg sm:text-2xl text-primary mb-1.5 sm:mb-2 font-bold tracking-tight capitalize"
            id="guest-name"
          >
            {guestName || 'Tamu Undangan'}
          </h2>
          
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-secondary">
            <span className="material-symbols-outlined text-[13px] sm:text-sm">place</span>
            <p className="font-body-md text-xs sm:text-body-md">{venue}</p>
          </div>
          
          <p className="font-label-sm text-[8.5px] sm:text-label-sm text-on-surface-variant/80 mt-2.5 pt-2 sm:mt-3 sm:pt-3 border-t border-outline-variant/30 italic">
            *Mohon maaf apabila terdapat kesalahan dalam penulisan nama atau gelar
          </p>

          {/* Tombol Tulis Nama Tamu / Buat Link - HANYA MUNCUL DI ROLE 1 (PEMBUAT UNDANGAN) */}
          {role === 'creator' && (
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={handleOpenModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/40 hover:border-primary/50 text-on-surface-variant hover:text-primary text-[11px] sm:text-xs font-medium transition-all shadow-sm hover:shadow"
                title="Tulis nama tamu yang ingin diundang & buat tautan personal"
              >
                <span className="material-symbols-outlined text-[15px] text-primary">
                  edit_square
                </span>
                <span>Tulis Nama Tamu / Buat Link</span>
              </button>
            </div>
          )}
        </div>

        {/* Subtle Tap / Click Prompt */}
        <div className="flex flex-col items-center justify-center gap-2 pt-1">
          <div className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-primary-container/20 text-primary border border-primary-container/40 animate-pulse transition-all">
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
              touch_app
            </span>
            <span className="font-label-md text-xs sm:text-label-md uppercase tracking-wider font-semibold">
              Klik Sampul untuk Masuk
            </span>
            <span className="material-symbols-outlined text-[14px] sm:text-[16px]">
              arrow_forward
            </span>
          </div>
        </div>

        {/* Footer Hash & Audio Info */}
        <div className="mt-5 sm:mt-8 flex items-center justify-center gap-4 sm:gap-6 text-on-surface-variant opacity-75">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="material-symbols-outlined text-[11px] sm:text-xs text-primary-container">
              favorite
            </span>
            <span className="font-label-sm text-[9px] sm:text-label-sm uppercase tracking-wider sm:tracking-widest">
              #RizalPutriStory
            </span>
          </div>
          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="material-symbols-outlined text-[11px] sm:text-xs text-primary-container">
              music_note
            </span>
            <span className="font-label-sm text-[9px] sm:text-label-sm uppercase tracking-wider sm:tracking-widest">
              Audio Atmosphere
            </span>
          </div>
        </div>
      </div>

      {/* Modal Masuk Role 1 (PIN) */}
      {isPinModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsPinModalOpen(false);
          }}
        >
          <div
            className="bg-surface-container-lowest text-on-surface rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-outline-variant/30 text-left relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">lock</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Akses Role 1 (Pengundang)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPinModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="font-body-sm text-xs text-on-surface-variant mb-3 leading-relaxed">
              Masukkan PIN untuk mengaktifkan fitur pembuatan nama tamu dan tautan undangan:
            </p>

            <div className="mb-3">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleVerifyPin(e);
                  }
                }}
                placeholder="Masukkan PIN Rahasia"
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary outline-none text-on-surface text-sm text-center tracking-widest font-bold"
                autoFocus
              />
              {pinError && (
                <p className="text-[11px] text-error mt-1 text-center font-medium">{pinError}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleVerifyPin}
              className="w-full py-2 px-4 rounded-lg bg-primary-container text-on-primary-container font-semibold text-xs sm:text-sm hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Aktifkan Role 1</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal Tulis Nama Tamu & Buat Tautan Personal (HANYA DI ROLE 1) */}
      {role === 'creator' && isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(false);
          }}
        >
          <div
            className="bg-surface-container-lowest text-on-surface rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-outline-variant/30 text-left relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">
                  edit_note
                </span>
                <h3 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                  Tulis Nama Tamu Undangan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mb-4 leading-relaxed">
              Ketik nama tamu (teman, kerabat, atau keluarga). Nama ini akan muncul di bagian <strong>Bapak / Ibu / Saudara / i</strong> pada sampul depan undangan.
            </p>

            <div className="mb-4">
              <label className="block font-label-md text-xs font-semibold text-primary uppercase tracking-wider mb-1.5">
                Nama Tamu / Saudara(i)
              </label>
              <input
                type="text"
                value={inputGuest}
                onChange={(e) => setInputGuest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyName(e);
                  }
                }}
                placeholder="Contoh: Budi Santoso & Rekan"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface text-sm transition-all"
                autoFocus
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleApplyName}
                className="w-full py-2.5 px-4 rounded-lg bg-primary-container text-on-primary-container font-semibold text-sm hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>Terapkan ke Sampul</span>
              </button>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base text-primary">
                    {isCopied ? 'check' : 'content_copy'}
                  </span>
                  <span>{isCopied ? 'Tersalin!' : 'Salin Tautan'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-3 rounded-lg bg-[#25D366] text-white hover:bg-[#1EBE5D] font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>Kirim WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
