import React, { useState } from 'react';
import { Users, Trash2, AlertCircle, Plus, List, X } from 'lucide-react';

export default function ParticipantInput({ participantsText, setParticipantsText, participantsList }) {
  const [singleName, setSingleName] = useState('');
  const [inputMode, setInputMode] = useState('single'); // 'single' tag input vs 'bulk' text area

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
    <div className="bg-black/25 backdrop-blur-md border border-white/25 rounded-3xl p-6 sm:p-8 shadow-2xl text-white w-full flex flex-col justify-between transition-all hover:bg-black/30">
      <div>
        {/* Header with Step Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/20">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-white/15 border border-white/25 text-[#DFB15B]">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2 text-white drop-shadow-md">
                Step 1: Add Participants
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  count >= 2 
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40' 
                    : 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                }`}>
                  {count} {count === 1 ? 'person' : 'people'}
                </span>
              </h2>
              <p className="text-xs text-white/80 drop-shadow-xs">Who is participating in this seat lottery?</p>
            </div>
          </div>

          {/* Input Mode Toggle (Single vs Bulk) */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/20">
            <button
              type="button"
              onClick={() => setInputMode('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                inputMode === 'single' ? 'bg-[#DFB15B] text-black shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Add One
            </button>
            <button
              type="button"
              onClick={() => setInputMode('bulk')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                inputMode === 'bulk' ? 'bg-[#DFB15B] text-black shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Bulk Paste
            </button>
          </div>
        </div>

        {/* Input Mode 1: Single Name Quick Input Field */}
        {inputMode === 'single' && (
          <form onSubmit={handleAddSingleName} className="mb-5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={singleName}
                onChange={(e) => setSingleName(e.target.value)}
                placeholder="Type name (e.g. Alice Smith) & press Enter..."
                className="w-full rounded-2xl px-4 py-3 text-sm font-semibold outline-none bg-black/35 border border-white/25 focus:border-[#DFB15B] focus:bg-black/50 text-white placeholder:text-white/50 shadow-inner"
              />
              <button
                type="submit"
                disabled={!singleName.trim()}
                className="px-5 py-3 rounded-2xl bg-[#DFB15B] hover:bg-[#caa050] text-black font-black text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </form>
        )}

        {/* Input Mode 2: Bulk Multiline Text Area */}
        {inputMode === 'bulk' && (
          <div className="relative mb-5">
            <textarea
              rows={5}
              value={participantsText}
              onChange={(e) => setParticipantsText(e.target.value)}
              placeholder={`Paste multiple names (one per line):\nJohn Doe\nJane Smith\nAlex Brown`}
              className="w-full rounded-2xl p-4 text-sm font-semibold transition-all outline-none resize-y bg-black/35 border border-white/25 focus:border-[#DFB15B] focus:bg-black/50 text-white placeholder:text-white/50 shadow-inner"
            />
          </div>
        )}

        {/* Action Bar (Clear All) */}
        {participantsText && (
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-rose-500/30 hover:bg-rose-500/45 border border-rose-400/40 text-white transition-all cursor-pointer shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>
        )}

        {/* Interactive Tag Pills with Quick Remove */}
        {count > 0 && (
          <div className="mt-2 pt-4 border-t border-white/20">
            <div className="text-xs font-bold mb-2.5 text-white/80 drop-shadow-xs">
              Participant List ({count}):
            </div>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
              {participantsList.map((name, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl bg-white/15 border border-white/25 text-white shadow-sm group hover:border-[#DFB15B]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DFB15B]"></span>
                  <span>{name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveName(index)}
                    className="text-white/60 hover:text-rose-300 ml-0.5 p-0.5 rounded-full transition-colors cursor-pointer"
                    title={`Remove ${name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {count < 2 && (
        <div className="mt-5 flex items-center gap-2.5 text-xs font-bold rounded-2xl p-4 bg-amber-500/25 border border-amber-400/40 text-amber-100 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-300" />
          <span>Please add at least 2 participant names to run the seat lottery.</span>
        </div>
      )}
    </div>
  );
}
