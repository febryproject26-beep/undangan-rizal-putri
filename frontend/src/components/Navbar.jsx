import React, { useState } from 'react';
import MonogramSvg from './MonogramSvg';

export default function Navbar({ activeSection = 'hero', onScrollTo, onSaveDate, onOpenCover }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (onScrollTo) {
      onScrollTo(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Beranda', sectionId: 'hero' },
    { label: 'Mempelai', sectionId: 'mempelai' },
    { label: 'Acara', sectionId: 'acara' },
    { label: 'Lokasi', sectionId: 'lokasi-acara' },
    { label: 'Galeri', sectionId: 'galeri' },
    { label: 'Love Story', sectionId: 'love-story' },
    { label: 'Amplop', sectionId: 'amplop-digital' },
    { label: 'Buku Tamu', sectionId: 'ucapan-form' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(43,38,37,0.04)] border-b border-outline-variant/20 transition-all duration-300">
      <div className="h-14 sm:h-20 max-w-[1080px] mx-auto px-4 sm:px-margin flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={(e) => handleLinkClick(e, 'hero')}
          className="flex items-center gap-space-sm text-left focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center p-1 shadow-sm border border-primary-container/20 group-hover:scale-105 transition-transform">
            <MonogramSvg initials="R&P" subtitle="" size={36} />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary tracking-wide leading-none">
              Rizal &amp; Putri
            </span>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest mt-0.5">
              The Royal Matrimony
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          {navItems.map((item, idx) => {
            const isActive = activeSection === item.sectionId;
            return (
              <a
                key={idx}
                href={`#${item.sectionId}`}
                onClick={(e) => handleLinkClick(e, item.sectionId)}
                className={`font-label-md text-label-md uppercase tracking-wider transition-colors relative py-1 ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container rounded-full animate-pulse"></span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-space-sm">
          {onOpenCover && (
            <button
              onClick={onOpenCover}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-label-sm font-label-sm uppercase tracking-wider rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
              title="Lihat Sampul Undangan"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">drafts</span>
              <span>Sampul</span>
            </button>
          )}

          <button
            onClick={onSaveDate}
            className="hidden md:inline-flex items-center justify-center px-space-md py-space-sm bg-primary-container text-on-primary-container font-label-md text-label-md uppercase tracking-widest rounded-full shadow-[0_4px_20px_rgba(197,160,89,0.25)] hover:bg-primary hover:text-on-primary transition-all duration-300"
            type="button"
          >
            Simpan Tanggal
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors"
            aria-label="Toggle Navigation Menu"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest/95 backdrop-blur-xl border-b border-outline-variant/30 shadow-xl px-margin py-space-md flex flex-col gap-2">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={`#${item.sectionId}`}
              onClick={(e) => handleLinkClick(e, item.sectionId)}
              className={`py-2 px-3 rounded-lg text-label-md font-label-md uppercase tracking-wider transition-colors ${
                activeSection === item.sectionId
                  ? 'bg-primary-container/20 text-primary font-semibold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2 border-t border-outline-variant/30">
            {onOpenCover && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCover();
                }}
                className="flex-1 py-2 px-space-md bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-widest rounded-full text-center"
                type="button"
              >
                Lihat Sampul
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSaveDate) onSaveDate();
              }}
              className="flex-1 py-2 px-space-md bg-primary-container text-on-primary-container font-label-md text-label-md uppercase tracking-widest rounded-full shadow-md text-center"
              type="button"
            >
              Simpan Tanggal
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
