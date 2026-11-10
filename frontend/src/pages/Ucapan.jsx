import React, { useState, useEffect } from 'react';
import { getWishes, createWish, confirmGift } from '../services/api';

export default function Ucapan() {
  const [selectedCategory, setSelectedCategory] = useState('Keluarga');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [attendance, setAttendance] = useState('hadir'); // 'hadir' | 'berhalangan'
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalWishesCount, setTotalWishesCount] = useState(0);

  // Modal konfirmasi kirim kado/amplop
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [giftSender, setGiftSender] = useState('');
  const [giftBank, setGiftBank] = useState('BCA (a.n. Putri Nabila Maelani)');
  const [giftAmount, setGiftAmount] = useState('');
  const [giftNotes, setGiftNotes] = useState('');
  const [isSubmittingGift, setIsSubmittingGift] = useState(false);

  const [wishes, setWishes] = useState([]);

  // Ambil data ucapan dari backend database saat komponen dimuat
  useEffect(() => {
    let isMounted = true;

    getWishes()
      .then((res) => {
        if (isMounted && res && res.data && res.data.length > 0) {
          setWishes(res.data);
          if (res.stats && res.stats.totalWishes) {
            setTotalWishesCount(res.stats.totalWishes);
          }
        }
      })
      .catch((err) => {
        console.warn('Backend API belum terhubung, menggunakan data lokal awal:', err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3200);
  };

  const copyToClipboard = (text, label) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`${label} berhasil disalin!`);
      });
    } else {
      const tempInput = document.createElement('textarea');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast(`${label} berhasil disalin!`);
    }
  };

  // Submit form ucapan & doa ke backend
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      category: selectedCategory,
      attendance,
      pax: attendance === 'hadir' ? '1 Orang' : '-',
      message: message.trim(),
    };

    try {
      const res = await createWish(payload);
      if (res && res.data) {
        setWishes((prev) => [res.data, ...prev]);
        if (res.stats && res.stats.totalWishes) {
          setTotalWishesCount(res.stats.totalWishes);
        } else {
          setTotalWishesCount((prev) => prev + 1);
        }
      }
      setName('');
      setMessage('');
      showToast('Doa & ucapan restu Anda berhasil disimpan!');
    } catch (err) {
      console.warn('Gagal simpan ke backend, beralih ke state lokal:', err.message);
      // Fallback lokal jika backend tidak merespons
      const localWish = {
        id: Date.now(),
        name: payload.name,
        initial: payload.name.charAt(0).toUpperCase(),
        avatarBg: 'bg-primary-container text-on-primary-container',
        category: payload.category,
        timeAgo: 'Baru Saja',
        isAttending: payload.attendance === 'hadir',
        pax: payload.pax,
        message: payload.message,
      };
      setWishes((prev) => [localWish, ...prev]);
      setTotalWishesCount((prev) => prev + 1);
      setName('');
      setMessage('');
      showToast('Doa & ucapan restu Anda berhasil dikirimkan!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit konfirmasi kado / amplop digital
  const handleGiftSubmit = async (e) => {
    e.preventDefault();
    if (!giftSender.trim()) return;

    setIsSubmittingGift(true);
    try {
      await confirmGift({
        senderName: giftSender.trim(),
        bankTarget: giftBank,
        amount: giftAmount,
        notes: giftNotes.trim(),
      });
      setIsGiftModalOpen(false);
      setGiftSender('');
      setGiftAmount('');
      setGiftNotes('');
      showToast('Konfirmasi tanda kasih berhasil dicatat. Terima kasih banyak!');
    } catch (err) {
      console.error('Gagal konfirmasi kado:', err);
      setIsGiftModalOpen(false);
      showToast('Konfirmasi Anda berhasil dicatat. Terima kasih!');
    } finally {
      setIsSubmittingGift(false);
    }
  };

  const relationshipOptions = [
    'Sahabat',
    'Keluarga',
    'Rekan Kerja',
    'Alumni Kampus',
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Toast Notification */}
      <div
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-space-md py-space-sm bg-inverse-surface text-inverse-on-surface rounded-full shadow-xl flex items-center gap-space-xs transition-all duration-300 ${isToastVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        id="copyToast"
      >
        <span className="material-symbols-outlined text-[18px] text-primary-fixed">
          check_circle
        </span>
        <span className="font-label-md text-label-md" id="toastMessage">
          {toastMessage || 'Tersalin ke papan klip'}
        </span>
      </div>

      {/* Editorial Header Hero Block */}
      <section className="relative w-full overflow-hidden bg-surface-container-low py-space-xl">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none"></div>
        <div className="max-w-[1080px] mx-auto px-margin relative z-10 flex flex-col md:flex-row items-center justify-between gap-space-lg">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container mb-space-sm shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-[14px] text-primary fill-1">
                favorite
              </span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                Tanda Kehadiran &amp; Doa Kasih
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight mb-space-xs">
              Buku Tamu &amp; Ucapan Para Tamu
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Kehadiran serta doa restu Anda merupakan untaian berkah terindah bagi lembaran baru perjalanan cinta kami berdua.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-space-md w-full md:w-auto shrink-0">
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(43,38,37,0.05)] text-center flex flex-col items-center justify-center min-w-[130px] border border-outline-variant/30">
              <span className="font-headline-lg text-headline-lg text-primary leading-none" id="totalWishesCount">
                {totalWishesCount}
              </span>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider mt-1">
                Untaian Doa
              </span>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(43,38,37,0.05)] text-center flex flex-col items-center justify-center min-w-[130px] border border-outline-variant/30">
              <span className="font-headline-lg text-headline-lg text-secondary leading-none">
                100%
              </span>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider mt-1">
                Penuh Kasih
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interaction Area: Form & Feed */}
      <section id="ucapan-form" className="max-w-[1080px] mx-auto px-margin py-space-xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-6 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_4px_30px_rgba(43,38,37,0.06)] relative overflow-hidden border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-md border-b border-outline-variant/30">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">
                    Untaian Doa Kasih
                  </span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    Kirim Doa &amp; Ucapan Restu
                  </h2>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">
                    edit_note
                  </span>
                </div>
              </div>

              <form className="flex flex-col gap-space-md mt-space-sm" onSubmit={handleFormSubmit}>
                {/* Guest Name */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm uppercase tracking-wider text-outline" htmlFor="guestName">
                    Nama Lengkap / Kerabat
                  </label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full bg-surface-container-low px-space-md py-space-sm rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline-variant focus:outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary-container transition-all"
                      id="guestName"
                      placeholder="Contoh: Raden Mas Dananjaya"
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <span className="material-symbols-outlined absolute right-3 text-outline text-[18px]">
                      badge
                    </span>
                  </div>
                </div>

                {/* Relationship Chips */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                    Hubungan Kerabat
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {relationshipOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedCategory(opt)}
                        disabled={isSubmitting}
                        className={`px-3 py-1 rounded-full text-label-sm font-label-sm transition-all ${selectedCategory === opt
                          ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attendance Selector */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                    Konfirmasi Kehadiran
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAttendance('hadir')}
                      disabled={isSubmitting}
                      className={`py-2 px-3 rounded-lg text-label-md font-label-md flex items-center justify-center gap-1.5 transition-all ${attendance === 'hadir'
                        ? 'bg-secondary text-white font-semibold shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Hadir
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendance('berhalangan')}
                      disabled={isSubmitting}
                      className={`py-2 px-3 rounded-lg text-label-md font-label-md flex items-center justify-center gap-1.5 transition-all ${attendance === 'berhalangan'
                        ? 'bg-tertiary text-white font-semibold shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                    >
                      <span className="material-symbols-outlined text-sm">cancel</span>
                      Berhalangan
                    </button>
                  </div>
                </div>

                {/* Wishes Message */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm uppercase tracking-wider text-outline" htmlFor="wishesMessage">
                    Untaian Doa &amp; Ucapan Selamat
                  </label>
                  <textarea
                    className="w-full bg-surface-container-low px-space-md py-space-sm rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline-variant focus:outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary-container transition-all resize-none"
                    id="wishesMessage"
                    placeholder="Tuliskan ucapan dan doa tulus Anda untuk Rizal &amp; Putri..."
                    required
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  className="w-full mt-space-sm py-space-sm px-space-md rounded-lg bg-primary-container text-on-primary-container font-title-md text-title-md hover:bg-primary hover:text-on-primary transition-all duration-300 shadow-[0_4px_16px_rgba(197,160,89,0.28)] flex items-center justify-center gap-space-xs group disabled:opacity-60"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? 'Menyimpan ke Database...' : 'Kirim Ucapan & Doa'}</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    {isSubmitting ? 'hourglass_top' : 'send'}
                  </span>
                </button>
              </form>
            </div>

            {/* Appreciation Note */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-[0_2px_12px_rgba(43,38,37,0.04)] flex items-start gap-space-md border border-outline-variant/30">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">
                  favorite
                </span>
              </div>
              <div>
                <h3 className="font-title-md text-title-md text-on-surface">
                  Apresiasi Kasih &amp; Doa Restu
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-relaxed">
                  Setiap bait doa dan ucapan hangat yang Anda berikan disimpan rapi dan menjadi lentera kebahagiaan serta berkah yang abadi dalam bahtera rumah tangga kami.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Wishes Wall Feed */}
          <div className="lg:col-span-6 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface font-semibold">
                  Dinding Doa &amp; Ucapan Para Tamu
                </span>
              </div>
              <div className="flex items-center gap-space-xs text-outline font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px]">
                  sync
                </span>
                <span>{isLoading ? 'Memuat...' : 'Terhubung ke Database'}</span>
              </div>
            </div>

            {/* Scrollable Wishes Stream */}
            <div className="flex flex-col gap-space-md max-h-[740px] overflow-y-auto pr-1" id="wishesList">
              {/* Empty state: shown when no wishes yet and not loading */}
              {!isLoading && wishes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-5xl text-primary/40">favorite</span>
                  <p className="font-title-md text-title-md text-on-surface-variant">Belum ada ucapan</p>
                  <p className="font-body-sm text-body-sm text-outline">Jadilah yang pertama memberikan doa & ucapan terbaik untuk mempelai 🌸</p>
                </div>
              )}
              {/* Loading state */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-primary/40 animate-pulse">hourglass_top</span>
                  <p className="font-body-md text-body-md text-outline">Memuat ucapan...</p>
                </div>
              )}
              {wishes.map((item) => (
                <div
                  key={item.id}
                  className="p-space-md bg-surface-container-lowest rounded-xl shadow-[0_2px_12px_rgba(43,38,37,0.04)] flex flex-col gap-space-xs transition-transform hover:-translate-y-0.5 border border-outline-variant/20"
                >
                  <div className="flex items-start justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm">
                      <div
                        className={`w-10 h-10 rounded-full ${item.avatarBg} font-headline-sm text-headline-sm flex items-center justify-center leading-none`}
                      >
                        {item.initial}
                      </div>
                      <div>
                        <h4 className="font-title-md text-title-md text-on-surface leading-tight">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-label-sm text-label-sm text-outline">
                            {item.category} • {item.timeAgo || 'Baru Saja'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${item.isAttending
                        ? 'bg-secondary-fixed/30 text-secondary'
                        : 'bg-surface-variant text-on-surface-variant'
                        }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {item.isAttending ? 'volunteer_activism' : 'schedule'}
                      </span>
                      {item.isAttending ? 'Doa Restu' : 'Berhalangan'}
                    </span>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-1">
                    "{item.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Digital Wedding Gift / Amplop Digital Section */}
      <section id="amplop-digital" className="w-full bg-surface-container py-space-xl border-t border-outline-variant/30">
        <div className="max-w-[1080px] mx-auto px-margin flex flex-col items-center">
          <div className="text-center max-w-xl mb-space-xl">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold block mb-1">
              Ungkapan Tanda Kasih
            </span>
            <h2 className="font-display-lg text-headline-lg text-on-surface mb-space-xs">
              Amplop Digital &amp; Hadiah
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Doa restu Anda merupakan karunia paling berharga. Namun bila Anda berkehendak memberikan tanda kasih dalam wujud bingkisan ataupun amplop digital, kami menyediakan informasi berikut:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md w-full">
            {/* BCA Card */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_4px_24px_rgba(43,38,37,0.04)] flex flex-col justify-between relative overflow-hidden group border border-outline-variant/30">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-fixed/20 rounded-full blur-2xl group-hover:bg-primary-fixed/40 transition-colors pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-title-md text-title-md font-bold text-primary tracking-widest">
                    BCA
                  </span>
                  <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant uppercase tracking-wider font-semibold">
                    Transfer Bank
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block">
                  Nomor Rekening
                </span>
                <div className="font-headline-sm text-headline-sm text-on-surface tracking-wider font-mono my-1">
                  2992 3143 63
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant font-medium">
                  a.n. Putri Nabila Maelani
                </p>
              </div>
              <div className="pt-space-md mt-space-md flex flex-col gap-2">
                <button
                  className="w-full py-2 px-space-md rounded-lg bg-surface-container hover:bg-primary-container hover:text-on-primary-container text-on-surface font-label-md text-label-md uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-space-xs"
                  onClick={() => copyToClipboard('2992314363', 'Nomor Rekening BCA')}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    content_copy
                  </span>
                  <span>Salin Nomor Rekening</span>
                </button>
                <button
                  className="w-full py-2 px-space-md rounded-lg bg-primary-container/20 hover:bg-primary-container hover:text-on-primary-container text-primary font-label-md text-label-md uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-space-xs"
                  onClick={() => {
                    setGiftBank('BCA (a.n. Putri Nabila Maelani)');
                    setIsGiftModalOpen(true);
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                  <span>Konfirmasi Transfer</span>
                </button>
              </div>
            </div>

            {/* Seabank Card */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_4px_24px_rgba(43,38,37,0.04)] flex flex-col justify-between relative overflow-hidden group border border-outline-variant/30">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary-fixed/30 rounded-full blur-2xl group-hover:bg-secondary-fixed/50 transition-colors pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-title-md text-title-md font-bold text-secondary tracking-widest">
                    SEABANK
                  </span>
                  <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant uppercase tracking-wider font-semibold">
                    Transfer Bank
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block">
                  Nomor Rekening
                </span>
                <div className="font-headline-sm text-headline-sm text-on-surface tracking-wider font-mono my-1">
                  9011 0973 6738
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant font-medium">
                  a.n. Putri Nabila Maelani
                </p>
              </div>
              <div className="pt-space-md mt-space-md flex flex-col gap-2">
                <button
                  className="w-full py-2 px-space-md rounded-lg bg-surface-container hover:bg-primary-container hover:text-on-primary-container text-on-surface font-label-md text-label-md uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-space-xs"
                  onClick={() => copyToClipboard('901109736738', 'Nomor Rekening Seabank')}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    content_copy
                  </span>
                  <span>Salin Nomor Rekening</span>
                </button>
                <button
                  className="w-full py-2 px-space-md rounded-lg bg-secondary-fixed/30 hover:bg-secondary hover:text-white text-secondary font-label-md text-label-md uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-space-xs"
                  onClick={() => {
                    setGiftBank('Seabank (a.n. Putri Nabila Maelani)');
                    setIsGiftModalOpen(true);
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                  <span>Konfirmasi Transfer</span>
                </button>
              </div>
            </div>

            {/* Physical Gift Address */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-[0_4px_24px_rgba(43,38,37,0.04)] flex flex-col justify-between relative overflow-hidden group md:col-span-2 lg:col-span-1 border border-outline-variant/30">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-tertiary-fixed/30 rounded-full blur-2xl group-hover:bg-tertiary-fixed/50 transition-colors pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-title-md text-title-md font-bold text-tertiary tracking-widest">
                    KADO FISIK
                  </span>
                  <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant uppercase tracking-wider font-semibold">
                    Kirim ke Rumah
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block">
                  Alamat Kediaman
                </span>
                <p className="font-body-md text-body-md text-on-surface font-medium mt-1 leading-snug">
                  Lingk. Manis RT.02 RW.01 Kel. Cigugur, Kec. Cigugur, Kab. Kuningan, Jawa Barat 45552 (Up: Rizal &amp; Putri)
                </p>
              </div>
              <div className="pt-space-md mt-space-md">
                <button
                  className="w-full py-2 px-space-md rounded-lg bg-surface-container hover:bg-primary-container hover:text-on-primary-container text-on-surface font-label-md text-label-md uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-space-xs"
                  onClick={() =>
                    copyToClipboard(
                      'Lingk. Manis RT.02 RW.01 Kel. Cigugur, Kec. Cigugur, Kab. Kuningan, Jawa Barat 45552 (Up: Rizal & Putri)',
                      'Alamat Kediaman'
                    )
                  }
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    pin_drop
                  </span>
                  <span>Salin Alamat Lengkap</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Konfirmasi Transfer Kado/Amplop */}
      {isGiftModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/80 backdrop-blur-md p-4 sm:p-6"
          onClick={() => setIsGiftModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-space-md bg-surface-container border-b border-outline-variant/30">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary">
                  volunteer_activism
                </span>
                <span className="font-title-md text-title-md text-on-surface">
                  Konfirmasi Tanda Kasih / Amplop
                </span>
              </div>
              <button
                onClick={() => setIsGiftModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface hover:bg-surface-variant flex items-center justify-center text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleGiftSubmit} className="p-space-lg flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                  Nama Pengirim
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Raden Mas Dananjaya"
                  value={giftSender}
                  onChange={(e) => setGiftSender(e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary-container"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                  Tujuan Rekening
                </label>
                <select
                  value={giftBank}
                  onChange={(e) => setGiftBank(e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none"
                >
                  <option value="BCA (a.n. Putri Nabila Maelani)">BCA - 2992314363 (Putri Nabila Maelani)</option>
                  <option value="Seabank (a.n. Putri Nabila Maelani)">Seabank - 901109736738 (Putri Nabila Maelani)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                  Nominal (Opsional)
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 500000"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary-container"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                  Catatan Doa / Pesan Khusus (Opsional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Pesan pelengkap..."
                  value={giftNotes}
                  onChange={(e) => setGiftNotes(e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary-container resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGiftModalOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-wider"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingGift}
                  className="flex-1 py-2 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-md transition-all disabled:opacity-60"
                >
                  {isSubmittingGift ? 'Menyimpan...' : 'Kirim Konfirmasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
