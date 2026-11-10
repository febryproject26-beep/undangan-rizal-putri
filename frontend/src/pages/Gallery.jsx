import React, { useState } from 'react';

export default function Gallery({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const galleryItems = [
    {
      id: 1,
      category: 'prewed',
      src: '/images/gallery/1.jpeg',
      tag: 'Pre-Wedding • Romansa Klasik',
      title: 'Gema Janji Dalam Sunyi',
      alt: 'Foto Pre-Wedding Rizal & Putri 1',
    },
    {
      id: 2,
      category: 'prewed',
      src: '/images/gallery/2.jpeg',
      tag: 'Pre-Wedding • Tatap Kasih',
      title: 'Langkah Beriringan',
      alt: 'Foto Pre-Wedding Rizal & Putri 2',
    },
    {
      id: 3,
      category: 'momen',
      src: '/images/gallery/3.jpeg',
      tag: 'Momen Bahagia • Senyuman Restu',
      title: 'Keanggunan Abadi',
      alt: 'Foto Momen Bahagia Rizal & Putri 3',
    },
    {
      id: 4,
      category: 'momen',
      src: '/images/gallery/4.jpeg',
      tag: 'Momen Bahagia • Untaian Doa',
      title: 'Harmoni Dua Jiwa',
      alt: 'Foto Momen Bahagia Rizal & Putri 4',
    },
  ];

  const filteredItems = galleryItems.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <div className="flex flex-col w-full">
      {/* Photo Showcase Section */}
      <section id="galeri" className="relative w-full overflow-hidden pb-10 sm:pb-space-xl">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-margin">
          {/* Header & Category Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pt-6 sm:pt-space-lg mb-8 sm:mb-space-xl">
            <div className="flex flex-col max-w-xl">
              <div className="flex items-center gap-space-xs mb-space-xs">
                <span className="w-6 h-[1px] bg-primary"></span>
                <span className="font-label-sm text-[10px] sm:text-label-sm text-primary uppercase tracking-widest font-semibold">
                  Babak I • Dokumentasi Memori
                </span>
              </div>
              <h2 className="font-headline-lg text-2xl sm:text-headline-lg text-on-surface">
                Potret Kenangan Abadi
              </h2>
              <p className="font-body-md text-xs sm:text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
                Rangkaian kilasan visual yang merekam tatap, senyum, dan kehangatan rasa dalam menyambut awal lembaran baru kami berdua.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 sm:gap-space-xs p-1 bg-surface-container-high rounded-full overflow-x-auto self-start md:self-auto shadow-sm border border-outline-variant/30 text-xs sm:text-label-md">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'prewed', label: 'Pre-Wedding' },
                { id: 'momen', label: 'Momen Bahagia' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 sm:px-space-md py-1 sm:py-space-xs rounded-full font-label-md text-[11px] sm:text-label-md tracking-wider uppercase transition-all duration-300 ${
                    activeCategory === tab.id
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid 4 Foto */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-space-md items-stretch" id="gallery-grid">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="gallery-item group relative overflow-hidden rounded-2xl bg-surface-container shadow-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-outline-variant/30"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    src={item.src}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-space-md text-inverse-on-surface">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed-dim font-medium">
                      {item.tag}
                    </span>
                    <p className="font-headline-sm text-headline-sm mt-1 text-white">
                      {item.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Love Story Timeline Section */}
      <section id="love-story" className="w-full py-10 sm:py-space-xl relative">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-margin">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-space-xl">
            <div className="inline-flex items-center gap-space-xs mb-space-xs">
              <span className="w-4 h-[1px] bg-primary"></span>
              <span className="font-label-sm text-[10px] sm:text-label-sm text-primary uppercase tracking-widest font-semibold">
                Babak II • Kisah Cinta Kami
              </span>
              <span className="w-4 h-[1px] bg-primary"></span>
            </div>
            <h2 className="font-headline-lg text-2xl sm:text-headline-lg text-on-surface">
              Untaian Takdir &amp; Waktu
            </h2>
            <p className="font-body-md text-xs sm:text-body-md text-on-surface-variant mt-space-xs leading-relaxed px-2">
              Setiap perjumpaan telah digariskan dengan sempurna. Inilah perjalanan hati yang membawa kami melangkah bersama menuju ikrar suci.
            </p>
          </div>

          <div className="relative w-full max-w-4xl mx-auto">
            {/* Center Timeline Spine */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-8 -translate-x-1/2 w-[1px] bg-outline-variant"></div>

            <div className="flex flex-col gap-space-xl">
              {/* Event 1: 2020 */}
              <div className="relative flex flex-col md:flex-row items-center gap-4 sm:gap-space-lg">
                <div className="w-full md:w-1/2 md:pr-space-lg text-left md:text-right">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    2020
                  </span>
                  <h4 className="font-headline-md text-headline-md text-on-surface mt-1">
                    Pertama Bertemu
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
                    Di sebuah simposium arsitektur di Bandung, pandangan kami pertama kali bertemu. Berawal dari diskusi tentang estetika ruang dan harmoni garis, kami menemukan ruang nyaman dalam pikiran masing-masing.
                  </p>
                  <div className="flex md:justify-end items-center gap-space-xs mt-space-sm text-outline font-label-sm text-label-sm uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">
                      location_on
                    </span>
                    <span>Bandung Art Center</span>
                  </div>
                </div>

                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-surface-container-high border-2 border-primary-container items-center justify-center shadow-sm z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                </div>

                <div className="w-full md:w-1/2 md:pl-space-lg">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-surface-container border border-outline-variant/30">
                    <img
                      alt="Pertama Bertemu di Bandung Art Center"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuArpgu45s_tdbEapM6ddXkpBr1iQSNXPdJlsY-mKov4zcLeCDR3k7XWw2dWBv9NevOH9LjVWgNEoDZZP8QLpLRiNQA8s8C4FQB8RD5Ndqqojl_14guD2gCutBWbt7i6mV-Jnzm92sqBEwhV6FyDik5ex9xewhjie94nbKN3u4IYfWg5vSZ2AXxhDoYgpL4t4rU8padEoLxESUB4WVX0rkKRI1VpQZQcaXMO9hOyMH3xnfYSqpmkmuXH"
                    />
                  </div>
                </div>
              </div>

              {/* Event 2: 2022 */}
              <div className="relative flex flex-col md:flex-row-reverse items-center gap-4 sm:gap-space-lg">
                <div className="w-full md:w-1/2 md:pl-space-lg text-left">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    2022
                  </span>
                  <h4 className="font-headline-md text-headline-md text-on-surface mt-1">
                    Menjalin Hubungan
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
                    Dua tahun berselang dalam ikatan persahabatan yang tulus, kami menyadari bahwa cinta hadir tanpa suara keras. Kami bersepakat untuk saling menjaga, tumbuh, dan menjadi rumah bagi kepulangan satu sama lain.
                  </p>
                  <div className="flex items-center gap-space-xs mt-space-sm text-outline font-label-sm text-label-sm uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">
                      favorite
                    </span>
                    <span>Komitmen Berdua</span>
                  </div>
                </div>

                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-surface-container-high border-2 border-primary-container items-center justify-center shadow-sm z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                </div>

                <div className="w-full md:w-1/2 md:pr-space-lg">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-surface-container border border-outline-variant/30">
                    <img
                      alt="Menjalin Hubungan"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBigANAynkxy_0UqCrZEw2oJ3DE8fYMvi4qQwvU-bvfYHrW_Cldz_dY-5H_lPGOtOi_IAJcsRR86hoS_OY8PJF67speinUs5MQiUHw4TCyJWLXMSxG54F_wAaUHYmPbJ8sDfLHqoP32KSrvirV2obj51Itu71FwdOX7JzqN4dSACoe4TgUvkFY-soz2WposWCFKGVqtgAMZoj1jnuhhxiNiLIrg1GaygmEPsNqxPJlrGiRPnNLfvTut"
                    />
                  </div>
                </div>
              </div>

              {/* Event 3: 2025 */}
              <div className="relative flex flex-col md:flex-row items-center gap-4 sm:gap-space-lg">
                <div className="w-full md:w-1/2 md:pr-space-lg text-left md:text-right">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    2025
                  </span>
                  <h4 className="font-headline-md text-headline-md text-on-surface mt-1">
                    Hari Lamaran
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
                    Di hadapan kedua orang tua dan keluarga besar tercinta, Rizal menyematkan cincin pengikat janji. Hari penuh haru di mana dua keluarga besar bersatu dalam doa yang sama untuk kelancaran niat suci kami.
                  </p>
                  <div className="flex md:justify-end items-center gap-space-xs mt-space-sm text-outline font-label-sm text-label-sm uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">
                      diamond
                    </span>
                    <span>Kediaman Keluarga Daniswara</span>
                  </div>
                </div>

                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-surface-container-high border-2 border-primary-container items-center justify-center shadow-sm z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                </div>

                <div className="w-full md:w-1/2 md:pl-space-lg">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-surface-container border border-outline-variant/30">
                    <img
                      alt="Hari Lamaran"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvuk2pT6CD4NGsXB0TS_FUZS-lkkXC1YH5pnuurbkx2zQsVw8rbRvXWe2oSZkURP3FWXgWQEvor86bqro1a3UXWqOA7295qIn7wA8OfZKGqZRTs6Gy6V1HaUZfZwcBA7ASEkEFtS2CNscoJsbHwvSkv0slgBucqwKL-aR-p6vkDiBWOUiFT-Vlbujj8DVWPM7vwnxvkcwHixtmhFNZx46z4Ww1KDhH2HOUc_CjkK1MR5yQgN010vXE"
                    />
                  </div>
                </div>
              </div>

              {/* Event 4: 2026 */}
              <div className="relative flex flex-col md:flex-row-reverse items-center gap-4 sm:gap-space-lg">
                <div className="w-full md:w-1/2 md:pl-space-lg text-left">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    2026
                  </span>
                  <h4 className="font-headline-md text-headline-md text-on-surface mt-1">
                    Menuju Pelaminan
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
                    Babak puncak dari kerinduan panjang kami. Dengan restu semesta dan ketulusan doa Anda semua, kami bersiap melangkah mengikat janji seumur hidup di hadapan Sang Maha Kuasa.
                  </p>
                  <div className="flex items-center gap-space-xs mt-space-sm text-outline font-label-sm text-label-sm uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">
                      celebration
                    </span>
                    <span>The Grand Matrimony</span>
                  </div>
                </div>

                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md z-10">
                  <span className="material-symbols-outlined text-[18px]">
                    favorite
                  </span>
                </div>

                <div className="w-full md:w-1/2 md:pr-space-lg">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-surface-container border border-outline-variant/30">
                    <img
                      alt="Menuju Pelaminan"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnBfeLpFJsQKMDeOHK8K7g6lf7yFCxh1B6ftf1MpApBEa3iSm61ftvjnhbTsUcIHX0zI9tL1XOssu26dC-_kxpZsw5Hkc8v5NhCi4SoVLcp_j4-BychU7KeO4elDGmc2bKCh2kgUEUfAm421xI0xyYR4e9VM10HIclK6BvIstDJBTCktYc3P7zl-4ejujLSuG5L8ZTm2uEnfonO3mLDyP4pleNrneL-3JRuD4dDmCq7FY5mPtD4nP_"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-surface-container py-10 sm:py-space-xl border-t border-outline-variant/30">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-margin text-center">
          <div className="max-w-xl mx-auto flex flex-col items-center">
            <span className="material-symbols-outlined text-primary text-4xl mb-space-xs">
              mark_email_read
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Menjadi Bagian dari Hari Bahagia Kami
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs mb-space-lg">
              Kehadiran serta doa restu Bapak/Ibu/Saudara/i sekalian adalah hadiah paling berharga untuk mengawali perjalanan rumah tangga kami.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-space-md">
              <button
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('ucapan-form');
                  } else {
                    document.getElementById('ucapan-form')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center justify-center px-space-lg py-space-sm bg-primary-container text-on-primary-container font-label-md text-label-md uppercase tracking-widest rounded-full shadow-md hover:bg-primary hover:text-on-primary transition-all duration-300"
                type="button"
              >
                Kirim Doa &amp; RSVP
              </button>
              <button
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('acara');
                  } else {
                    document.getElementById('acara')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center justify-center px-space-lg py-space-sm bg-surface-container-high text-on-surface font-label-md text-label-md uppercase tracking-widest rounded-full hover:bg-surface-variant transition-colors"
                type="button"
              >
                Rangkaian Acara
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/85 backdrop-blur-md p-4 sm:p-8"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-surface-container-lowest rounded-xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 bg-surface-container-high border-b border-outline-variant/30">
              <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-semibold">
                {selectedPhoto.tag}
              </span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-variant"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="w-full max-h-[70vh] object-contain bg-black"
            />
            <div className="p-4 bg-surface-container-lowest">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                {selectedPhoto.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

