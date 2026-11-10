import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low mt-space-xl relative border-t border-outline-variant/30">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-margin py-space-xl flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-space-md shadow-[0_1px_8px_rgba(43,38,37,0.05)] border border-primary-container/20">
          <span className="font-headline-md text-headline-md text-primary italic leading-none">
            R&amp;P
          </span>
        </div>
        <h4 className="font-headline-md text-headline-md text-on-surface mb-space-sm">
          Rizal Pratama &amp; Putri Anindya
        </h4>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto mb-space-lg leading-relaxed">
          Merupakan sebuah kehormatan dan kebahagiaan yang mendalam bagi kami beserta segenap keluarga besar apabila Bapak/Ibu/Saudara/i berkenan hadir serta memanjatkan doa restu pada hari ikrar suci kami.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-space-lg mb-space-xl font-label-md text-label-md uppercase text-outline tracking-widest">
          <span>Keluarga Besar Bpk. Handoko Bramantyo</span>
          <span className="text-primary-container">•</span>
          <span>Keluarga Besar Bpk. Suryo Daniswara</span>
        </div>
        <div className="font-label-sm text-label-sm text-outline uppercase tracking-widest">
          © 2025 Rizal &amp; Putri Matrimony. Dirancang Penuh Kasih.
        </div>
      </div>
    </footer>
  );
}

