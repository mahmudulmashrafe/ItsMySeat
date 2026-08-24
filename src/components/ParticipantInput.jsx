import React, { useState } from 'react';
import { Users, Trash2, AlertCircle, Plus, List, X } from 'lucide-react';

export default function ParticipantInput({ participantsText, setParticipantsText, participantsList }) {
  const [singleName, setSingleName] = useState('');
  const [inputMode, setInputMode] = useState('single');

  const count = participantsList.length;

  const handleAddSingleName = (e) => {
    e.preventDefault();
    const trimmed = singleName.trim();
    if (!trimmed) return;

    const currentNames = participantsText
      ? participantsText.split('\n').map(n => n.trim()).filter(Boolean)
      : [];
    
    setParticipantsText([...currentNames, trimmed].join('\n'));
    setSingleName('');
  };

  const handleRemoveName = (indexToRemove) => {
    const currentNames = participantsText
      ? participantsText.split('\n').map(n => n.trim()).filter(Boolean)
      : [];
    const updated = currentNames.filter((_, idx) => idx !== indexToRemove);
    setParticipantsText(updated.join('\n'));
  };

  const handleClear = () => {
    setParticipantsText('');
  };

  return (
    <div className="bg-black/25 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 shadow-xl text-white w-full flex flex-col justify-between transition-all hover:bg-black/30">
      <div>
        {/* Compact Header with Step Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 pb-3 border-b border-white/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-[#DFB15B]">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight flex items-center gap-2 text-white drop-shadow-sm">
                Step 1: Add Participants
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  count >= 2 
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40' 
                    : 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                }`}>
                  {count} {count === 1 ? 'person' : 'people'}
                </span>
              </h2>
              <p className="text-[11px] text-white/75">Who is participating in this seat lottery?</p>
            </div>
          </div>

          {/* Compact Input Mode Toggle */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/15">
            <button
              type="button"
              onClick={() => setInputMode('single')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                inputMode === 'single' ? 'bg-[#DFB15B] text-black shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              <Plus className="w-3 h-3" />
              Add One
            </button>
            <button
              type="button"
              onClick={() => setInputMode('bulk')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                inputMode === 'bulk' ? 'bg-[#DFB15B] text-black shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              <List className="w-3 h-3" />
              Bulk Paste
            </button>
          </div>
        </div>

        {/* Input Mode 1: Single Name Quick Input Field */}
        {inputMode === 'single' && (
          <form onSubmit={handleAddSingleName} className="mb-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={singleName}
                onChange={(e) => setSingleName(e.target.value)}
                placeholder="Type name & press Enter..."
                className="w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold outline-none bg-black/35 border border-white/20 focus:border-[#DFB15B] focus:bg-black/50 text-white placeholder:text-white/45 shadow-inner"
              />
              <button
                type="submit"
                disabled={!singleName.trim()}
                className="px-4 py-2 rounded-xl bg-[#DFB15B] hover:bg-[#caa050] text-black font-black text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </form>
        )}

        {/* Input Mode 2: Bulk Multiline Text Area */}
        {inputMode === 'bulk' && (
          <div className="relative mb-4">
            <textarea
              rows={4}
              value={participantsText}
              onChange={(e) => setParticipantsText(e.target.value)}
              placeholder={`Paste multiple names (one per line):\nJohn Doe\nJane Smith`}
              className="w-full rounded-xl p-3 text-xs sm:text-sm font-semibold transition-all outline-none resize-y bg-black/35 border border-white/20 focus:border-[#DFB15B] focus:bg-black/50 text-white placeholder:text-white/45 shadow-inner"
            />
          </div>
        )}

        {/* Action Bar (Clear All) */}
        {participantsText && (
          <div className="flex justify-end mb-3">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/25 hover:bg-rose-500/40 border border-rose-400/35 text-white transition-all cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3 h-3" />
              Clear All
            </button>
          </div>
        )}

        {/* Compact Interactive Tag Pills */}
        {count > 0 && (
          <div className="mt-2 pt-3 border-t border-white/15">
            <div className="text-[11px] font-bold mb-2 text-white/80">
              Participants ({count}):
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {participantsList.map((name, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-white/15 border border-white/20 text-white shadow-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DFB15B]"></span>
                  <span>{name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveName(index)}
                    className="text-white/60 hover:text-rose-300 ml-0.5 p-0.5 rounded-full transition-colors cursor-pointer"
                    title={`Remove ${name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {count < 2 && (
        <div className="mt-4 flex items-center gap-2 text-xs font-bold rounded-xl p-3 bg-amber-500/20 border border-amber-400/35 text-amber-100 shadow-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-300" />
          <span>Add at least 2 participant names to run the lottery.</span>
        </div>
      )}
    </div>
  );
}
