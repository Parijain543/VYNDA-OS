
import React, { useState, Suspense } from 'react';
import { VyndaResponse, UploadedFile, ChatMessage } from './types';
import { analyzeCase, chatWithVynda } from './services/geminiService';
import HomeSelection from './components/HomeSelection';
import DemoStory from './components/DemoStory';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load ResultsView for better initial performance
const ResultsView = React.lazy(() => import('./components/ResultsView'));

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'story' | 'loading' | 'results'>('home');
  const [data, setData] = useState<VyndaResponse | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [seed] = useState<number>(12345);

  const startDemoFlow = () => {
      setView('story');
  };

  const runDemoAnalysis = async () => {
      setView('loading');
      // Simulate/Run analysis
      try {
          const result = await analyzeCase("DEMO", [], true, seed, true);
          setData(result);
          // Set initial chat message for the results view
          setChatHistory([{ role: 'model', text: result.consultant_prompt || "How can I help?" }]);
          setView('results');
      } catch (e) {
          console.error(e);
          alert("Error loading demo.");
          setView('home');
      }
  };

  const handleUpload = async (files: UploadedFile[]) => {
      setView('loading');
      try {
          const result = await analyzeCase("UPLOADED_FILE", files, false, seed, false);
          setData(result);
          setChatHistory([{ role: 'model', text: result.consultant_prompt || "Analysis complete." }]);
          setView('results');
      } catch (e) {
          console.error(e);
          alert("Error analyzing files. Please try again.");
          setView('home');
      }
  };

  const handleConsult = async (userMsg: string): Promise<string> => {
      if (!data) return "";
      const response = await chatWithVynda(JSON.stringify(data.case_summary), chatHistory, userMsg);
      setChatHistory(prev => [...prev, { role: 'user', text: userMsg }, { role: 'model', text: response }]);
      return response;
  };

  return (
    <ErrorBoundary>
        <div className="min-h-screen bg-[#0a1628] text-white selection:bg-cyan-500/30">
            {view === 'home' && <HomeSelection onStartDemo={startDemoFlow} onUpload={handleUpload} />}
            
            {view === 'story' && <DemoStory onRunAnalysis={runDemoAnalysis} />}
            
            {view === 'loading' && <LoadingScreen />}
            
            {view === 'results' && data && (
                <Suspense fallback={<LoadingScreen />}>
                    <ResultsView 
                        data={data} 
                        onReset={() => {
                            setData(null);
                            setView('home');
                        }} 
                        onRequestConsult={handleConsult} 
                    />
                </Suspense>
            )}
        </div>
    </ErrorBoundary>
  );
};

export default App;
