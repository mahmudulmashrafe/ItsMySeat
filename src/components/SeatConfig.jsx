import React, { useState } from 'react';
import { Armchair, Compass, LayoutGrid, CheckCircle2, AlertTriangle, Sparkles, Plus, X, Check } from 'lucide-react';

export default function SeatConfig({
  seatMode,
  setSeatMode,
  windowCount,
  setWindowCount,
  nonWindowCount,
  setNonWindowCount,
  customSeats, // Array of { id, seat, isWindow }
  setCustomSeats,
  participantCount
}) {
  const [newSeatName, setNewSeatName] = useState('');
  const [newIsWindow, setNewIsWindow] = useState(false);

  const handleAutoBalance = () => {
    if (participantCount <= 0) return;
    const half = Math.ceil(participantCount / 2);
    setWindowCount(half);
    setNonWindowCount(participantCount - half);
  };

  const handleAddCustomSeat = (e) => {
    e.preventDefault();
    const trimmed = newSeatName.trim();
    if (!trimmed) return;

    setCustomSeats([
      ...customSeats,
      { id: Date.now() + Math.random(), seat: trimmed, isWindow: newIsWindow }
    ]);
    setNewSeatName('');
    setNewIsWindow(false);
  };

  const handleToggleWindow = (indexToToggle) => {
    const updated = customSeats.map((item, idx) => {
      if (idx === indexToToggle) {
        return { ...item, isWindow: !item.isWindow };
      }
      return item;
    });
    setCustomSeats(updated);
  };

  const handleRemoveCustomSeat = (indexToRemove) => {
    const updated = customSeats.filter((_, idx) => idx !== indexToRemove);
    setCustomSeats(updated);
  };

  const currentTotalSeats = seatMode === 'window_nonwindow'
    ? (parseInt(windowCount || 0, 10) + parseInt(nonWindowCount || 0, 10))
    : customSeats.length;

  const isMatched = currentTotalSeats === participantCount && participantCount >= 2;

  return (
    <div className="bg-black/25 backdrop-blur-md border border-white/25 rounded-3xl p-6 sm:p-8 shadow-2xl text-white w-full flex flex-col justify-between transition-all hover:bg-black/30">
      <div>
        {/* Header with Step Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/20">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-white/15 border border-white/25 text-[#DFB15B]">
              <Armchair className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2 text-white drop-shadow-md">
                Step 2: Configure Seats
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  isMatched 
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40' 
                    : 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                }`}>
                  {currentTotalSeats} / {participantCount} Seats
                </span>
              </h2>
              <p className="text-xs text-white/80 drop-shadow-xs">Set seat types or specific seat labels</p>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl mb-6 bg-black/40 border border-white/20">
          <button
            type="button"
            onClick={() => setSeatMode('window_nonwindow')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              seatMode === 'window_nonwindow'
                ? 'bg-[#DFB15B] text-black shadow-lg'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Window / Non-Window</span>
          </button>

          <button
            type="button"
            onClick={() => setSeatMode('custom')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              seatMode === 'custom'
                ? 'bg-[#DFB15B] text-black shadow-lg'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Custom Seat Names</span>
          </button>
        </div>

        {/* Mode 1: Window / Non-Window Controls */}
        {seatMode === 'window_nonwindow' && (
          <div className="space-y-4">
            {/* Auto Balance Card Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-black/35 border border-white/20">
              <div className="text-xs font-bold text-white/90">
                <span>Target Participants: <strong className="text-[#DFB15B] text-sm">{participantCount}</strong></span>
              </div>
              <button
                type="button"
                onClick={handleAutoBalance}
                disabled={participantCount < 2}
                className="flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl bg-[#DFB15B] hover:bg-[#caa050] text-black transition-all cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Auto Balance Seats</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Window Seat Counter Box */}
              <div className="p-4 rounded-2xl bg-black/35 border border-white/20 flex flex-col justify-between">
                <label className="flex items-center justify-between text-xs font-black text-white mb-3">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DFB15B]"></span>
                    🪟 Window Seats
                  </span>
                  <span className="font-mono text-base font-black text-[#DFB15B]">{windowCount}</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWindowCount(Math.max(0, parseInt(windowCount || 0, 10) - 1))}
                    className="w-12 h-12 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-black text-lg flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    max={participantCount}
                    value={windowCount}
                    onChange={(e) => setWindowCount(Math.max(0, parseInt(e.target.value || 0, 10)))}
                    className="w-full text-center font-black py-2.5 rounded-xl outline-none font-mono text-base bg-black/40 border border-white/25 text-white shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setWindowCount(parseInt(windowCount || 0, 10) + 1)}
                    className="w-12 h-12 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-black text-lg flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Non-Window Seat Counter Box */}
              <div className="p-4 rounded-2xl bg-black/35 border border-white/20 flex flex-col justify-between">
                <label className="flex items-center justify-between text-xs font-black text-white mb-3">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    𒒺 Non-Window Seats
                  </span>
                  <span className="font-mono text-base font-black text-slate-200">{nonWindowCount}</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNonWindowCount(Math.max(0, parseInt(nonWindowCount || 0, 10) - 1))}
                    className="w-12 h-12 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-black text-lg flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    max={participantCount}
                    value={nonWindowCount}
                    onChange={(e) => setNonWindowCount(Math.max(0, parseInt(e.target.value || 0, 10)))}
                    className="w-full text-center font-black py-2.5 rounded-xl outline-none font-mono text-base bg-black/40 border border-white/25 text-white shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setNonWindowCount(parseInt(nonWindowCount || 0, 10) + 1)}
                    className="w-12 h-12 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-black text-lg flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: Custom Seats Mode with Ticking Checkbox for Window / Non-Window */}
        {seatMode === 'custom' && (
          <div className="space-y-4">
            {/* Add Custom Seat Form */}
            <form onSubmit={handleAddCustomSeat} className="bg-black/35 p-3.5 rounded-2xl border border-white/20 space-y-3">
              <div className="text-xs font-bold text-white/90">Add Seat Number & Tick if Window:</div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={newSeatName}
                  onChange={(e) => setNewSeatName(e.target.value)}
                  placeholder="Seat number (e.g. 1A, VIP-1)..."
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none bg-black/40 border border-white/25 focus:border-[#DFB15B] text-white placeholder:text-white/50 shadow-inner"
                />

                {/* Ticking Checkbox for Window Seat */}
                <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/25 text-xs font-bold text-white cursor-pointer shrink-0 select-none">
                  <input
                    type="checkbox"
                    checked={newIsWindow}
                    onChange={(e) => setNewIsWindow(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#DFB15B] cursor-pointer"
                  />
                  <span>🪟 Window Seat</span>
                </label>

                <button
                  type="submit"
                  disabled={!newSeatName.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#DFB15B] hover:bg-[#caa050] text-black font-black text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center justify-center gap-1 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Seat</span>
                </button>
              </div>
            </form>

            {/* List of Custom Seats with Checkboxes */}
            {customSeats.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-white/80">
                  Custom Seats List ({customSeats.length}): Tick checkbox if Window Seat
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {customSeats.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex items-center justify-between p-3 rounded-2xl bg-black/35 border border-white/20 hover:border-white/40 transition-all"
                    >
                      <div className="flex items-center gap-3 font-mono font-bold text-xs">
                        <span className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center text-xs text-[#DFB15B]">
                          {index + 1}
                        </span>
                        <span className="text-white text-sm">{item.seat}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Interactive Ticking Checkbox */}
                        <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                          item.isWindow 
                            ? 'bg-[#DFB15B]/25 text-[#DFB15B] border-[#DFB15B]/50' 
                            : 'bg-white/10 text-white/80 border-white/20 hover:text-white'
                        }`}>
                          <input
                            type="checkbox"
                            checked={!!item.isWindow}
                            onChange={() => handleToggleWindow(index)}
                            className="w-4 h-4 rounded accent-[#DFB15B] cursor-pointer"
                          />
                          <span>{item.isWindow ? '🪟 Window Seat' : '𒒺 Non-Window'}</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveCustomSeat(index)}
                          className="text-white/60 hover:text-rose-300 p-1 rounded-lg transition-colors cursor-pointer"
                          title="Remove seat"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Validation Banner */}
      <div className="mt-5 pt-4 border-t border-white/20">
        {participantCount < 2 ? (
          <div className="text-xs text-white/60 italic">Please add at least 2 participants in Step 1.</div>
        ) : isMatched ? (
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300">
            <CheckCircle2 className="w-4.5 h-4.5 text-[#DFB15B]" />
            <span>Ready! Total seat count matches participants ({participantCount}).</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-bold rounded-2xl p-3.5 bg-amber-500/25 border border-amber-400/40 text-amber-100 shadow-sm">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-300" />
            <span>
              {currentTotalSeats < participantCount
                ? `Add ${participantCount - currentTotalSeats} more seat(s) to match ${participantCount} participants.`
                : `Remove ${currentTotalSeats - participantCount} seat(s) to match ${participantCount} participants.`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
