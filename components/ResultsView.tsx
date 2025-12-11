
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { VyndaResponse } from '../types';
import Logo from './Logo';
import SkeletonLoader from './SkeletonLoader';
import { streamResponse } from '../services/geminiService';

interface ResultsViewProps {
  data: VyndaResponse;
  onReset: () => void;
  onRequestConsult: (msg: string) => Promise<string>;
}

const ResultsView: React.FC<ResultsViewProps> = ({ data, onReset, onRequestConsult }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'precedents' | 'appeal' | 'consultant'>('overview');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Checklist State Logic
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [probability, setProbability] = useState(0); // Start at 0 for animation
  const [targetProbability, setTargetProbability] = useState(data.case_summary.win_probability_percent);
  const [probDelta, setProbDelta] = useState<number | null>(null);

  // Chat State Persistence
  const [chatMessages, setChatMessages] = useState<any[]>([
      { role: 'model', text: data.consultant_prompt || "I've analyzed your case. How can I help?" }
  ]);

  // Initial Data Sync
  useEffect(() => {
     setTargetProbability(data.case_summary.win_probability_percent);
     setCheckedItems([]);
  }, [data]);

  // Animated Counter for Probability
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = targetProbability / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetProbability) {
        setProbability(targetProbability);
        clearInterval(timer);
      } else {
        setProbability(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [targetProbability]);


  // Memoized probability calculation
  const calculateProbability = useMemo(() => (id: string, impact: string, isChecked: boolean) => {
      const val = parseInt(impact.replace(/[^0-9]/g, '')) || 5;
      const delta = isChecked ? val : -val;
      const currentTarget = targetProbability;
      const newProb = Math.min(99, Math.max(0, currentTarget + delta));
      return { newProb, delta };
  }, [targetProbability]);

  const handleCheck = (id: string, impact: string, isChecked: boolean) => {
      const { newProb, delta } = calculateProbability(id, impact, isChecked);
      
      setTargetProbability(newProb);
      setProbDelta(delta);
      setTimeout(() => setProbDelta(null), 2500);

      if (isChecked) {
          setCheckedItems(prev => [...prev, id]);
      } else {
          setCheckedItems(prev => prev.filter(x => x !== id));
      }
  };

  const handleTabChange = (newTab: typeof activeTab) => {
      if (newTab === activeTab) return;
      setIsTransitioning(true);
      setTimeout(() => {
          setActiveTab(newTab);
          setIsTransitioning(false);
      }, 200);
  };

  return (
    <div className="min-h-screen bg-[#0a1628] text-slate-200 font-sans flex flex-col overflow-x-hidden">
      
      {/* --- HEADER (Strict Adherence to Spec) --- */}
      <div className="sticky top-0 z-50 bg-[#0a1628]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
              
              {/* Left: Branding */}
              <div className="flex flex-col justify-center min-w-fit">
                  <div className="flex items-center gap-3">
                      <Logo size="sm" className="hover:scale-105 transition-transform duration-300" />
                      <span className="text-2xl font-bold text-white tracking-tight leading-none">VYNDA</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold tracking-[0.2em] opacity-80 uppercase leading-tight mt-1 ml-1">Medical Defense Intelligence</span>
              </div>

              {/* Middle: Patient Context */}
              <div className="hidden md:flex flex-col border-l border-white/10 pl-6 ml-2 justify-center h-12">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      </div>
                      <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                              <span className="text-white font-bold text-sm leading-none">{data.case_summary.patient_name}</span>
                              <span className="bg-slate-800 text-slate-400 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider border border-white/5">Teacher</span>
                          </div>
                          <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5 mt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                              Case: {data.case_summary.procedure} Denied
                          </div>
                      </div>
                  </div>
              </div>

              {/* Right: Gauge (Compact) */}
              <div className="flex items-center ml-auto">
                 <GaugeCompact value={probability} delta={probDelta} />
                 <button onClick={onReset} className="ml-6 text-slate-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
          </div>
      </div>

      {/* TABS HEADER */}
      <div className="bg-[#151b2b] border-b border-white/5 shadow-md z-40">
          <div className="max-w-7xl mx-auto px-4 flex gap-1 md:gap-8 overflow-x-auto no-scrollbar">
              <TabButton active={activeTab === 'overview'} onClick={() => handleTabChange('overview')} label="Overview" icon="⚠️" />
              <TabButton active={activeTab === 'precedents'} onClick={() => handleTabChange('precedents')} label="Precedents" icon="🧠" />
              <TabButton active={activeTab === 'appeal'} onClick={() => handleTabChange('appeal')} label="Draft Appeal" icon="📄" />
              <TabButton active={activeTab === 'consultant'} onClick={() => handleTabChange('consultant')} label="Consultant" icon="💬" />
          </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full bg-[#0a1628] relative min-h-[calc(100vh-140px)]">

          <div className="max-w-7xl mx-auto px-4 py-8 pb-20 relative z-10">
              <div className={`transition-all duration-300 ease-out transform ${isTransitioning ? 'opacity-0 translate-y-4 scale-[0.98]' : 'opacity-100 translate-y-0 scale-100'}`}>
                  {activeTab === 'overview' && <OverviewTab data={data} probability={probability} checkedItems={checkedItems} onCheck={handleCheck} />}
                  {activeTab === 'precedents' && <PrecedentsTab data={data} />}
                  {activeTab === 'appeal' && <AppealTab data={data} />}
                  {activeTab === 'consultant' && <ConsultantTab data={data} onRequestConsult={onRequestConsult} messages={chatMessages} setMessages={setChatMessages} />}
              </div>
          </div>
      </div>

    </div>
  );
};

// --- SUB COMPONENTS ---

const GaugeCompact = ({ value, delta }: { value: number, delta: number | null }) => {
    // Determine color based on value
    let color = "#ef4444"; // red
    if (value > 60) color = "#eab308"; // yellow
    if (value > 84) color = "#10b981"; // green

    return (
        <div className="flex items-center gap-4 bg-[#0B1021]/50 p-1.5 pr-5 rounded-full border border-white/5 backdrop-blur-md hover:border-white/10 transition-colors group cursor-default">
            <div className="relative w-12 h-12 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${value}, 100`} strokeLinecap="round" className="transition-all duration-1000 ease-out will-change-[stroke-dasharray]" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xs font-black text-white">{value}%</span>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Win Prob</span>
                <span className="text-[11px] text-white font-medium">{value > 80 ? 'Excellent' : value > 50 ? 'Moderate' : 'Critical'}</span>
            </div>
            {delta !== null && (
                <div className={`absolute -top-3 right-0 text-xs font-bold px-2 py-0.5 rounded-full animate-fade-up shadow-lg border border-white/10 ${delta > 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {delta > 0 ? '+' : ''}{delta}%
                </div>
            )}
        </div>
    );
};

const TabButton = ({ active, onClick, label, icon }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 whitespace-nowrap outline-none focus:outline-none relative group ${active ? 'border-cyan-400 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
    >
        <span className={`text-lg transition-transform duration-300 ${active ? 'scale-110 text-cyan-400' : 'group-hover:scale-110 grayscale group-hover:grayscale-0'}`}>{icon}</span>
        {label}
        {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_15px_cyan]"></span>}
    </button>
);

// --- TAB 1: OVERVIEW ---
const OverviewTab = ({ data, probability, checkedItems, onCheck }: any) => {
    const [expanded, setExpanded] = useState(false);
    
    return (
        <div className="space-y-8 animate-fade-in">
            {/* What Happened - Hero Card */}
            <section className="bg-[#1a2744]/40 backdrop-blur-sm rounded-xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
                
                <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center text-3xl border border-white/5 shadow-inner shrink-0 animate-pulse-slow">
                        ⚠️
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-3">Analysis Summary</h2>
                        <p className="text-slate-300 leading-relaxed text-lg font-light">{data.patient_explanation.short}</p>
                        
                        <div className={`grid transition-all duration-500 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                            <div className="overflow-hidden">
                                <div className="bg-[#0B1021]/50 p-6 rounded-lg border border-white/5 text-slate-300 text-sm whitespace-pre-line leading-relaxed shadow-inner">
                                    {data.patient_explanation.long}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setExpanded(!expanded)} 
                            className="mt-4 flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider hover:text-cyan-300 transition-colors group/btn"
                        >
                            {expanded ? "Show Less" : "Read Full Explanation"}
                            <svg className={`w-3 h-3 transition-transform duration-300 ${expanded ? 'rotate-180' : 'group-hover/btn:translate-y-0.5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Contradictions Grid */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">⚖️</span>
                    <h2 className="text-2xl font-bold text-white">Insurer Claim vs. Policy Reality</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {data.policy_analysis.insurer_claim_vs_policy.map((gap: any, i: number) => (
                        <div key={i} className="contents">
                             {/* Denial Side */}
                             <div className="glass-panel bg-red-500/5 border-red-500/20 rounded-xl p-6 relative hover:bg-red-500/10 transition-colors duration-300 group">
                                 <div className="absolute top-4 left-4 text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2 bg-red-500/10 px-2 py-1 rounded">
                                     The Denial
                                 </div>
                                 <div className="mt-8 relative">
                                     <span className="absolute -left-3 -top-2 text-4xl text-red-500/20 font-serif">"</span>
                                     <p className="text-white text-lg font-medium leading-relaxed relative z-10">{gap.insurer_claim}</p>
                                 </div>
                             </div>
                             
                             {/* Truth Side */}
                             <div className="glass-panel bg-emerald-500/5 border-emerald-500/20 rounded-xl p-6 relative hover:bg-emerald-500/10 transition-colors duration-300 group">
                                 <div className="absolute top-4 left-4 text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 bg-emerald-500/10 px-2 py-1 rounded">
                                     The Truth
                                 </div>
                                 <div className="mt-8 relative">
                                     <span className="absolute -left-3 -top-2 text-4xl text-emerald-500/20 font-serif">"</span>
                                     <p className="text-white text-lg font-medium leading-relaxed relative z-10">{gap.actual_policy}</p>
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 bg-[#1a2744] p-5 rounded-lg border-l-4 border-red-500 text-slate-300 text-sm flex gap-4 items-start shadow-lg">
                    <div className="bg-red-500/20 p-2 rounded-full shrink-0">
                        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <strong className="block text-white mb-1 uppercase tracking-wide text-xs">Vynda Insight</strong>
                        {data.policy_analysis.insurer_claim_vs_policy[0]?.vynda_comment}
                    </div>
                </div>
            </section>

            {/* Interactive Checklist */}
            <section>
                 <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <h2 className="text-2xl font-bold text-white">Evidence Gap Analysis</h2>
                     </div>
                 </div>
                 
                 <div className="bg-[#1a2744]/40 backdrop-blur-sm rounded-xl p-6 border border-white/5 space-y-4 shadow-xl">
                     {data.missing_evidence.checklist_items.map((item: any) => {
                         const isChecked = checkedItems.includes(item.id);
                         let badgeColor = "bg-blue-500/20 text-blue-300 border-blue-500/30";
                         let ringColor = "group-hover:border-blue-500";
                         if(item.importance === 'Critical') {
                             badgeColor = "bg-red-500/20 text-red-300 border-red-500/30";
                             ringColor = "group-hover:border-red-500";
                         }
                         if(item.importance === 'Important') {
                             badgeColor = "bg-orange-500/20 text-orange-300 border-orange-500/30";
                             ringColor = "group-hover:border-orange-500";
                         }

                         return (
                             <div key={item.id} 
                                  onClick={() => onCheck(item.id, item.impact_if_added, !isChecked)}
                                  className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${isChecked ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-[#0a1628] border-white/10 hover:border-white/30 hover:bg-[#0f192b]'}`}
                             >
                                 <div className={`mt-1 w-6 h-6 rounded border flex items-center justify-center transition-all duration-300 ${isChecked ? 'bg-blue-500 border-blue-500 scale-110' : `border-slate-600 ${ringColor}`}`}>
                                     <svg className={`w-4 h-4 text-white transition-transform duration-300 ${isChecked ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                 </div>
                                 <div className="flex-1">
                                     <div className="flex items-center justify-between mb-1">
                                         <span className={`font-medium transition-colors ${isChecked ? 'text-white' : 'text-slate-300'}`}>{item.label}</span>
                                         <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border ${badgeColor}`}>{item.importance}</span>
                                     </div>
                                     <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">{item.why_it_matters}</p>
                                 </div>
                                 {/* Floating Impact Badge (Only visible when unchecked to encourage action) */}
                                 {!isChecked && (
                                     <div className="text-xs font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                                         {item.impact_if_added}
                                     </div>
                                 )}
                             </div>
                         );
                     })}
                 </div>
            </section>

            {/* Next Steps */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🎯</span>
                    <h2 className="text-2xl font-bold text-white">Recommended Action Plan</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.patient_explanation.next_steps.map((step: string, i: number) => (
                        <div key={i} className="bg-[#1a2744] p-5 rounded-xl border-l-4 border-cyan-500 shadow-lg hover:translate-x-1 transition-transform cursor-default group">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-sm group-hover:bg-cyan-500 group-hover:text-white transition-colors">{i+1}</div>
                                <h3 className="font-bold text-white text-sm">{step}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

// --- TAB 2: PRECEDENTS ---
const PrecedentsTab = ({ data }: any) => {
    // Dynamic patient name handling
    const patientName = data.case_summary.patient_name || "the patient";
    const possessiveName = patientName.endsWith('s') ? `${patientName}'` : `${patientName}'s`;

    return (
        <div className="animate-fade-in space-y-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">🧠 Collective Memory</h2>
                <p className="text-slate-400 leading-relaxed">
                    VYNDA has accessed the collective legal memory. These anonymized historical cases match <span className="text-white font-semibold border-b border-cyan-500/30">{possessiveName}</span> denial pattern.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.memory_cases.map((mem: any, i: number) => (
                    <div key={i} className="glass-panel bg-[#1a2744]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:-translate-y-2 transition-all duration-300 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg z-10">
                            {Math.round(mem.similarity_score * 100)}% MATCH
                        </div>
                        
                        <div className="mb-4">
                            <span className="text-xs font-mono text-slate-500 block mb-1 tracking-wider">{mem.id}</span>
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${mem.outcome === 'Overturned' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                {mem.outcome}
                            </span>
                        </div>
                        
                        <div className="space-y-3 mb-6 text-sm text-slate-300">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-500">Payer</span>
                                <span className="font-medium text-white">{mem.payer}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-500">Time</span>
                                <span className="flex items-center gap-1 font-medium text-white"><svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {mem.resolution_time_days} days</span>
                            </div>
                        </div>
                        
                        <div className="bg-[#0a1628]/80 p-4 rounded-xl border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                            <strong className="block text-cyan-400 text-xs uppercase mb-2 tracking-wide">Winning Lever</strong>
                            <p className="text-sm text-white font-medium mb-2">{mem.key_lever}</p>
                            <p className="text-xs text-slate-400 leading-relaxed">{mem.strategy_detail}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatBox label="Total Cases" value={data.collective_stats.total_cases} color="text-cyan-400" icon="📂" />
                <StatBox label="Similar Patterns" value={data.collective_stats.similar_patterns} color="text-purple-400" icon="🔍" />
                <StatBox label="Win Rate" value={`${data.collective_stats.win_rate}%`} color="text-emerald-400" icon="🏆" />
                <StatBox label="Avg Resolution" value={`${data.collective_stats.avg_resolution_days} Days`} color="text-orange-400" icon="⏱️" />
                <StatBox label="Total Recovered" value={data.collective_stats.total_recovered} color="text-green-400" icon="💰" />
            </div>
        </div>
    );
};

const StatBox = ({ label, value, color, icon }: any) => (
    <div className="bg-[#1a2744]/50 border border-white/5 rounded-xl p-5 text-center hover:bg-[#1a2744] transition-colors group">
        <div className="text-2xl mb-2 opacity-50 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300">{icon}</div>
        <div className={`text-2xl font-bold mb-1 ${color}`}>{value}</div>
        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{label}</div>
    </div>
);

// --- TAB 3: APPEAL ---
const AppealTab = ({ data }: any) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(data.appeal_letter.body);
        alert("Appeal letter copied to clipboard!"); 
    };

    return (
        <div className="animate-fade-in flex flex-col items-center">
             <div className="w-full max-w-3xl flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-white">Your Draft Appeal Letter</h2>
                 <div className="flex gap-3">
                     <button onClick={handleCopy} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:-translate-y-0.5">Copy to Clipboard</button>
                     <button className="px-4 py-2 border border-white/20 hover:bg-white/5 rounded-lg text-sm font-bold transition-colors">Download Text</button>
                 </div>
             </div>

             <div className="bg-white text-black p-12 md:p-16 rounded shadow-2xl max-w-3xl w-full font-serif text-lg leading-relaxed whitespace-pre-wrap relative">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-slate-200 to-transparent pointer-events-none rounded-tr-sm"></div>
                 {data.appeal_letter.body}
             </div>

             <div className="mt-12 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                     <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg"><span className="text-cyan-400 bg-cyan-400/10 p-1 rounded">✓</span> Key Arguments</h3>
                     <ul className="space-y-3">
                         {data.appeal_letter.key_arguments.map((arg: string, i: number) => (
                             <li key={i} className="text-slate-300 text-sm flex gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                 <span className="text-cyan-500 mt-0.5">•</span> {arg}
                             </li>
                         ))}
                     </ul>
                 </div>
                 <div>
                     <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg"><span className="text-cyan-400 bg-cyan-400/10 p-1 rounded">📎</span> Attachments</h3>
                     <ul className="space-y-3">
                         {data.appeal_letter.recommended_attachments.map((att: string, i: number) => (
                             <li key={i} className="text-slate-300 text-sm flex gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                 <span className="text-cyan-500 mt-0.5">□</span> {att}
                             </li>
                         ))}
                     </ul>
                 </div>
             </div>
        </div>
    );
};

// --- TAB 4: CONSULTANT ---
const ConsultantTab = ({ data, onRequestConsult, messages, setMessages }: any) => {
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;
        
        // Optimistic UI update
        setMessages((prev: any[]) => [...prev, { role: 'user', text }]);
        setInput("");
        setIsTyping(true);
        
        try {
            // Get full response
            const fullResponse = await onRequestConsult(text);
            
            // Create placeholder message for streaming
            setIsTyping(false);
            setMessages((prev: any[]) => [...prev, { role: 'model', text: "" }]);
            
            // Stream it into the last message
            await streamResponse(fullResponse, (chunk) => {
                setMessages((prev: any[]) => {
                    const newHistory = [...prev];
                    const lastMsg = newHistory[newHistory.length - 1];
                    lastMsg.text += chunk;
                    return newHistory;
                });
                messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
            });
            
        } catch(e) {
            setIsTyping(false);
            setMessages((prev: any[]) => [...prev, { role: 'model', text: "I'm having trouble connecting right now." }]);
        }
    };

    const suggestions = [
        "What if I don't have the PT records?",
        "Should I hire a lawyer?",
        "What are my chances without more documents?"
    ];

    return (
        <div className="animate-fade-in max-w-4xl mx-auto h-[600px] flex flex-col bg-[#050b14] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
             <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>

             {/* Chat Area */}
             <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
                 {messages.length === 0 && <SkeletonLoader type="text" count={3} />}
                 
                 {messages.map((m: any, i: number) => (
                     <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                         {m.role === 'model' && (
                             <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold mr-3 mt-1 shrink-0 shadow-[0_0_10px_cyan]">V</div>
                         )}
                         <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-br-sm' : 'bg-[#1a2744] text-slate-200 border border-white/10 rounded-bl-sm'}`}>
                             {m.text}
                         </div>
                     </div>
                 ))}
                 
                 {isTyping && (
                     <div className="flex justify-start animate-fade-in">
                         <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold mr-3 mt-1 shrink-0">V</div>
                         <div className="bg-[#1a2744] p-4 rounded-2xl rounded-bl-sm flex gap-1 items-center h-10 border border-white/10">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                         </div>
                     </div>
                 )}
                 <div ref={messagesEndRef} />
             </div>

             {/* Input Area */}
             <div className="bg-[#151b2b]/90 backdrop-blur border-t border-white/5 p-4 z-20">
                 <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                     {suggestions.map((s, i) => (
                         <button key={i} onClick={() => handleSend(s)} className="whitespace-nowrap px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/20 transition-all hover:scale-105 active:scale-95">
                             {s}
                         </button>
                     ))}
                 </div>
                 <div className="flex gap-2 relative">
                     <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                        placeholder="Ask VYNDA anything..."
                        className="flex-1 bg-[#0a1628] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all shadow-inner"
                     />
                     <button 
                        onClick={() => handleSend(input)} 
                        disabled={!input.trim() || isTyping} 
                        className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transform active:scale-95"
                     >
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                     </button>
                 </div>
             </div>
        </div>
    );
};

export default ResultsView;
