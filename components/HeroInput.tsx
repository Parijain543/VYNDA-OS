
import React, { useState, useRef } from 'react';
import { UploadedFile } from '../types';
import Logo from './Logo';

interface HeroInputProps {
  onAnalyze: (text: string, files: UploadedFile[], noPolicy: boolean, seed: number, isDemoMode: boolean) => void;
}

const HeroInput: React.FC<HeroInputProps> = ({ onAnalyze }) => {
  const [inputText, setInputText] = useState('');
  const [denialFile, setDenialFile] = useState<UploadedFile | null>(null);
  const [policyFile, setPolicyFile] = useState<UploadedFile | null>(null);
  const [noPolicy, setNoPolicy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [seed] = useState<number>(() => Math.floor(Math.random() * 999999));
  const [isDemoMode, setIsDemoMode] = useState(false);

  const denialInputRef = useRef<HTMLInputElement>(null);
  const policyInputRef = useRef<HTMLInputElement>(null);
  const MAX_SIZE_MB = 6;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, type: 'DENIAL_LETTER' | 'POLICY_DOC') => {
    setErrorMsg(null);
    setIsDemoMode(false); // Reset demo mode on manual upload
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setErrorMsg(`File too large (>${MAX_SIZE_MB}MB).`);
        e.target.value = '';
        return;
      }
      const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
      });
      const newFile: UploadedFile = { file, base64, mimeType: file.type, label: type };
      if (type === 'DENIAL_LETTER') setDenialFile(newFile);
      else { setPolicyFile(newFile); setNoPolicy(false); }
    }
  };

  // --- DEMO MODE LOGIC ---
  const loadDemo = async () => {
      // Immediate Trigger
      setIsDemoMode(true);
      setNoPolicy(true);
      onAnalyze("DEMO MODE TRIGGERED", [], true, seed, true);
  };

  const isReady = denialFile && (policyFile || noPolicy);

  const handleSubmit = () => {
    if (!isReady) return;
    const files = [denialFile!];
    if (policyFile) files.push(policyFile);
    onAnalyze(inputText, files, noPolicy, seed, isDemoMode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 animate-fade-in py-10 relative">
      
      {/* GLOBAL DEMO BUTTON - ABSOLUTE TOP RIGHT OF CONTAINER */}
      <div className="absolute top-6 right-6 z-50">
          <button 
              onClick={loadDemo}
              className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:scale-95"
          >
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Try Demo Case
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
      </div>

      <div className="absolute inset-0 bg-blue-500/5 blur-[100px] pointer-events-none rounded-full transform scale-75 animate-pulse-slow"></div>

      {/* Header */}
      <div className="text-center space-y-6 mb-12 flex flex-col items-center z-10">
        <div className="relative inline-block mb-2 animate-float">
            <Logo size="lg" />
            <div className="absolute -inset-10 bg-emerald-500/20 blur-3xl rounded-full -z-10 opacity-30 animate-pulse"></div>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-emerald-100 drop-shadow-[0_0_25px_rgba(56,189,248,0.2)] select-none animate-scale-in">
          VYNDA
        </h1>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 animate-fade-in" style={{animationDelay: '0.2s'}}>
          Collective Intelligence for Medical Defense
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl bg-[#0B1021]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-8 relative overflow-hidden group z-10 animate-slide-up" style={{animationDelay: '0.3s'}}>
        
        {errorMsg && (
            <div className="relative z-10 bg-red-500/10 border border-red-500/30 text-red-200 text-sm p-4 rounded-lg text-center animate-fade-in">
                {errorMsg}
            </div>
        )}

        {/* Step 1: Denial Letter */}
        <div className="space-y-3 relative z-10">
             <div className="flex justify-between items-center">
                 <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-lg shadow-blue-900/50">1</span>
                    Denial Letter
                 </label>
             </div>
             <div 
                onClick={() => denialInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 group/drop ${
                    denialFile 
                    ? 'border-emerald-500/50 bg-emerald-500/5 cursor-default' 
                    : 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50 cursor-pointer hover:scale-[1.01]'
                }`}
             >
                <input type="file" ref={denialInputRef} className="hidden" accept=".pdf,image/*" onChange={(e) => handleFile(e, 'DENIAL_LETTER')} />
                {denialFile ? (
                    <div className="text-center animate-scale-in">
                        <div className="bg-emerald-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-400">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-white font-medium">{denialFile.file.name}</p>
                        <p className="text-[10px] text-emerald-400 mt-1 uppercase tracking-wide font-bold">Document Parsed Successfully</p>
                    </div>
                ) : (
                    <div className="text-center text-slate-500 group-hover/drop:text-blue-400 transition-colors">
                        <svg className="w-8 h-8 mx-auto mb-3 opacity-50 transition-transform group-hover/drop:scale-110 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        <p className="font-medium">Upload Denial PDF or Image</p>
                    </div>
                )}
             </div>
        </div>

        {/* Step 2: Policy Document */}
        <div className="space-y-3 relative z-10">
             <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-700/50 text-slate-400 flex items-center justify-center text-xs border border-white/5">2</span>
                Policy Document
             </label>
             <div 
                onClick={() => !noPolicy && policyInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 flex items-center justify-center transition-all duration-300 ${
                    noPolicy ? 'opacity-50 cursor-not-allowed border-slate-800 bg-slate-900/50' : 
                    policyFile ? 'border-emerald-500/50 bg-emerald-500/5 cursor-pointer' : 
                    'border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50 cursor-pointer hover:scale-[1.01]'
                }`}
             >
                <input type="file" ref={policyInputRef} className="hidden" accept=".pdf" onChange={(e) => handleFile(e, 'POLICY_DOC')} disabled={noPolicy} />
                {policyFile ? (
                    <div className="text-center animate-scale-in">
                         <p className="text-white font-medium">{policyFile.file.name}</p>
                    </div>
                ) : (
                    <div className="text-center text-slate-500">
                        <p>{noPolicy ? 'Policy Skipped (Standard of Care Fallback)' : 'Upload Policy PDF (Optional)'}</p>
                    </div>
                )}
             </div>
             
             {/* Checkbox for No Policy */}
             <div className="flex items-center gap-2 group cursor-pointer" onClick={() => {
                 setNoPolicy(!noPolicy);
                 if(!noPolicy) setPolicyFile(null);
             }}>
                 <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${noPolicy ? 'bg-blue-600 border-blue-600' : 'border-slate-600 bg-slate-800 group-hover:border-slate-500'}`}>
                    {noPolicy && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                 </div>
                 <label className={`text-xs select-none cursor-pointer transition-colors ${noPolicy ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                    I don't have my policy document
                 </label>
             </div>
        </div>

        {/* Action Button */}
        <button
            onClick={handleSubmit}
            disabled={!isReady}
            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-[0.2em] transition-all relative z-10 overflow-hidden group shadow-lg ${
                isReady 
                ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-emerald-500/30 transform hover:-translate-y-1 active:scale-98' 
                : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
            }`}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {isReady ? 'INITIALIZE ANALYSIS' : 'AWAITING INPUT...'}
                {isReady && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
            </span>
            {isReady && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
        </button>

      </div>
    </div>
  );
};

export default HeroInput;
