
import React from 'react';

interface DemoStoryProps {
  onRunAnalysis: () => void;
}

const DemoStory: React.FC<DemoStoryProps> = ({ onRunAnalysis }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0a1628]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] to-[#050b14]"></div>
      
      <div className="relative z-10 w-full max-w-2xl animate-slide-up">
        <div className="bg-[#1a2744] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Top Section */}
            <div className="p-8 text-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                <div className="w-32 h-32 mx-auto bg-slate-700 rounded-full mb-4 flex items-center justify-center border-4 border-[#0a1628] shadow-lg relative overflow-hidden">
                    <svg className="w-20 h-20 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Meet Eleanor Vance</h1>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">45 • Elementary School Teacher</p>
            </div>

            {/* Story Section */}
            <div className="p-8 space-y-6">
                <div className="bg-[#0a1628]/50 p-6 rounded-xl border border-white/5">
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Eleanor has suffered from debilitating knee pain for 18 months. After trying physical therapy, medications, and injections without relief, her orthopedic surgeon recommended a <strong className="text-white">Total Knee Arthroplasty</strong>. UnitedHealth Group denied the claim, stating the procedure is "experimental/investigational."
                    </p>
                    <p className="mt-4 text-emerald-400/90 italic font-medium">
                        "Eleanor is facing a choice: pay $47,000 out of pocket, or live with chronic pain that prevents her from teaching."
                    </p>
                </div>

                {/* Documents List */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">What Eleanor Submitted:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {["Insurance denial letter", "Policy terms document", "Doctor's treatment notes", "Physical therapy records"].map((doc, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="text-slate-300 text-sm">{doc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Section */}
            <div className="p-8 pt-0">
                <button 
                    onClick={onRunAnalysis}
                    className="w-full py-4 bg-gradient-to-r from-[#00d4ff] to-[#0099ff] hover:from-[#33ddff] hover:to-[#33aaff] text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/20 transform transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
                >
                    Run Analysis for Eleanor
                </button>
                <p className="text-center text-slate-500 text-xs mt-4">
                    This is a demo case simulation. No real patient data is used.
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default DemoStory;
