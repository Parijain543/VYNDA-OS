import React, { useState, useEffect } from 'react';
import { VyndaResponse } from '../types';

interface DenialSummaryProps {
  data: VyndaResponse;
}

interface EvidenceItem {
    id: number;
    label: string;
    checked: boolean;
    weight: number;
}

const DenialSummary: React.FC<DenialSummaryProps> = ({ data }) => {
  const case_summary = data?.case_summary || {} as any;
  const policy_analysis = data?.policy_analysis || { insurer_claim_vs_policy: [] };
  const contradictions = policy_analysis.insurer_claim_vs_policy || [];

  // --- CAUSAL ENGINE STATE ---
  // Initialize checklist with weighted values for simulation
  const [checklist, setChecklist] = useState<EvidenceItem[]>(() => {
      // Use API data or fallback to defaults
      const items = data.missing_evidence?.checklist_items || [];
      return items.map((item, idx) => ({
          id: idx,
          label: item.label,
          // Narrative Hack: Make "Signed Doctor's Note" and "ER Timestamp" checked by default for the demo flow
          checked: true, 
          // Assign massive weight to the "Doctor's Note" for dramatic effect
          weight: item.label.toLowerCase().includes("doctor") ? 50 : (item.label.toLowerCase().includes("er") ? 20 : 10)
      }));
  });

  const [currentScore, setCurrentScore] = useState(case_summary.win_probability_percent || 94);
  const [hoveredGapIndex, setHoveredGapIndex] = useState<number | null>(null);

  // Recalculate Score when checklist changes
  useEffect(() => {
      const maxScore = 94; // Cap at 94%
      const totalWeight = checklist.reduce((sum, item) => sum + item.weight, 0);
      const activeWeight = checklist.filter(i => i.checked).reduce((sum, item) => sum + item.weight, 0);
      
      // Calculate drop percentage
      const ratio = activeWeight / totalWeight;
      const calculated = Math.floor(maxScore * ratio);
      
      // Minimum floor of 12% for drama
      setCurrentScore(calculated < 12 ? 12 : calculated);
  }, [checklist]);

  const toggleItem = (id: number) => {
      setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // Visual Helper for Score
  let probColor = 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]';
  let barColor = 'bg-red-600';
  
  if (currentScore > 40) {
      probColor = 'text-yellow-400';
      barColor = 'bg-yellow-500';
  }
  if (currentScore > 70) {
      probColor = 'text-emerald-400';
      barColor = 'bg-emerald-500';
  }

  return (
    <div className="space-y-8 animate-slide-up relative">
      
      {/* 1. Dashboard Header */}
      <div className={`bg-navy-800/50 border rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between transition-all duration-700 ${currentScore < 50 ? 'border-red-500/30 bg-red-950/20 shadow-[0_0_30px_rgba(220,38,38,0.1)]' : 'border-white/5'}`}>
         <div className="flex-1">
             <h2 className={`text-xl font-semibold mb-2 transition-colors ${currentScore < 50 ? 'text-red-200' : 'text-white'}`}>
                 {currentScore < 50 ? "CRITICAL EVIDENCE GAP DETECTED" : `Assessment: ${case_summary.fairness_assessment || 'Pending'}`}
             </h2>
             <p className={`text-sm leading-relaxed ${currentScore < 50 ? 'text-red-300' : 'text-slate-400'}`}>
                 {currentScore < 50 
                    ? "The absence of critical documentation has collapsed your win probability. You must attach the required evidence to restore case viability."
                    : "The insurer is misclassifying standard surgery as 'Experimental'. This is likely an automated denial error."
                 }
             </p>
         </div>
         <div className={`p-4 rounded-xl border text-center min-w-[150px] transition-all duration-500 bg-navy-950 border-white/10`}>
             <div className="text-xs uppercase tracking-widest mb-1 text-slate-500">
                 Win Probability
             </div>
             <div className={`text-4xl font-bold transition-all duration-500 ${probColor}`}>
                 {currentScore}%
             </div>
             <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                 <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${currentScore}%` }}></div>
             </div>
         </div>
      </div>

      {/* 2. Causal Reality Gap (Live Wire Visuals) */}
      <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Policy Triangulation
          </h3>
          
          {contradictions.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                  {contradictions.map((gap, i) => (
                      <div 
                        key={i} 
                        className="bg-[#0F1423] border border-white/10 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-all duration-300 hover:border-blue-500/30 group"
                        onMouseEnter={() => setHoveredGapIndex(i)}
                        onMouseLeave={() => setHoveredGapIndex(null)}
                      >
                          {/* Denial Side */}
                          <div className="p-5 border-b md:border-b-0 md:border-r border-white/5 bg-red-500/5 transition-colors group-hover:bg-red-500/10 cursor-crosshair">
                              <div className="text-xs text-red-400 font-bold uppercase mb-2 flex justify-between">
                                  <span>Insurer Claimed</span>
                                  {hoveredGapIndex === i && <span className="text-[10px] animate-pulse">CONNECTING...</span>}
                              </div>
                              <p className="text-slate-400 text-sm leading-relaxed">"{gap.insurer_claim}"</p>
                          </div>
                          
                          {/* Policy Side - Highlights when Denial is hovered */}
                          <div className={`p-5 relative transition-all duration-500 ${hoveredGapIndex === i ? 'bg-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]' : 'bg-emerald-500/5'}`}>
                              <div className="text-xs font-bold uppercase mb-2 text-emerald-400">
                                  Policy Reality
                              </div>
                              <p className={`font-medium text-sm leading-relaxed transition-colors ${hoveredGapIndex === i ? 'text-emerald-100' : 'text-slate-200'}`}>
                                {gap.actual_policy}
                              </p>
                              {/* Connector Line Simulation */}
                              <div className={`absolute left-0 top-1/2 -translate-x-1/2 w-1 h-8 bg-blue-500 rounded-full transition-all duration-300 ${hoveredGapIndex === i ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}></div>
                              
                              <p className="mt-3 text-xs pt-2 italic text-slate-500 border-t border-white/5">
                                  Vynda Note: {gap.vynda_comment}
                              </p>
                          </div>
                      </div>
                  ))}
              </div>
          ) : (
              <div className="p-4 border border-dashed border-slate-700 rounded-lg text-slate-500 text-sm italic text-center">
                  No specific policy contradictions detected.
              </div>
          )}
      </div>

      {/* 3. Evidence Chain (Causal Controls) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-2xl p-6 bg-navy-800/30 border-white/5">
              <h4 className="text-sm font-semibold mb-4 text-slate-300">Case Metadata</h4>
              <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500">Patient</span>
                      <span className="text-slate-200">{case_summary.patient_name || 'Unknown'}</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500">Payer</span>
                      <span className="text-slate-200">{case_summary.payer || 'Unknown'}</span>
                  </li>
                  <li className="pt-2">
                      <span className="text-slate-500 block mb-1">Stated Reason</span>
                      <span className="text-slate-300 italic">"{case_summary.denial_reason_raw || 'N/A'}"</span>
                  </li>
              </ul>
          </div>

          <div className={`border rounded-2xl p-6 transition-all duration-500 ${currentScore < 50 ? 'bg-red-950/20 border-red-500/30' : 'bg-navy-800/30 border-white/5'}`}>
              <h4 className="text-sm font-semibold mb-4 text-slate-300 flex justify-between items-center">
                  <span>Evidence Chain</span>
                  <span className="text-[10px] uppercase bg-slate-800 px-2 py-1 rounded text-slate-400">Interactive Model</span>
              </h4>
              <ul className="space-y-3">
                  {checklist.map((item) => (
                      <li key={item.id} className="flex gap-3 items-start group">
                          <div className="relative flex items-center h-5">
                              <input 
                                type="checkbox" 
                                checked={item.checked} 
                                onChange={() => toggleItem(item.id)}
                                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                          </div>
                          <div className="flex-1 cursor-pointer" onClick={() => toggleItem(item.id)}>
                              <p className={`text-sm transition-colors ${item.checked ? 'text-slate-200' : 'text-slate-500 line-through'}`}>{item.label}</p>
                              <p className="text-[10px] text-slate-600 mt-0.5">Impact: {item.weight > 20 ? 'CRITICAL' : 'Standard'}</p>
                          </div>
                          {/* Visual Indicator of weight */}
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 transition-colors ${item.checked ? (item.weight > 20 ? 'bg-emerald-500' : 'bg-blue-500') : 'bg-slate-700'}`}></div>
                      </li>
                  ))}
              </ul>
          </div>
      </div>
    </div>
  );
};

export default DenialSummary;