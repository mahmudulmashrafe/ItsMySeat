import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Copy, Download, Search, Check, Armchair } from 'lucide-react';

export default function ResultView({ results, onRedraw, onReset }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.55 }
      });
    } catch (e) {
      console.log('Confetti effect failed', e);
    }
  }, []);

  const filteredResults = results.filter(item =>
    item.participant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.seat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = () => {
    const text = results.map(r => `${r.participant} ➔ ${r.seat}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Participant,Assigned Seat,Seat Type"].concat(
          results.map(r => `"${r.participant.replace(/"/g, '""')}","${r.seat.replace(/"/g, '""')}","${r.type}"`)
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `seat_lottery_results_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-black/25 backdrop-blur-md border border-white/25 rounded-3xl p-6 sm:p-8 shadow-2xl text-white w-full">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/20">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-white/15 border border-white/25 text-[#DFB15B]">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2 text-white drop-shadow-md">
              Lottery Results
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                {results.length} Seats Assigned
              </span>
            </h2>
            <p className="text-xs text-white/80">Seats assigned with fair random distribution</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white transition-all cursor-pointer shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>

          <button
            type="button"
            onClick={handleDownloadCSV}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download CSV
          </button>

          <button
            type="button"
            onClick={onRedraw}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black rounded-xl bg-[#DFB15B] hover:bg-[#caa050] text-black transition-all cursor-pointer shadow-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Re-Draw
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-black/40 hover:bg-black/60 border border-white/25 text-white/80 transition-all cursor-pointer shadow-sm"
          >
            New Lottery
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="my-5">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
          <input
            type="text"
            placeholder="Search participant or seat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs rounded-xl pl-10 pr-4 py-3 font-semibold outline-none transition-all bg-black/35 border border-white/25 focus:border-[#DFB15B] text-white placeholder:text-white/50 shadow-inner"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
        {filteredResults.map((item, index) => {
          const isWindow = item.type === 'window';
          const isNonWindow = item.type === 'non_window';

          return (
            <div
              key={index}
              className="rounded-2xl p-4 flex flex-col justify-between transition-all hover:scale-[1.01] group bg-black/35 border border-white/20 hover:border-white/40 shadow-md"
            >
              <div className="flex items-center gap-3 overflow-hidden mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 bg-white/15 border border-white/25 text-[#DFB15B] group-hover:bg-[#DFB15B] group-hover:text-black transition-colors">
                  {index + 1}
                </div>
                <div className="truncate">
                  <div className="text-sm font-black truncate text-white">{item.participant}</div>
                  <div className="text-[11px] font-bold text-white/70">
                    Participant #{index + 1}
                  </div>
                </div>
              </div>

              {/* Seat Badge */}
              <div className="pt-2.5 border-t border-white/20 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-white/70">Assigned Seat</span>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs border ${
                  isWindow 
                    ? 'bg-[#DFB15B]/25 text-[#DFB15B] border-[#DFB15B]/50'
                    : isNonWindow 
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-emerald-500/25 text-emerald-200 border-emerald-400/40'
                }`}>
                  {isWindow && <span>🪟</span>}
                  {isNonWindow && <span>𒒺</span>}
                  {!isWindow && !isNonWindow && <Armchair className="w-3.5 h-3.5" />}
                  <span>{item.seat}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResults.length === 0 && (
        <div className="py-12 text-center text-white/60 text-xs font-bold">
          No participant or seat matching "{searchTerm}" found.
        </div>
      )}
    </div>
  );
}
