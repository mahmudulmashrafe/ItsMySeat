import React, { useState } from 'react';
import { Armchair, Compass, LayoutGrid, CheckCircle2, AlertTriangle, Sparkles, Plus, X } from 'lucide-react';

export default function SeatConfig({
  seatMode,
  setSeatMode,
  windowCount,
  setWindowCount,
  nonWindowCount,
  setNonWindowCount,
  customSeats,
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
    <div className="bg-black/25 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 shadow-xl text-white w-full flex flex-col justify-between transition-all hover:bg-black/30">
      <div>
        {/* Compact Header with Step Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 pb-3 border-b border-white/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-[#DFB15B]">
              <Armchair className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight flex items-center gap-2 text-white drop-shadow-sm">
                Step 2: Configure Seats
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isMatched 
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40' 
                    : 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                }`}>
                  {currentTotalSeats} / {participantCount} Seats
                </span>
              </h2>
              <p className="text-[11px] text-white/75">Set seat types or specific seat labels</p>
            </div>
          </div>
        </div>

        {/* Compact Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl mb-4 bg-black/40 border border-white/15">
          <button
            type="button"
            onClick={() => setSeatMode('window_nonwindow')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              seatMode === 'window_nonwindow'
                ? 'bg-[#DFB15B] text-black shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Window / Non-Window</span>
          </button>

          <button
            type="button"
            onClick={() => setSeatMode('custom')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              seatMode === 'custom'
                ? 'bg-[#DFB15B] text-black shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Custom Seat Names</span>
          </button>
        </div>

        {/* Mode 1: Window / Non-Window Controls */}
        {seatMode === 'window_nonwindow' && (
          <div className="space-y-3">
            {/* Auto Balance Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-black/35 border border-white/15">
              <div className="text-xs font-bold text-white/90">
                Target: <strong className="text-[#DFB15B] font-mono">{participantCount}</strong> participants
              </div>
              <button
                type="button"
                onClick={handleAutoBalance}
                disabled={participantCount < 2}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-[#DFB15B] hover:bg-[#caa050] text-black transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Auto Balance</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Window Seat Counter Box */}
              <div className="p-3 rounded-xl bg-black/35 border border-white/15 flex flex-col justify-between">
                <label className="flex items-center justify-between text-xs font-bold text-white mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#DFB15B]"></span>
                    🪟 Window
                  </span>
                  <span className="font-mono text-sm font-black text-[#DFB15B]">{windowCount}</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setWindowCount(Math.max(0, parseInt(windowCount || 0, 10) - 1))}
                    className="w-9 h-9 rounded-lg bg-white/15 hover:bg-white/25 border border-white/25 text-white font-black text-sm flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    max={participantCount}
                    value={windowCount}
                    onChange={(e) => setWindowCount(Math.max(0, parseInt(e.target.value || 0, 10)))}
                    className="w-full text-center font-black py-1.5 rounded-lg outline-none font-mono text-sm bg-black/40 border border-white/20 text-white shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setWindowCount(parseInt(windowCount || 0, 10) + 1)}
                    className="w-9 h-9 rounded-lg bg-white/15 hover:bg-white/25 border border-white/25 text-white font-black text-sm flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Non-Window Seat Counter Box */}
              <div className="p-3 rounded-xl bg-black/35 border border-white/15 flex flex-col justify-between">
                <label className="flex items-center justify-between text-xs font-bold text-white mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                    𒒺 Non-Window
                  </span>
                  <span className="font-mono text-sm font-black text-slate-200">{nonWindowCount}</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setNonWindowCount(Math.max(0, parseInt(nonWindowCount || 0, 10) - 1))}
                    className="w-9 h-9 rounded-lg bg-white/15 hover:bg-white/25 border border-white/25 text-white font-black text-sm flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    max={participantCount}
                    value={nonWindowCount}
                    onChange={(e) => setNonWindowCount(Math.max(0, parseInt(e.target.value || 0, 10)))}
                    className="w-full text-center font-black py-1.5 rounded-lg outline-none font-mono text-sm bg-black/40 border border-white/20 text-white shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setNonWindowCount(parseInt(nonWindowCount || 0, 10) + 1)}
                    className="w-9 h-9 rounded-lg bg-white/15 hover:bg-white/25 border border-white/25 text-white font-black text-sm flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: Custom Seats Mode with Ticking Checkbox */}
        {seatMode === 'custom' && (
          <div className="space-y-3">
            <form onSubmit={handleAddCustomSeat} className="bg-black/35 p-3 rounded-xl border border-white/15 space-y-2">
              <div className="text-[11px] font-bold text-white/90">Add Seat Number & Tick if Window:</div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={newSeatName}
                  onChange={(e) => setNewSeatName(e.target.value)}
                  placeholder="Seat number (e.g. 1A)..."
                  className="w-full rounded-lg px-3 py-1.5 text-xs font-semibold outline-none bg-black/40 border border-white/20 focus:border-[#DFB15B] text-white placeholder:text-white/45 shadow-inner"
                />

                <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-white cursor-pointer shrink-0 select-none">
                  <input
                    type="checkbox"
                    checked={newIsWindow}
                    onChange={(e) => setNewIsWindow(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-[#DFB15B] cursor-pointer"
                  />
                  <span>🪟 Window</span>
                </label>

                <button
                  type="submit"
                  disabled={!newSeatName.trim()}
                  className="px-3.5 py-1.5 rounded-lg bg-[#DFB15B] hover:bg-[#caa050] text-black font-black text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center justify-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </form>

            {customSeats.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {customSeats.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center justify-between p-2 rounded-xl bg-black/35 border border-white/15 hover:border-white/30 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2 font-mono font-bold">
                      <span className="w-5 h-5 rounded-md bg-white/15 flex items-center justify-center text-[10px] text-[#DFB15B]">
                        {index + 1}
                      </span>
                      <span className="text-white">{item.seat}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
                        item.isWindow 
                          ? 'bg-[#DFB15B]/25 text-[#DFB15B] border-[#DFB15B]/40' 
                          : 'bg-white/10 text-white/80 border-white/20'
                      }`}>
                        <input
                          type="checkbox"
                          checked={!!item.isWindow}
                          onChange={() => handleToggleWindow(index)}
                          className="w-3.5 h-3.5 rounded accent-[#DFB15B] cursor-pointer"
                        />
                        <span>{item.isWindow ? '🪟 Window' : '𒒺 Non-Window'}</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveCustomSeat(index)}
                        className="text-white/60 hover:text-rose-300 p-0.5 rounded transition-colors cursor-pointer"
                        title="Remove seat"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compact Validation Banner */}
      <div className="mt-4 pt-3 border-t border-white/15">
        {participantCount < 2 ? (
          <div className="text-xs text-white/60 italic">Please add at least 2 participants in Step 1.</div>
        ) : isMatched ? (
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-[#DFB15B]" />
            <span>Ready! Total seat count matches participants ({participantCount}).</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-bold rounded-xl p-3 bg-amber-500/20 border border-amber-400/35 text-amber-100 shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-300" />
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
