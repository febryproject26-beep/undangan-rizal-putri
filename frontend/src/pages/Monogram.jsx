import React, { useState } from 'react';
import MonogramSvg from '../components/MonogramSvg';

export default function Monogram() {
  const [initials, setInitials] = useState('R & P');
  const [subtitle, setSubtitle] = useState('THE WEDDING');
  const [color, setColor] = useState('#c5a059');
  const [copied, setCopied] = useState(false);

  const colors = [
    { name: 'Champagne Gold', hex: '#c5a059' },
    { name: 'Rose Gold', hex: '#d8a499' },
    { name: 'Heirloom Sage', hex: '#536251' },
    { name: 'Deep Espresso', hex: '#352f2e' },
  ];

  const svgRaw = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <circle cx="80" cy="80" r="74" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="4 2"/>
  <circle cx="80" cy="80" r="70" fill="none" stroke="${color}" stroke-width="0.75"/>
  <path d="M80 16 C85 30 95 40 110 45 C95 50 85 60 80 74 C75 60 65 50 50 45 C65 40 75 30 80 16 Z" fill="none" stroke="${color}" stroke-width="1" opacity="0.6"/>
  <text x="80" y="88" font-family="'Playfair Display', serif" font-size="34" font-style="italic" font-weight="600" fill="${color}" text-anchor="middle" letter-spacing="2">${initials}</text>
  <text x="80" y="108" font-family="'Montserrat', sans-serif" font-size="9" font-weight="400" fill="#8f7e6d" text-anchor="middle" letter-spacing="4">${subtitle}</text>
</svg>`;

  const handleCopySvg = () => {
    navigator.clipboard.writeText(svgRaw).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([svgRaw], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monogram-${initials.replace(/[^a-zA-Z]/g, '')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center py-space-xl px-4 sm:px-margin min-h-[calc(100vh-160px)]">
      <div className="max-w-xl w-full text-center mb-space-lg">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
          Insignia &amp; Lambang Pernikahan
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1">
          Monogram Resmi
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          Lambang visual sakral persatuan dua insan dalam balutan tipografi klasik dan aksen emas mulia.
        </p>
      </div>

      {/* Monogram Display Card */}
      <div className="bg-surface-container-lowest p-8 sm:p-12 rounded-2xl shadow-xl border border-outline-variant/30 flex flex-col items-center max-w-md w-full relative">
        <div className="p-6 rounded-full bg-surface-container-low shadow-inner border border-primary-container/30 mb-6">
          <MonogramSvg
            initials={initials}
            subtitle={subtitle}
            size={200}
            strokeColor={color}
            textColor={color}
            className="transition-all duration-300"
          />
        </div>

        {/* Custom Controls */}
        <div className="w-full flex flex-col gap-4 text-left">
          <div>
            <label className="font-label-sm text-label-sm uppercase tracking-wider text-outline block mb-1">
              Inisial Mempelai
            </label>
            <input
              type="text"
              value={initials}
              onChange={(e) => setInitials(e.target.value)}
              className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface font-headline-sm focus:outline-none focus:ring-1 focus:ring-primary-container"
              maxLength={10}
            />
          </div>

          <div>
            <label className="font-label-sm text-label-sm uppercase tracking-wider text-outline block mb-1">
              Teks Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface font-label-md focus:outline-none focus:ring-1 focus:ring-primary-container"
              maxLength={25}
            />
          </div>

          <div>
            <label className="font-label-sm text-label-sm uppercase tracking-wider text-outline block mb-1.5">
              Pilihan Warna Aksen
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    color === c.hex ? 'scale-110 border-on-surface' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCopySvg}
              className="flex-1 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface font-label-md text-label-md uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Tersalin!' : 'Salin SVG'}</span>
            </button>
            <button
              onClick={handleDownloadSvg}
              className="flex-1 py-2 px-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-md text-label-md uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                download
              </span>
              <span>Unduh SVG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

