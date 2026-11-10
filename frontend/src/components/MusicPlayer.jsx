import React, { useState, useRef, useEffect } from 'react';

export default function MusicPlayer({ isPlaying: externalIsPlaying, onToggle }) {
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const isPlaying =
    externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

  // Path lagu pernikahan: Tiara Andini & Arsy Widianto - Lagu Pernikahan Kita
  const primaryAudioSrc = encodeURI(
    '/audio/Tiara Andini Arsy Widianto - Lagu Pernikahan Kita.mp3'
  );
  const fallbackLocalSrc = '/audio/wedding-song.mp3';
  const onlineFallbackSrc =
    'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c89b703a89.mp3?filename=romantic-wedding-112191.mp3';

  const [currentSrc, setCurrentSrc] = useState(primaryAudioSrc);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.65; // Volume nyaman dan lembut

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Penanganan kebijakan autoplay browser
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSrc]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setInternalIsPlaying(nextState);
    if (onToggle) onToggle(nextState);
  };

  const handleAudioError = () => {
    if (currentSrc === primaryAudioSrc) {
      setCurrentSrc(fallbackLocalSrc);
    } else if (currentSrc === fallbackLocalSrc) {
      console.info('Beralih ke fallback lagu online.');
      setCurrentSrc(onlineFallbackSrc);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentSrc}
        onError={handleAudioError}
        loop
        preload="auto"
      />
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-space-sm px-space-md py-space-sm rounded-full bg-surface/95 backdrop-blur-xl shadow-[0_6px_24px_rgba(43,38,37,0.14)] border border-outline-variant/40 transition-all hover:shadow-[0_8px_30px_rgba(43,38,37,0.22)]">
        <button
          aria-label={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
          onClick={togglePlay}
          className={`w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all shadow-sm ${
            isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isPlaying ? 'music_note' : 'music_off'}
          </span>
        </button>
        <div
          className="hidden sm:flex flex-col pr-space-xs text-left cursor-pointer"
          onClick={togglePlay}
        >
          <span className="font-label-sm text-label-sm font-semibold text-on-surface line-clamp-1 max-w-[180px]">
            Lagu Pernikahan Kita
          </span>
          <span className="font-label-sm text-[11px] text-outline flex items-center gap-1.5">
            {isPlaying ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
                <span className="text-primary font-medium">Tiara Andini &amp; Arsy Widianto</span>
              </>
            ) : (
              <span>Ketuk untuk Putar</span>
            )}
          </span>
        </div>
      </div>
    </>
  );
}
