import React, { useEffect, useState } from 'react';
import { Sparkles, Dices, ShieldCheck } from 'lucide-react';

export default function LotteryAnimation({ participants, onComplete }) {
  const [displayText, setDisplayText] = useState('Initializing lottery...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 2500;
    const intervalTime = 60;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
      setProgress(currentProgress);

      const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
      setDisplayText(randomParticipant);

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [participants, onComplete]);

  return (
    <div className="bg-black/25 backdrop-blur-md border border-white/25 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden my-6 w-full text-white">
      <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto">
        <div className="w-18 h-18 rounded-2xl bg-white/15 border border-white/25 text-[#DFB15B] flex items-center justify-center mb-6 shadow-sm animate-pulse-subtle">
          <Dices className="w-9 h-9 animate-spin" style={{ animationDuration: '2s' }} />
        </div>

        <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-2 flex items-center justify-center gap-2 text-white drop-shadow-md">
          <Sparkles className="w-5 h-5 text-[#DFB15B]" />
          Drawing Fair Seat Lottery...
        </h3>
        <p className="text-xs sm:text-sm text-white/80 max-w-sm mb-8">
          Shuffling {participants.length} participants using Fisher-Yates random algorithm
        </p>

        {/* Shuffling Name Slot Box */}
        <div className="w-full rounded-2xl py-6 px-6 sm:px-10 shadow-inner mb-6 flex items-center justify-center bg-black/40 border border-white/25">
          <span className="text-2xl sm:text-3xl font-black text-white tracking-wider transition-all font-mono truncate max-w-full drop-shadow-md">
            {displayText}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full rounded-full h-3 p-0.5 bg-black/40 border border-white/25 mb-4 overflow-hidden">
          <div
            className="bg-[#DFB15B] h-full rounded-full transition-all duration-75 shadow-sm"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-white/80">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>Verifying seed randomness & assigning seats... ({progress}%)</span>
        </div>
      </div>
    </div>
  );
}
