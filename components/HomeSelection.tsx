
import React, { useRef } from 'react';
import { UploadedFile } from '../types';
import Logo from './Logo';

interface HomeSelectionProps {
  onStartDemo: () => void;
  onUpload: (files: UploadedFile[]) => void;
}

const HomeSelection: React.FC<HomeSelectionProps> = ({ onStartDemo, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: UploadedFile[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const base64 = await new Promise<string>((resolve) => {
           const reader = new FileReader();
           reader.onloadend = () => resolve(reader.result as string);
           reader.readAsDataURL(file);
        });
        files.push({ file, base64, mimeType: file.type, label: 'DENIAL_LETTER' }); // Simplification for MVP
      }
      onUpload(files);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[#0a1628]">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-6 animate-fade-in">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-emerald-100 drop-shadow-[0_0_25px_rgba(56,189,248,0.2)]">
            VYNDA
          </h1>
          <p className="text-slate-400 font-mono text-sm uppercase tracking-[0.3em]">
            Medical Defense Intelligence
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* Option 1: Upload */}
          <div className="group relative bg-[#1a2744] border border-white/10 rounded-2xl p-8 hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/20 cursor-pointer flex flex-col items-center text-center h-full justify-center min-h-[320px]"
               onClick={() => fileInputRef.current?.click()}>
            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" />
            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
              <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">Upload Your Case</h2>
            <p className="text-slate-400 mb-8 max-w-xs">Upload your denial letter and policy documents for a personal analysis.</p>
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/30 w-full max-w-[240px]">
              Upload Denial + Policy
            </button>
          </div>

          {/* Option 2: Demo */}
          <div className="group relative bg-[#1a2744] border border-white/10 rounded-2xl p-8 hover:border-emerald-400/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/20 cursor-pointer flex flex-col items-center text-center h-full justify-center min-h-[320px]"
               onClick={onStartDemo}>
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
              <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-200 transition-colors">Try Demo Case</h2>
            <p className="text-slate-400 mb-8 max-w-xs">Experience VYNDA with Eleanor Vance's story. No documents needed.</p>
            <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/30 w-full max-w-[240px]">
              See How It Works
            </button>
            
            {/* Warning Tooltip simulation */}
            <div className="absolute top-4 right-4 text-[10px] bg-slate-800 text-slate-500 px-2 py-1 rounded border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                Simulated Data
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomeSelection;
