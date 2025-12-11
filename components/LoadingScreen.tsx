
import React, { useState, useEffect } from 'react';

const steps = [
    "Reading denial letter...",
    "Scanning policy documents...",
    "Detecting contradictions...",
    "Consulting precedent memory bank...",
    "Calculating win probability...",
    "Drafting appeal strategy..."
];

const LoadingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Total duration ~5.5s
    const intervals = [1000, 1000, 1000, 1200, 1200, 600];
    
    let stepIndex = 0;
    const nextStep = () => {
        if (stepIndex < steps.length - 1) {
            stepIndex++;
            setCurrentStep(stepIndex);
            setTimeout(nextStep, intervals[stepIndex]);
        }
    };

    const timer = setTimeout(nextStep, intervals[0]);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a1628] text-slate-200">
      
      <div className="relative mb-8">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="h-8 flex items-center justify-center w-full max-w-md">
        <p className="text-xl font-medium text-white animate-fade-in key={currentStep}">
            {steps[currentStep]}
        </p>
      </div>

    </div>
  );
};

export default LoadingScreen;
