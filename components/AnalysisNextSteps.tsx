import React from 'react';
import { VyndaResponse } from '../types';

interface AnalysisNextStepsProps {
  data: VyndaResponse;
}

const AnalysisNextSteps: React.FC<AnalysisNextStepsProps> = ({ data }) => {
  const case_summary = data?.case_summary || { win_probability_percent: 0, fairness_assessment: "Pending" };
  const patient_explanation = data?.patient_explanation || { next_steps: [], short: "" };
  const memory_cases = data?.memory_cases || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Probabilities */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between">
        <div>
            <h3 className="text-xl font-semibold text-white mb-6">Case Strength</h3>
            
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-sm text-emerald-300 font-medium mb-2">
                        <span>Win Probability (Vynda Strategy)</span>
                        <span>{case_summary.win_probability_percent || 0}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full animate-pulse" style={{ width: `${case_summary.win_probability_percent || 0}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Calculated based on {memory_cases.length} similar historical cases and policy contradiction analysis.
                    </p>
                </div>
            </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-800">
             <h4 className="text-sm font-semibold text-slate-300 mb-2">Fairness Assessment</h4>
             <p className="text-sm text-slate-400 italic">"{case_summary.fairness_assessment}"</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-br from-blue-900/20 to-slate-900/60 border border-blue-500/10 rounded-2xl p-6 md:p-8">
        <h3 className="text-xl font-semibold text-white mb-6">What to do now</h3>
        
        <ul className="space-y-4 mb-8">
            {(patient_explanation.next_steps || []).map((action, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-200 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold mt-0.5">
                        {i + 1}
                    </span>
                    {action}
                </li>
            ))}
        </ul>
        
        <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/10">
            <p className="text-sm text-blue-200/80 leading-relaxed">
                {patient_explanation.short}
            </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisNextSteps;
