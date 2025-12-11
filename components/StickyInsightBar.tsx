import React from 'react';
import { VyndaResponse } from '../types';

interface StickyInsightBarProps {
  data: VyndaResponse;
  isVisible: boolean;
  onReset: () => void;
}

const StickyInsightBar: React.FC<StickyInsightBarProps> = ({ data, isVisible, onReset }) => {
  if (!isVisible) return null;

  const winProbVal = data.case_summary.win_probability_percent;
  let winColor = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  if (winProbVal > 70) {
    winColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  } else if (winProbVal < 40) {
    winColor = 'bg-red-500/20 text-red-300 border-red-500/30';
  }

  const headline = `${data.case_summary.procedure} - ${data.case_summary.patient_name}`;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-[#050712]/90 backdrop-blur-xl border-b border-white/10 animate-slide-down shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200 hidden md:block">
            VYNDA
          </span>
          <div className="h-4 w-px bg-white/10 hidden md:block"></div>
          <span className="font-medium text-slate-200 text-sm md:text-base truncate max-w-[200px] md:max-w-md">
            {headline}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
           <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${winColor} shadow-inner`}>
             Win: {winProbVal}%
          </span>
          
          <button 
            onClick={onReset}
            className="text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-white/5"
          >
            New Case
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyInsightBar;