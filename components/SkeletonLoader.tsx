
import React from 'react';

interface SkeletonProps {
  type: 'card' | 'text' | 'chart';
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonProps> = ({ type, count = 1, className = "" }) => {
  const items = Array.from({ length: count });

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((_, i) => (
        <div key={i} className="animate-pulse">
          {type === 'text' && (
            <div className="space-y-2">
              <div className="h-4 bg-slate-800/50 rounded w-3/4"></div>
              <div className="h-4 bg-slate-800/50 rounded w-1/2"></div>
            </div>
          )}
          {type === 'card' && (
            <div className="bg-slate-800/30 rounded-xl p-6 h-32 border border-white/5">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-700/30 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-slate-700/40 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-700/30 rounded w-full"></div>
                  <div className="h-3 bg-slate-700/30 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          )}
          {type === 'chart' && (
            <div className="flex items-end gap-2 h-24">
               <div className="w-8 bg-slate-800/50 rounded-t h-full"></div>
               <div className="w-8 bg-slate-800/50 rounded-t h-2/3"></div>
               <div className="w-8 bg-slate-800/50 rounded-t h-3/4"></div>
               <div className="w-8 bg-slate-800/50 rounded-t h-1/2"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
