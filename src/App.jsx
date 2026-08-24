import React, { useState, useEffect, useRef } from 'react';
import ParticipantInput from './components/ParticipantInput.jsx';
import SeatConfig from './components/SeatConfig.jsx';
import LotteryAnimation from './components/LotteryAnimation.jsx';
import ResultView from './components/ResultView.jsx';
import { runSeatLottery } from './utils/lottery.js';
import { Dices, Sparkles, AlertCircle, Volume2, VolumeX } from 'lucide-react';

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

  // Background Audio State
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const audioRef = useRef(null);

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

  // Default Auto-Play Music immediately on mount & on any page interaction fallback
  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsMusicPlaying(true);
          })
          .catch((err) => {
            console.log('Browser Autoplay Policy restriction, waiting for user gesture:', err);
          });
      }
    };

    playAudio();

    const handleGesturePlay = () => {
      playAudio();
      ['pointerdown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt => {
        window.removeEventListener(evt, handleGesturePlay);
      });
    };

    ['pointerdown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt => {
      window.addEventListener(evt, handleGesturePlay, { once: true });
    });

    return () => {
      ['pointerdown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt => {
        window.removeEventListener(evt, handleGesturePlay);
      });
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(err => console.log('Audio play error:', err));
    }
  };

  const handleStartLottery = () => {
    setErrorMessage(null);

    if (audioRef.current && !isMusicPlaying) {
      audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }

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
      
      {/* Background Looping Music HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src="/Music.mp3"
        autoPlay
        loop
        preload="auto"
      />

      {/* Background Looping Glacier Express Nature Video */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-90 contrast-105"
        >
          <source src="/glacier-express.mp4" type="video/mp4" />
          <source src="https://cdn.pixabay.com/video/2020/07/25/45569-443244046_large.mp4" type="video/mp4" />
        </video>
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
      </div>

      {/* Main App Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        
        {/* Ultra-Transparent Glassmorphism Header */}
        <header className="border-b border-white/20 bg-black/25 backdrop-blur-md sticky top-0 z-50 shadow-lg">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            
            {/* Combined Nature + Travel + Seat Logo & Title */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-black via-[#1C1614] to-[#DFB15B] p-0.5 shadow-xl shadow-black/50 flex items-center justify-center group hover:scale-105 transition-transform">
                <div className="w-full h-full bg-black/85 backdrop-blur-md rounded-[14px] flex items-center justify-center p-1">
                  {/* Custom Combined SVG Logo: Nature (Mountains) + Travel (Sun/Compass) + Seat */}
                  <svg className="w-8 h-8" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="44" cy="18" r="5" fill="#DFB15B" />
                    <path d="M44 9V11M44 25V27M35 18H37M51 18H53" stroke="#DFB15B" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M10 46L24 24L33 36L42 20L54 46H10Z" fill="url(#headerMountainGrad)" />
                    <path d="M24 24L28 30L33 28L42 20L45.5 25" stroke="#DFB15B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20 50V38C20 35.7909 21.7909 34 24 34H40C42.2091 34 44 35.7909 44 38V50" stroke="#FAF3F0" strokeWidth="2.8" strokeLinecap="round" />
                    <path d="M24 28C24 25.7909 25.7909 24 28 24H36C38.2091 24 40 25.7909 40 28V34H24V28Z" fill="#DFB15B" fillOpacity="0.6" stroke="#FAF3F0" strokeWidth="2.2" />
                    <path d="M17 42H47" stroke="#FAF3F0" strokeWidth="2.8" strokeLinecap="round" />
                    <path d="M24 50V54M40 50V54" stroke="#DFB15B" strokeWidth="2.8" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="headerMountainGrad" x1="32" y1="20" x2="32" y2="46" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#DFB15B" stopOpacity="0.75"/>
                        <stop offset="1" stopColor="#1C1614"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white drop-shadow-md flex items-center gap-1.5">
                  Its My Seat
                </h1>
                <p className="text-[11px] sm:text-xs font-bold text-white/80 drop-shadow-xs">Nature & Travel Seat Lottery</p>
              </div>
            </div>

            {/* Background Music Toggle Button */}
            <button
              type="button"
              onClick={toggleMusic}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-md ${
                isMusicPlaying
                  ? 'bg-[#DFB15B] text-black border-[#DFB15B]/80 shadow-[#DFB15B]/20 animate-pulse-subtle'
                  : 'bg-black/40 hover:bg-black/60 text-white/90 border-white/25'
              }`}
              title={isMusicPlaying ? 'Mute Background Music' : 'Play Background Music (Music.mp3)'}
            >
              {isMusicPlaying ? <Volume2 className="w-4 h-4 text-black animate-bounce" /> : <VolumeX className="w-4 h-4 text-white/70" />}
              <span className="hidden sm:inline">{isMusicPlaying ? 'Music Playing' : 'Play Music'}</span>
            </button>

          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col">
          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-500/25 backdrop-blur-md border border-rose-400/40 text-rose-100 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 shadow-lg">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-300" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'input' && (
            <div className="space-y-6 w-full flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
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
              <div className="pt-4 flex justify-center w-full">
                <button
                  type="button"
                  onClick={handleStartLottery}
                  disabled={!isValidToSubmit}
                  className="w-full sm:w-auto px-12 py-4 bg-[#DFB15B] hover:bg-[#caa050] text-black font-black text-base rounded-2xl shadow-2xl shadow-[#DFB15B]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Dices className="w-6 h-6 text-black" />
                  <span>Run Seat Lottery</span>
                  <Sparkles className="w-5 h-5 text-black" />
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
        <footer className="border-t border-white/20 bg-black/25 backdrop-blur-md py-6 text-center text-xs font-bold text-white/80">
          <p>Its My Seat &bull; Fair Seat Allocation</p>
        </footer>
      </div>
    </div>
  );
}
