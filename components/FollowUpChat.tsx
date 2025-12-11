import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithVynda } from '../services/geminiService';

interface FollowUpChatProps {
    initialContext: string;
}

const FollowUpChat: React.FC<FollowUpChatProps> = ({ initialContext }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    // Initial greeting
    useEffect(() => {
        // Subtle delay for "connection" feel
        setTimeout(() => {
            setMessages([{
                role: 'model',
                text: "I've analyzed the policy contradictions. The insurer is ignoring their own guidelines regarding acute cases. How can I help refine your appeal?"
            }]);
        }, 500);
    }, []);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => scrollToBottom(), [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userText = input;
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setInput('');
        setIsTyping(true);

        try {
            // Call the real service (which handles API vs Simulation internally)
            const responseText = await chatWithVynda(initialContext, messages, userText);
            
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the network. Please try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#080B16] relative border-l border-white/5">
            {/* Header with "Alive" Indicator */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0B1021]/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-slate-200 tracking-wide">Vynda Consultant</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] text-emerald-500/80 font-mono uppercase">System Active</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                            msg.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-br-none shadow-[0_4px_15px_rgba(37,99,235,0.2)]'
                                : 'bg-slate-800 text-slate-200 border border-white/5 rounded-bl-none shadow-[0_4px_15px_rgba(0,0,0,0.3)]'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="rounded-2xl rounded-bl-none px-4 py-3 bg-slate-800 border border-white/5 flex gap-1 items-center h-10 shadow-md w-16 justify-center">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-[bounce_1s_infinite_0ms]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-[bounce_1s_infinite_400ms]"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/5 bg-[#050712] relative z-20">
                <div className="relative group">
                    <input 
                        type="text" 
                        className="w-full rounded-xl pl-4 pr-10 py-3 text-sm outline-none transition-all duration-300 bg-slate-900 border border-white/10 text-white focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] placeholder-slate-600"
                        placeholder="Ask about policy, evidence, or strategy..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-2 p-1.5 rounded-lg disabled:opacity-30 text-slate-400 hover:text-white hover:bg-emerald-500 transition-all duration-300"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FollowUpChat;