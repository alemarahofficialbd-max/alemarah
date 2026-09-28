import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onFinish, minDuration = 1600 }) {
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Timer to start fading out
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, minDuration);

    // Timer to completely remove component
    const removeTimer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, minDuration + 500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [minDuration, onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading Al-Emarah Properties"
    >
      {/* Background radial ambient glow */}
      <div className="absolute inset-0 bg-radial from-red-50/60 via-transparent to-transparent pointer-events-none" />

      {/* Centered Flash Screen Content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-sm sm:max-w-md px-6 text-center animate-fadeIn">
        <div className="relative group">
          <img
            src="/alemarah_flash screen.svg"
            alt="Al-Emarah Properties Limited"
            className="w-72 sm:w-96 max-h-64 object-contain filter drop-shadow-md transform transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Elegant loading progress indicator */}
        <div className="mt-8 w-48 sm:w-56 h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-[#CE2028] via-[#8EBF40] to-[#006231] rounded-full animate-pulse" 
               style={{ width: '100%', animationDuration: '1.2s' }} />
        </div>

        <p className="mt-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
          Planned Development • Creating Wealth with Trust
        </p>
      </div>

      {/* Skip button on top corner for instant access */}
      <button
        onClick={() => {
          setFading(true);
          setTimeout(() => {
            setVisible(false);
            if (onFinish) onFinish();
          }, 300);
        }}
        className="absolute top-6 right-6 px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium transition-all cursor-pointer"
      >
        Skip &rarr;
      </button>
    </div>
  );
}
