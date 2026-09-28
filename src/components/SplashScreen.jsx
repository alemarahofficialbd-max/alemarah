import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onFinish, minDuration = 1400 }) {
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, minDuration);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, minDuration + 400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [minDuration, onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-400 ease-in-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Al-Emarah Properties"
    >
      {/* Centered Flash Screen Logo Only */}
      <div className="flex items-center justify-center max-w-xs sm:max-w-md md:max-w-lg px-6 animate-fadeIn">
        <img
          src="/alemarah_flash screen.svg"
          alt="Al-Emarah Properties"
          className="w-full max-h-[70vh] object-contain drop-shadow-sm select-none"
        />
      </div>
    </div>
  );
}
