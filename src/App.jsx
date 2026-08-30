import React, { useState, useEffect } from 'react';
import ParticipantInput from './components/ParticipantInput.jsx';
import SeatConfig from './components/SeatConfig.jsx';
import LotteryAnimation from './components/LotteryAnimation.jsx';
import ResultView from './components/ResultView.jsx';
import { runSeatLottery } from './utils/lottery.js';
import { Dices, Sparkles, AlertCircle } from 'lucide-react';

// Background Theme Configurations (Silent Video Background)
const THEMES = {
  reel: {
    videoSrc: '/reel-synced.mp4',
    name: 'Facebook Reel Silent HD'
  },
  glacier: {
    videoSrc: '/glacier-express.mp4',
    name: 'Glacier Express Silent HD'
  }
};

// Set active theme ('reel' is default active, 'glacier' preserved for easy restoration)
const CURRENT_THEME = THEMES.reel;

export default function App() {
  const [participantsText, setParticipantsText] = useState('');
  const [seatMode, setSeatMode] = useState('window_nonwindow');
  const [windowCount, setWindowCount] = useState(0);
  const [nonWindowCount, setNonWindowCount] = useState(0);
  
  // Custom seats state
  const [customSeats, setCustomSeats] = useState([]);

  const [step, setStep] = useState('input');
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const participantsList = participantsText
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  useEffect(() => {
    const count = participantsList.length;
    if (count >= 2 && seatMode === 'window_nonwindow') {
      const window = Math.ceil(count / 2);
      setWindowCount(window);
      setNonWindowCount(count - window);
    }
  }, [participantsText, seatMode]);

  const handleStartLottery = () => {
    setErrorMessage(null);

    if (participantsList.length < 2) {
      setErrorMessage('Please enter at least 2 participants.');
      return;
    }

    if (seatMode === 'window_nonwindow') {
      const totalSeats = parseInt(windowCount || 0, 10) + parseInt(nonWindowCount || 0, 10);
      if (totalSeats !== participantsList.length) {
        setErrorMessage(`Seat total (${totalSeats}) must equal the number of participants (${participantsList.length}).`);
        return;
      }
    } else {
      if (customSeats.length !== participantsList.length) {
        setErrorMessage(`Custom seat count (${customSeats.length}) must equal the number of participants (${participantsList.length}).`);
        return;
      }
    }

    setStep('drawing');
  };

  const handleAnimationComplete = () => {
    try {
      const outcome = runSeatLottery(participantsList, seatMode, {
        customSeats,
        windowCount,
        nonWindowCount
      });
      setResults(outcome);
      setStep('results');
    } catch (err) {
      setErrorMessage(err.message);
      setStep('input');
    }
  };

  const handleRedraw = () => {
    setStep('drawing');
  };

  const handleReset = () => {
    setStep('input');
    setResults([]);
    setErrorMessage(null);
  };

  const currentTotalSeats = seatMode === 'window_nonwindow'
    ? (parseInt(windowCount || 0, 10) + parseInt(nonWindowCount || 0, 10))
    : customSeats.length;

  const isValidToSubmit = participantsList.length >= 2 && currentTotalSeats === participantsList.length;

  return (
    <div className="relative min-h-screen text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#DFB15B] selection:text-black overflow-x-hidden">
      
      {/* Universal Silent Mobile-Compatible Video Background (iOS Safari & Android Ready) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#0A0807]">
        <video
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src={CURRENT_THEME.videoSrc} type="video/mp4" />
        </video>
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65"></div>
      </div>

      {/* FIXED TOP BAR - Pinned for both Mobile & Web */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-black/40 backdrop-blur-lg shadow-lg">
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Header Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black/50 border border-white/25 p-1 shadow-lg flex items-center justify-center group hover:scale-105 transition-all overflow-hidden shrink-0">
              <img 
                src="/favicon.svg" 
                alt="Its My Seat Logo" 
                className="w-full h-full object-contain rounded-lg filter drop-shadow-sm brightness-105" 
              />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white drop-shadow-sm flex items-center gap-1.5">
                Its My Seat
              </h1>
              <p className="text-[10px] sm:text-xs font-semibold text-white/80">Seat Lottery System</p>
            </div>
          </div>

        </div>
      </header>

      {/* Main App Content Container with Top Padding to clear fixed header */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between pt-16 sm:pt-20">
        
        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 py-5 sm:py-7 flex flex-col">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-500/25 backdrop-blur-md border border-rose-400/40 text-rose-100 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-md">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'input' && (
            <div className="space-y-5 w-full flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full items-start">
                <ParticipantInput
                  participantsText={participantsText}
                  setParticipantsText={setParticipantsText}
                  participantsList={participantsList}
                />

                <SeatConfig
                  seatMode={seatMode}
                  setSeatMode={setSeatMode}
                  windowCount={windowCount}
                  setWindowCount={setWindowCount}
                  nonWindowCount={nonWindowCount}
                  setNonWindowCount={setNonWindowCount}
                  customSeats={customSeats}
                  setCustomSeats={setCustomSeats}
                  participantCount={participantsList.length}
                />
              </div>

              {/* Primary Action Button */}
              <div className="pt-2 flex justify-center w-full">
                <button
                  type="button"
                  onClick={handleStartLottery}
                  disabled={!isValidToSubmit}
                  className="w-full sm:w-auto px-10 py-3.5 bg-[#DFB15B] hover:bg-[#caa050] text-black font-black text-sm sm:text-base rounded-xl shadow-xl shadow-[#DFB15B]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Dices className="w-5 h-5 text-[#0A0807]" />
                  <span>Run Seat Lottery</span>
                  <Sparkles className="w-4 h-4 text-[#0A0807]" />
                </button>
              </div>
            </div>
          )}

          {step === 'drawing' && (
            <LotteryAnimation
              participants={participantsList}
              onComplete={handleAnimationComplete}
            />
          )}

          {step === 'results' && (
            <ResultView
              results={results}
              onRedraw={handleRedraw}
              onReset={handleReset}
            />
          )}
        </main>

        {/* Ultra-Transparent Footer */}
        <footer className="border-t border-white/20 bg-black/25 backdrop-blur-md py-4 text-center text-xs font-bold text-white/80">
          <p>Its My Seat &bull; Fair Seat Allocation</p>
        </footer>
      </div>
    </div>
  );
}
