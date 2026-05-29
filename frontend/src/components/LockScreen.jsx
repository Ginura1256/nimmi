import React, { useState, useEffect } from 'react';

function LockScreen({ onUnlock, errorMsg }) {
  const [passcode, setPasscode] = useState('');
  const [isOpening, setIsOpening] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  // Keypad click handler
  const handleKeyClick = (key) => {
    if (isOpening) return;
    if (passcode.length < 4) {
      setPasscode((prev) => prev + key);
    }
  };

  // Backspace handler
  const handleBackspace = () => {
    if (isOpening) return;
    setPasscode((prev) => prev.slice(0, -1));
  };

  // Trigger callback when passcode reaches 4
  useEffect(() => {
    if (passcode.length === 4) {
      setIsOpening(true);
      const timer = setTimeout(() => {
        onUnlock(passcode);
        setIsOpening(false);
        setPasscode('');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [passcode, onUnlock]);

  // Handle shake animation trigger on error message change
  useEffect(() => {
    if (errorMsg) {
      setShouldShake(true);
      const timer = setTimeout(() => {
        setShouldShake(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-[#fbf8f3] via-[#fffbf7] to-[#faede8] select-none p-4 relative overflow-hidden">
      {/* Decorative Line-Art Flowers */}
      <div className="absolute top-10 left-10 opacity-20 pointer-events-none">
        <svg width="150" height="150" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-pink-300">
          <path d="M50 20 C45 35, 30 45, 10 50 C30 55, 45 65, 50 80 C55 65, 70 55, 90 50 C70 45, 55 35, 50 20 Z" strokeWidth="1.5" />
          <path d="M50 35 C48 42, 42 48, 35 50 C42 52, 48 58, 50 65 C52 58, 58 52, 65 50 C58 48, 52 42, 50 35 Z" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-10 right-10 opacity-20 pointer-events-none">
        <svg width="180" height="180" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-pink-300">
          <circle cx="50" cy="50" r="10" strokeWidth="1.5" />
          <path d="M50 10 L50 40 M50 60 L50 90 M10 50 L40 50 M60 50 L90 50 M22 22 L43 43 M57 57 L78 78 M78 22 L57 43 M43 57 L22 78" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className={`w-full max-w-sm flex flex-col items-center z-10 transition-transform duration-300 ${shouldShake ? 'animate-shake' : ''}`}>
        {/* Centered Lock Icon */}
        <div className="mb-5 text-stone-600 transition-transform duration-500 hover:scale-110">
          {isOpening ? (
            // Open lock icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-emerald-600 animate-bounce">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          ) : (
            // Closed lock icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="w-11 h-11 text-stone-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          )}
        </div>

        {/* Text Labels */}
        <h1 className="font-cursive text-5xl text-stone-700 font-medium mb-1 tracking-wide">Welcome, Sudu</h1>
        <p className="font-serif-elegant italic text-sm text-stone-400/80 tracking-widest mb-10">a little secret....</p>

        {/* Passcode Dots Indicator */}
        <div className="flex gap-4 mb-10 items-center justify-center">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full border transition-all duration-300 ${index < passcode.length
                  ? 'bg-emerald-600 border-emerald-600 scale-110 shadow-sm shadow-emerald-500/20'
                  : 'bg-transparent border-stone-300'
                }`}
            />
          ))}
        </div>

        {/* Status / Error Messages */}
        <div className="h-6 mb-6 text-center">
          {isOpening && <p className="text-emerald-600 font-medium animate-pulse text-sm">Opening...</p>}
          {!isOpening && errorMsg && (
            <p className="text-rose-500 text-sm font-medium animate-pulse">{errorMsg}</p>
          )}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-x-5 gap-y-4 w-full max-w-[260px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyClick(num.toString())}
              disabled={isOpening}
              className="w-14 h-14 rounded-full border border-stone-200/80 text-xl font-normal text-stone-700 bg-white/40 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all duration-200 hover:bg-white hover:border-stone-300 hover:shadow active:scale-95 active:bg-stone-100/80"
            >
              {num}
            </button>
          ))}
          {/* Spacer */}
          <div className="w-14 h-14"></div>
          {/* 0 */}
          <button
            onClick={() => handleKeyClick('0')}
            disabled={isOpening}
            className="w-14 h-14 rounded-full border border-stone-200/80 text-xl font-normal text-stone-700 bg-white/40 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all duration-200 hover:bg-white hover:border-stone-300 hover:shadow active:scale-95 active:bg-stone-100/80"
          >
            0
          </button>
          {/* Backspace */}
          <button
            onClick={handleBackspace}
            disabled={isOpening}
            className="w-14 h-14 rounded-full border border-stone-200/80 text-lg text-stone-500 bg-white/40 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all duration-200 hover:bg-white hover:border-stone-300 hover:shadow active:scale-95 active:bg-stone-100/80"
            aria-label="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12l-2.25 2.25m-4.5-1.5h8.25c.621 0 1.125.504 1.125 1.125v3.026a1.125 1.125 0 0 1-1.125 1.125H7.5m0-6.75H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25h.75m0-11.25V3a2.25 2.25 0 0 1 2.25-2.25h1.5a2.25 2.25 0 0 1 2.25 2.25v.75m-6 0h6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LockScreen;
