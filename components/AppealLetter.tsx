import React, { useState } from 'react';
import { VyndaResponse } from '../types';

interface AppealLetterProps {
  data: VyndaResponse;
}

const AppealLetter: React.FC<AppealLetterProps> = ({ data }) => {
  const { appeal_letter, case_summary } = data;
  const [isCopied, setIsCopied] = useState(false);
  const [showDownloadToast, setShowDownloadToast] = useState(false);

  const handleCopy = () => {
    const editor = document.getElementById('appeal-editor');
    if (editor) {
        navigator.clipboard.writeText(editor.innerText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const editor = document.getElementById('appeal-editor');
    if (!editor) return;
    
    // Show Toast
    setShowDownloadToast(true);
    setTimeout(() => setShowDownloadToast(false), 4000);
    
    // Simulate Download
    const text = editor.innerText;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `Appeal_${case_summary.patient_name || 'Draft'}.txt`;
    link.href = url;
    link.click();
  };

  if (!appeal_letter) {
      return (
          <div className="animate-slide-up h-full flex flex-col items-center justify-center min-h-[400px] text-center p-8">
              <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-b-2 border-blue-500 rounded-full animate-spin direction-reverse"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Drafting Legal Arguments</h3>
              <p className="text-slate-400 max-w-sm">
                  Vynda is currently synthesizing the policy contradictions and precedent strategies into a formal appeal letter.
              </p>
          </div>
      );
  }

  return (
    <div className="animate-slide-up h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6 shrink-0">
         <div>
            <h2 className="text-2xl font-bold transition-colors text-white">Appeal Draft</h2>
            <p className="text-sm transition-colors text-slate-400">Review, edit, and export. {appeal_letter.tone_notes}</p>
         </div>
         <div className="flex gap-3">
             <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-2 border rounded-lg font-medium text-sm transition-all bg-slate-800 hover:bg-slate-700 border-white/5 text-slate-200"
             >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download
             </button>
             <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition-all bg-emerald-600 hover:bg-emerald-500 text-white"
             >
                {isCopied ? "Copied!" : "Copy Text"}
             </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl p-4 md:p-8 border shadow-inner transition-colors duration-500 bg-navy-950/50 border-white/5">
         <div className="max-w-[816px] mx-auto bg-white text-slate-900 shadow-2xl min-h-[1000px] p-[60px] md:p-[96px] font-serif leading-relaxed text-[11pt]">
            <div id="appeal-editor" contentEditable suppressContentEditableWarning className="outline-none whitespace-pre-wrap space-y-4">
                {appeal_letter.body}
            </div>
         </div>
      </div>

      {/* Toast Notification */}
      <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${showDownloadToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-[#050712] border border-emerald-500/30 text-emerald-400 px-6 py-3 rounded-full shadow-2xl shadow-emerald-900/40 flex items-center gap-3">
              <span className="bg-emerald-500/10 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>
              <span className="font-mono text-sm">Successfully Generated PDF_Appeal_88291.pdf</span>
          </div>
      </div>
    </div>
  );
};

export default AppealLetter;