import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * FallingPetals - Romantic falling flower petals effect
 * Menggunakan HTML5 Canvas berkinerja tinggi (60 FPS) dengan fisika 3D flip,
 * ayunan angin lembut, dan palet warna kelopak bunga mawar & sakura bertema Aura Céleste.
 */
export default function FallingPetals({ isActive = true }) {
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);
  const petalsRef = useRef([]);
  const [isEnabled, setIsEnabled] = useState(true);

  // Palet kelopak bunga romantis yang selaras dengan tema Aura Céleste
  const petalPalettes = [
    // 1. Soft Rose Pink
    {
      base: 'rgba(235, 145, 160, 0.85)',
      mid: 'rgba(247, 202, 210, 0.75)',
      tip: 'rgba(255, 235, 240, 0.65)',
    },
    // 2. Rosy Peach
    {
      base: 'rgba(224, 138, 122, 0.85)',
      mid: 'rgba(244, 185, 165, 0.75)',
      tip: 'rgba(255, 235, 225, 0.65)',
    },
    // 3. Deep Blush Rose
    {
      base: 'rgba(205, 100, 120, 0.85)',
      mid: 'rgba(232, 150, 168, 0.75)',
      tip: 'rgba(255, 215, 225, 0.65)',
    },
    // 4. Romantic White Jasmine / Ivory Cream
    {
      base: 'rgba(240, 225, 220, 0.9)',
      mid: 'rgba(252, 243, 240, 0.8)',
      tip: 'rgba(255, 255, 255, 0.7)',
    },
    // 5. Warm Golden Glow Petal (Aura Céleste accent)
    {
      base: 'rgba(212, 175, 100, 0.85)',
      mid: 'rgba(235, 205, 145, 0.75)',
      tip: 'rgba(255, 245, 225, 0.65)',
    },
  ];

  // Helper membuat satu kelopak bunga
  const createPetal = useCallback((width, height, isInitial = false) => {
    const palette =
      petalPalettes[Math.floor(Math.random() * petalPalettes.length)];
    const size = 10 + Math.random() * 14; // Panjang kelopak ~10-24px

    return {
      x: Math.random() * width,
      // Saat awal dibuka, sebar di seluruh layar agar langsung terasa semarak romantis
      y: isInitial ? Math.random() * height : -30 - Math.random() * 50,
      w: size * (0.6 + Math.random() * 0.3),
      h: size,
      // Kecepatan jatuh santai dan anggun (0.8 - 2.0 px/frame)
      vy: 0.8 + Math.random() * 1.2,
      // Hembusan angin horizontal pelan
      vx: -0.3 + Math.random() * 0.8,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (-0.02 + Math.random() * 0.04) * 0.8,
      // Efek berputar 3D (tumbling wobble)
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.015 + Math.random() * 0.025,
      // Ayunan kiri-kanan lembut
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.01 + Math.random() * 0.02,
      swayAmplitude: 0.6 + Math.random() * 0.8,
      color: palette,
      opacity: 0.55 + Math.random() * 0.4,
    };
  }, []);

  useEffect(() => {
    if (!isActive || !isEnabled) {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Jumlah kelopak disesuaikan dengan ukuran layar untuk kinerja optimal
    const isMobile = width < 768;
    const petalCount = isMobile ? 18 : 32;

    // Inisialisasi kelopak bunga
    petalsRef.current = Array.from({ length: petalCount }, () =>
      createPetal(width, height, true)
    );

    let lastTime = performance.now();

    const render = (currentTime) => {
      const delta = Math.min((currentTime - lastTime) / 16.67, 2.0); // Normalisasi ke 60 FPS
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      const petals = petalsRef.current;
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Update animasi posisi
        p.sway += p.swaySpeed * delta;
        p.wobble += p.wobbleSpeed * delta;
        p.angle += p.angleSpeed * delta;

        p.x += (p.vx + Math.sin(p.sway) * p.swayAmplitude) * delta;
        p.y += p.vy * delta;

        // Reset saat kelopak menyentuh bagian bawah atau melewati batas samping
        if (p.y > height + 40 || p.x < -40 || p.x > width + 40) {
          petals[i] = createPetal(width, height, false);
          continue;
        }

        // Gambar kelopak bunga dengan lekukan kurva bezier organik
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        // Efek putaran 3D dengan scaling cosinus
        const scaleX = Math.cos(p.wobble);
        ctx.scale(scaleX, 1);
        ctx.globalAlpha = p.opacity * Math.max(0.3, Math.abs(scaleX));

        ctx.beginPath();
        ctx.moveTo(0, 0);
        // Kurva sisi kiri kelopak
        ctx.bezierCurveTo(
          -p.w * 0.7,
          -p.h * 0.35,
          -p.w * 0.8,
          -p.h * 0.85,
          0,
          -p.h
        );
        // Kurva sisi kanan kelopak
        ctx.bezierCurveTo(
          p.w * 0.8,
          -p.h * 0.85,
          p.w * 0.7,
          -p.h * 0.35,
          0,
          0
        );
        ctx.closePath();

        // Pewarnaan gradien romantis
        const grad = ctx.createLinearGradient(0, 0, 0, -p.h);
        grad.addColorStop(0, p.color.base);
        grad.addColorStop(0.55, p.color.mid);
        grad.addColorStop(1, p.color.tip);

        ctx.fillStyle = grad;
        ctx.fill();

        // Tulang halus tengah kelopak
        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.quadraticCurveTo(0, -p.h * 0.5, 0, -p.h * 0.8);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isActive, isEnabled, createPetal]);

  if (!isActive) return null;

  return (
    <>
      {/* Canvas Overlay Kelopak Bunga Gugur */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-1000 ${
          isEnabled ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Tombol Opsi Toggle Efek Bunga (Discreet Romantic Control) */}
      <button
        onClick={() => setIsEnabled((prev) => !prev)}
        className="fixed bottom-20 right-6 z-40 w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-primary border border-outline-variant/30 shadow-md flex items-center justify-center hover:bg-primary-container hover:text-on-primary-container transition-all text-xs"
        title={
          isEnabled
            ? 'Nonaktifkan Efek Bunga Gugur'
            : 'Aktifkan Efek Bunga Gugur'
        }
        aria-label="Toggle Efek Bunga Gugur"
        type="button"
      >
        <span className="material-symbols-outlined text-[17px]">
          {isEnabled ? 'spa' : 'filter_vintage'}
        </span>
      </button>
    </>
  );
}

