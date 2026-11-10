import React, { useState, useEffect } from 'react';

export default function Beranda({ onNavigate }) {
  // Target wedding date: Jumat, 20 November 2026 08:00 WIB (Akad Nikah)
  const targetDate = new Date('2026-11-20T08:00:00+07:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  const [calendarToastVisible, setCalendarToastVisible] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: String(days).padStart(2, '0'),
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0'),
        });
      } else {
        // Acara sudah berlangsung - tampilkan "Alhamdulillah" state
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleSaveCalendar = () => {
    setCalendarToastVisible(true);
    setTimeout(() => {
      setCalendarToastVisible(false);
    }, 4500);

    // Also offer Google Calendar link
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
    <div className="flex flex-col w-full">
      {/* Calendar Notification Toast */}
      <div
        className={`fixed top-24 right-6 z-50 transform transition-all duration-500 max-w-sm p-space-md rounded-xl bg-surface-container-lowest shadow-[0_16px_40px_rgba(43,38,37,0.16)] flex items-start gap-space-sm border border-outline-variant/30 ${calendarToastVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-[-120%] opacity-0 pointer-events-none'
          }`}
        id="calendar-toast"
      >
        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[18px]">
            event_available
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-title-md text-title-md text-on-surface">
            Acara Telah Ditambahkan
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Jadwal pernikahan Rizal &amp; Putri siap disinkronkan ke kalender perangkat Anda.
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative w-full overflow-hidden bg-surface-container-lowest min-h-screen sm:min-h-0"
      >
        <div className="absolute inset-0 z-0 opacity-40">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCme_5NWhjUas-JOslPaBIGDqkOkd0yTlZ-MOA4-NFEthzxNTCop712qAMJl8qLezPJs6DcQQTgKhZ_S2jbuHUls32mtlMrU-ZIWg3DIKnrS_Q1cjkCpii6SpGRs921CGLgEwcVyTYyY54NbNyUoAJ4OKe1XyyBX_r1wKzv4sHStOAg7lFs4P2GQuRyOCF2yriHHaIhIMKhT-2OLs6kJ8BA9a4Dz9Y0VeRNQqEQf-MQBX89iKo646eo')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-surface/30 via-surface/60 to-surface"></div>
        </div>

        <div className="relative z-10 max-w-[1080px] mx-auto px-4 sm:px-margin pt-16 sm:pt-space-xl pb-space-xl flex flex-col items-center text-center">
          {/* Decorative Emblem */}
          <div className="inline-flex items-center gap-space-sm mb-space-md">
            <span className="w-10 h-px bg-primary-container"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
              Walimatul Ursy
            </span>
            <span className="w-10 h-px bg-primary-container"></span>
          </div>

          {/* Sacred Basmalah */}
          <p className="font-headline-md text-headline-md text-primary tracking-wide mb-space-sm">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          {/* Sacred Verse / Quote */}
          <blockquote className="max-w-2xl mx-auto mb-space-lg">
            <p className="font-body-lg text-body-lg text-on-surface-variant italic leading-relaxed">
              “Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan
              pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung
              dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa
              kasih dan sayang.”
            </p>
            <cite className="block font-label-md text-label-md uppercase tracking-widest text-outline mt-space-xs font-semibold not-italic">
              — QS. Ar-Rum: 21 —
            </cite>
          </blockquote>

          {/* Couple Names Main Showcase */}
          <div className="my-space-md flex flex-col items-center">
            <span className="font-label-sm text-label-sm tracking-[0.25em] text-outline uppercase mb-space-xs">
              Janji Suci
            </span>
            <h1 className="text-5xl sm:text-6xl md:font-display-lg md:text-display-lg text-on-surface tracking-tight font-normal leading-tight">
              Rizal{' '}
              <span className="italic font-normal text-primary-container">
                &amp;
              </span>{' '}
              Putri
            </h1>
            <p className="text-[10px] sm:font-label-md sm:text-label-md uppercase tracking-[0.15em] sm:tracking-[0.2em] text-outline mt-space-xs">
              Jum'at, 20 November 2026 • Cigugur, Kuningan
            </p>
          </div>

          {/* Interactive Countdown Box */}
          <div className="w-full max-w-xs sm:max-w-xl mx-auto mt-space-md mb-space-lg p-3 sm:p-space-md rounded-xl bg-surface-container-low/90 backdrop-blur-md shadow-[0_12px_40px_rgba(43,38,37,0.06)] border border-outline-variant/30">
            <div className="text-center mb-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                Menghitung Hari Bahagia
              </span>
            </div>
            <div
              className="grid grid-cols-4 gap-2 sm:gap-space-sm text-center"
              id="wedding-countdown"
            >
              <div className="flex flex-col items-center justify-center py-3 sm:p-space-sm rounded-lg bg-surface-container-lowest shadow-sm">
                <span
                  className="text-2xl sm:font-headline-lg sm:text-headline-lg text-primary font-bold leading-none"
                  id="cd-days"
                >
                  {timeLeft.days}
                </span>
                <span className="text-[9px] sm:font-label-sm sm:text-label-sm uppercase text-outline mt-1">
                  Hari
                </span>
              </div>
              <div className="flex flex-col items-center justify-center py-3 sm:p-space-sm rounded-lg bg-surface-container-lowest shadow-sm">
                <span
                  className="text-2xl sm:font-headline-lg sm:text-headline-lg text-primary font-bold leading-none"
                  id="cd-hours"
                >
                  {timeLeft.hours}
                </span>
                <span className="text-[9px] sm:font-label-sm sm:text-label-sm uppercase text-outline mt-1">
                  Jam
                </span>
              </div>
              <div className="flex flex-col items-center justify-center py-3 sm:p-space-sm rounded-lg bg-surface-container-lowest shadow-sm">
                <span
                  className="text-2xl sm:font-headline-lg sm:text-headline-lg text-primary font-bold leading-none"
                  id="cd-minutes"
                >
                  {timeLeft.minutes}
                </span>
                <span className="text-[9px] sm:font-label-sm sm:text-label-sm uppercase text-outline mt-1">
                  Menit
                </span>
              </div>
              <div className="flex flex-col items-center justify-center py-3 sm:p-space-sm rounded-lg bg-surface-container-lowest shadow-sm">
                <span
                  className="text-2xl sm:font-headline-lg sm:text-headline-lg text-primary font-bold leading-none"
                  id="cd-seconds"
                >
                  {timeLeft.seconds}
                </span>
                <span className="text-[9px] sm:font-label-sm sm:text-label-sm uppercase text-outline mt-1">
                  Detik
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-space-md">
            <button
              onClick={handleSaveCalendar}
              className="inline-flex items-center gap-space-xs px-space-lg py-space-sm bg-surface-container-highest text-on-surface font-label-md text-label-md uppercase tracking-widest rounded-full shadow-sm hover:bg-surface-variant transition-colors duration-200"
              id="add-calendar-btn"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">
                calendar_today
              </span>
              Simpan ke Kalender
            </button>
          </div>
        </div>
      </section>

      {/* Profil Mempelai Section */}
      <section
        id="mempelai"
        className="w-full max-w-[1080px] mx-auto px-4 sm:px-margin py-10 sm:py-space-xl"
      >
        <div className="text-center max-w-xl mx-auto mb-space-xl">
          <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-primary font-semibold">
            Dua Jiwa Satu Tujuan
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-xs">
            Pasangan Mempelai
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
            Dengan memohon rahmat dan ridho Allah Subhanahu wa Ta'ala, kami
            bermaksud melangsungkan janji suci pernikahan kami berdua.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl items-stretch">
          {/* Groom Profile Card */}
          <div className="group relative flex flex-col items-center text-center p-space-lg rounded-xl bg-surface-container-low shadow-[0_8px_30px_rgba(43,38,37,0.04)] transition-all duration-300 hover:shadow-[0_16px_45px_rgba(43,38,37,0.08)] border border-outline-variant/30">
            <div className="absolute top-4 left-4 flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-widest text-outline">
              <span className="material-symbols-outlined text-primary text-[14px]">
                spa
              </span>
              <span>Sang Mempelai Pria</span>
            </div>

            <div className="w-44 h-60 sm:w-56 sm:h-72 md:w-64 md:h-80 my-space-md overflow-hidden rounded-t-[80px] sm:rounded-t-[100px] rounded-b-xl shadow-md bg-surface-container border border-primary-container/20">
              <img
                alt="Rizal Rofiqallah S.Pd"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="/images/mempelai/rizal.jpeg"
              />
            </div>

            <h3 className="font-headline-md text-headline-md text-on-surface">
              Rizal Rofiqallah S.Pd.
            </h3>
            <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-medium mt-1">
              Putra Kedua
            </span>
            <div className="mt-space-md text-on-surface-variant font-body-md text-body-md">
              <p className="text-outline uppercase font-label-sm text-label-sm tracking-wider mb-1">
                Keluarga Terhormat
              </p>
              <p className="font-medium text-on-surface">
                Bapak Mohammad Hasyim (alm)
              </p>
              <p className="font-medium text-on-surface">
                &amp; Ibu Yanah
              </p>
              <p className="text-outline text-label-sm font-label-sm mt-1">
                Cigugur, Kuningan
              </p>
            </div>

            <a
              className="mt-space-lg inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-highest text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
              href="https://instagram.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[16px]">
                photo_camera
              </span>
              <span className="font-label-sm text-label-sm font-semibold tracking-wider">
                @Ibnhasyim02
              </span>
            </a>
          </div>

          {/* Bride Profile Card */}
          <div className="group relative flex flex-col items-center text-center p-space-lg rounded-xl bg-surface-container-low shadow-[0_8px_30px_rgba(43,38,37,0.04)] transition-all duration-300 hover:shadow-[0_16px_45px_rgba(43,38,37,0.08)] border border-outline-variant/30">
            <div className="absolute top-4 right-4 flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-widest text-outline">
              <span>Sang Mempelai Wanita</span>
              <span className="material-symbols-outlined text-primary text-[14px]">
                spa
              </span>
            </div>

            <div className="w-44 h-60 sm:w-56 sm:h-72 md:w-64 md:h-80 my-space-md overflow-hidden rounded-t-[80px] sm:rounded-t-[100px] rounded-b-xl shadow-md bg-surface-container border border-primary-container/20">
              <img
                alt="Putri Nabila Maelani"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="/images/mempelai/putri.jpeg"
              />
            </div>

            <h3 className="font-headline-md text-headline-md text-on-surface">
              Putri Nabila Maelani
            </h3>
            <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-medium mt-1">
              Putri Ketiga
            </span>
            <div className="mt-space-md text-on-surface-variant font-body-md text-body-md">
              <p className="text-outline uppercase font-label-sm text-label-sm tracking-wider mb-1">
                Keluarga Terhormat
              </p>
              <p className="font-medium text-on-surface">
                Bapak Supardi
              </p>
              <p className="font-medium text-on-surface">
                &amp; Ibu Tukiyem (alm)
              </p>
              <p className="text-outline text-label-sm font-label-sm mt-1">
                Cigugur, Kuningan
              </p>
            </div>

            <a
              className="mt-space-lg inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-highest text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
              href="https://instagram.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[16px]">
                photo_camera
              </span>
              <span className="font-label-sm text-label-sm font-semibold tracking-wider">
                @Nabillaaaputrii_
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Event Overview Section */}
      <section id="acara" className="w-full bg-surface-container py-10 sm:py-space-xl">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-margin">
          <div className="text-center mb-space-lg">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
              Ikhtisar Acara
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-xs">
              Hari Pelaksanaan
            </h2>
          </div>

          {/* Hari Pelaksanaan Card - Posisikan di Tengah */}
          <div className="flex justify-center items-center w-full">
            <div className="w-full max-w-xl p-space-lg sm:p-space-xl rounded-2xl bg-surface-container-lowest shadow-md flex flex-col justify-between border border-outline-variant/30 text-center">
              <div>
                <div className="inline-flex items-center justify-center gap-space-xs px-space-md py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold uppercase tracking-wider mb-space-md shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">
                    auto_stories
                  </span>
                  <span>Akad Nikah</span>
                </div>

                <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs text-center">
                  Prosesi Ijab Kabul
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg max-w-md mx-auto leading-relaxed text-center">
                  Khidmat prosesi sakral pengucapan janji setia di hadapan
                  penghulu dan keluarga inti.
                </p>

                <div className="bg-surface-container-low/70 rounded-xl p-space-md space-y-3 font-body-md text-body-md text-on-surface border border-outline-variant/20 max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-space-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      schedule
                    </span>
                    <span className="font-semibold">08.00 – 10.30 WIB</span>
                  </div>
                  <div className="flex items-center justify-center gap-space-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      location_on
                    </span>
                    <span>
                      Kediaman Mempelai Wanita (Lingk. Manis RT.02 RW.01, Cigugur, Kuningan)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-space-lg pt-space-md flex flex-col items-center gap-2 border-t border-outline-variant/30 text-center sm:flex-row sm:justify-between">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  Busana: Sopan dan rapi
                </span>
                <span className="font-label-md text-label-md font-semibold text-primary">
                  Semua Tamu Undangan
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lokasi Acara Section */}
      <section
        id="lokasi-acara"
        className="w-full max-w-[1080px] mx-auto px-4 sm:px-margin py-10 sm:py-space-xl"
      >
        <div className="text-center max-w-xl mx-auto mb-space-xl">
          <div className="inline-flex items-center gap-space-sm mb-space-xs">
            <span className="w-8 h-px bg-primary-container"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-primary font-semibold">
              Panduan Lokasi
            </span>
            <span className="w-8 h-px bg-primary-container"></span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-xs">
            Lokasi &amp; Peta Acara
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
            Suatu kehormatan bagi kami menyambut kehadiran Bapak/Ibu/Saudara/i di
            hari bahagia kami di kediaman mempelai berikut.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-stretch">
          {/* Venue Details */}
          <div className="flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-low shadow-[0_8px_30px_rgba(43,38,37,0.04)] border border-outline-variant/30">
            <div>
              <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider mb-space-sm font-semibold">
                <span className="material-symbols-outlined text-[16px]">
                  pin_drop
                </span>
                <span>Titik Lokasi Acara</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
                Kediaman Mempelai Wanita
              </h3>
              <p className="font-title-md text-title-md text-primary mb-space-sm">
                Cigugur, Kabupaten Kuningan
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-outline text-[20px] shrink-0 mt-0.5">
                  location_on
                </span>
                <span className="font-medium text-on-surface">
                  Lingk. Manis RT.02 RW.01 Kel. Cigugur, Kec. Cigugur, Kab. Kuningan, Jawa Barat 45552
                </span>
              </p>

              <div className="pt-space-md border-t border-outline-variant/40 space-y-space-sm">
                <div className="flex items-start gap-space-sm">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      directions_car
                    </span>
                  </div>
                  <div>
                    <span className="font-label-md text-label-md font-semibold text-on-surface block">
                      Akses Kendaraan &amp; Parkir
                    </span>
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      Dapat diakses dengan mudah melalui jalan utama Cigugur. Tersedia area parkir kendaraan untuk roda dua dan roda empat.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-space-sm">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      navigation
                    </span>
                  </div>
                  <div>
                    <span className="font-label-md text-label-md font-semibold text-on-surface block">
                      Panduan Rute
                    </span>
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      Gunakan navigasi Google Maps atau Waze melalui tombol di bawah untuk panduan rute GPS langsung dan akurat.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-space-sm mt-space-lg pt-space-md border-t border-outline-variant/40">
              <a
                className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-full shadow-[0_4px_20px_rgba(197,160,89,0.25)] hover:bg-primary-container hover:text-on-primary-container transition-all duration-300 w-full sm:w-auto"
                href="https://maps.app.goo.gl/6224MCix1avTx3YQ8?g_st=ac"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[18px]">
                  map
                </span>
                <span>Buka di Google Maps</span>
              </a>
              <a
                className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm bg-surface-container-highest text-on-surface font-label-md text-label-md uppercase tracking-wider rounded-full hover:bg-surface-variant transition-colors w-full sm:w-auto"
                href="https://waze.com/ul?ll=-6.969173,108.460826&navigate=yes"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">
                  explore
                </span>
                <span>Petunjuk Rute / Buka Waze</span>
              </a>
            </div>
          </div>

          {/* Interactive Live Map Embed */}
          <div className="relative min-h-[400px] rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(43,38,37,0.08)] border border-outline-variant/40 bg-surface-container flex flex-col">
            <div className="p-space-md flex items-center justify-between bg-surface-container-lowest border-b border-outline-variant/30">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  share_location
                </span>
                <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface">
                  Peta Navigasi Langsung
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                Cigugur, Kuningan
              </span>
            </div>

            {/* Embedded Live Google Maps */}
            <div className="relative flex-1 w-full min-h-[290px] bg-surface-container-low">
              <iframe
                title="Peta Lokasi Pernikahan Rizal & Putri"
                src="https://maps.google.com/maps?q=-6.9691726,108.460826&hl=id&z=16&output=embed"
                className="w-full h-full min-h-[300px] border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="p-space-sm bg-surface-container-lowest/95 backdrop-blur-md flex items-center justify-between text-label-sm font-label-sm text-outline border-t border-outline-variant/30 px-space-md">
              <span>Koordinat: -6.9692, 108.4608</span>
              <a
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                href="https://maps.app.goo.gl/6224MCix1avTx3YQ8?g_st=ac"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Perbesar Peta</span>
                <span className="material-symbols-outlined text-[14px]">
                  open_in_new
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick CTA to Ucapan */}
      <section className="w-full bg-surface-container-low py-space-lg border-t border-outline-variant/30">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-margin flex flex-col sm:flex-row items-center justify-between gap-space-md text-center sm:text-left">
          <div className="text-center sm:text-left">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Kirimkan Doa &amp; Konfirmasi Kehadiran
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Tuliskan pesan doa restu Anda dalam Buku Tamu Digital kami.
            </p>
          </div>
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate('ucapan-form');
              } else {
                document.getElementById('ucapan-form')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-space-lg py-space-sm bg-primary-container text-on-primary-container font-label-md text-label-md uppercase tracking-widest rounded-full shadow-md hover:bg-primary hover:text-on-primary transition-all duration-300 shrink-0"
            type="button"
          >
            Buku Tamu &amp; RSVP
          </button>
        </div>
      </section>
    </div>
  );
}

