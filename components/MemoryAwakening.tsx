import React, { useState } from 'react';
import { VyndaResponse, MemoryCase } from '../types';
import { getMemoryColor } from '../utils/colorUtils';

interface MemoryAwakeningProps {
  data: VyndaResponse;
}

const MemoryCard: React.FC<{ memory: MemoryCase }> = ({ memory }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const color = getMemoryColor(memory.id || 'unknown');
  const score = Math.round((memory.similarity_score || 0) * 100);

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`relative overflow-hidden rounded-xl border transition-all duration-500 cursor-pointer group flex flex-col
        ${isExpanded 
          ? 'bg-navy-800/90 border-blue-500/50 shadow-2xl shadow-blue-900/20 scale-[1.02] z-10'
          : 'bg-navy-800/40 border-white/5 hover:bg-navy-800/60 hover:border-white/10 hover:shadow-lg'
        }
      `}
    >
      <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 from-blue-500/5 to-purple-500/5 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />

      <div 
        className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} 
        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
      ></div>

      <div className="relative p-6">
        <div className="flex justify-between items-start mb-4">
           <div className="flex items-center gap-3">
               <div className="relative flex items-center justify-center w-4 h-4">
                  <span 
                      className={`absolute inset-0 rounded-full transition-all duration-700 ${isExpanded ? 'opacity-30 scale-150 animate-pulse' : 'opacity-0 scale-100'}`} 
                      style={{ backgroundColor: color }}
                  ></span>
                  <span 
                      className={`block rounded-full transition-all duration-500 relative z-10 ${isExpanded ? 'w-3 h-3 shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'w-2 h-2 opacity-70 group-hover:opacity-100'}`} 
                      style={{ backgroundColor: color }}
                  ></span>
               </div>
               <span className={`text-xs font-mono tracking-wide transition-colors ${isExpanded ? 'text-slate-200' : 'text-slate-400'}`}>
                 {memory.id || 'N/A'}
               </span>
           </div>
           <span className="text-xs font-bold px-2 py-1 rounded border shadow-sm text-emerald-400 bg-emerald-500/10 border-emerald-500/10 shadow-emerald-900/20">
              {score}% MATCH
           </span>
        </div>

        <div className="mb-2">
            <h3 className={`font-semibold mb-1 leading-tight transition-colors ${isExpanded ? 'text-white' : 'text-slate-200'}`}>
              {memory.outcome || 'Unknown Outcome'}
            </h3>
            <p className="text-xs flex items-center gap-2 text-slate-500">
              <span>Resolved in {memory.resolution_time_days || '?'} days</span>
              {isExpanded && <span className="w-1 h-1 rounded-full bg-slate-600"></span>}
              {isExpanded && <span className="text-slate-400">{memory.procedure_type}</span>}
            </p>
        </div>

        <div className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isExpanded ? 'max-h-96 opacity-100 mt-5' : 'max-h-0 opacity-0'}`}>
           <div className="space-y-4">
              <div className="text-sm p-4 rounded-lg border shadow-inner bg-black/40 border-white/10 text-slate-300">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <strong className="text-[10px] uppercase tracking-wider text-blue-400">Why it matches</strong>
                  </div>
                  <p className="leading-relaxed opacity-90">{memory.similarity_reason || 'Analysis pending'}</p>
              </div>

              <div className="pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 9.636 11.364 8.364 8.364 8.364 8.364 11.364 9.636 11.536 14.743 14.743A6 6 0 1114 10a2 2 0 00-2-2z" /></svg>
                    <strong className="text-[10px] uppercase tracking-wider text-emerald-400">Key Winning Lever</strong>
                  </div>
                  <p className="text-sm italic font-medium leading-relaxed border-l-2 pl-3 text-white border-emerald-500/50">"{memory.key_lever || 'N/A'}"</p>
              </div>
           </div>
        </div>

        <div className={`mt-4 pt-4 border-t flex items-center justify-between text-xs transition-all duration-300 ${isExpanded ? 'opacity-0 h-0 pt-0 mt-0 overflow-hidden' : 'opacity-100'} border-white/5 text-slate-500 group-hover:text-blue-400`}>
            <span>Tap to reveal strategy</span>
            <div className="w-6 h-6 rounded-full flex items-center justify-center transition-colors bg-white/5 group-hover:bg-blue-500/20">
              <svg className="w-3 h-3 transform group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
        </div>
      </div>
    </div>
  );
};

const MemoryAwakening: React.FC<MemoryAwakeningProps> = ({ data }) => {
  const cases = data?.memory_cases || [];

  return (
    <div className="animate-slide-up space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-white/5">
        <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 text-white">
              <span className="w-2 h-8 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"></span>
              Precedent Memory Bank
            </h2>
            <p className="text-sm max-w-xl leading-relaxed text-slate-400">
                Vynda has accessed the collective legal memory. 
                <span className="text-slate-200"> {cases.length} historical cases</span> match this denial pattern. 
                Activate a memory orb to decrypt the winning legal strategy used in that specific case.
            </p>
        </div>
      </div>

      {cases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min pb-10">
            {cases.map((memory, i) => (
                <MemoryCard key={memory.id || i} memory={memory} />
            ))}
          </div>
      ) : (
          <div className="p-12 border border-dashed border-slate-800 rounded-xl text-center">
             <p className="text-slate-500">No specific precedent cases matched this denial pattern.</p>
          </div>
      )}
    </div>
  );
};

export default MemoryAwakening;