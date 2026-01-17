
import React, { useState, useRef, useEffect } from 'react';
import { Profile, Message } from '../types';
import { getTutorResponse, generateSpeech, decodeAudioData } from '../services/geminiService';
import { MascotIcon } from './MascotIcon';
import { Send, ArrowLeft, Loader2, Volume2, VolumeX } from 'lucide-react';

interface ClassroomProps {
  profile: Profile;
  onExit: (history: Message[]) => void;
}

export const Classroom: React.FC<ClassroomProps> = ({ profile, onExit }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const greet = async () => {
      setIsLoading(true);
      const greetingText = "Hello! I'm so excited to learn with you today! What should we explore first? 🚀";
      const userMsg: Message = { role: 'model', text: greetingText, timestamp: Date.now() };
      setMessages([userMsg]);
      setIsLoading(false);
      if (voiceEnabled) handleSpeak(greetingText);
    };
    greet();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSpeak = async (text: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const ttsResponse = await generateSpeech(text, profile.gender);
      const res = await fetch(ttsResponse);
      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = await decodeAudioData(new Uint8Array(arrayBuffer), ctx);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (err) {
      console.error("Speech error:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const textResponse = await getTutorResponse(profile, messages, currentInput);
      const modelMsg: Message = { 
        role: 'model', 
        text: textResponse, 
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMsg]);
      setIsLoading(false);

      if (voiceEnabled) handleSpeak(textResponse);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Oops, my circuits are tangled! Let's try again.", timestamp: Date.now() }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white shadow-2xl rounded-t-3xl overflow-hidden border-t-4 border-x-4 border-blue-100">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between border-b-2 border-blue-50 px-6">
        <button onClick={() => onExit(messages)} className="p-2 hover:bg-gray-100 rounded-full transition-all flex items-center gap-2 text-gray-500 font-bold">
          <ArrowLeft size={20} /> Finish
        </button>
        <div className="flex items-center gap-4">
          <MascotIcon gender={profile.gender} size={50} />
          <div className="text-left">
            <h3 className="font-bold text-xl text-gray-800">
              {profile.gender === 'boy' ? 'Mr. Ego' : 'Miss Ego'}
            </h3>
            <span className="text-xs font-medium text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live Tutor
            </span>
          </div>
        </div>
        <button 
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`p-3 rounded-full transition-all ${voiceEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
        >
          {voiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50"
        style={{ backgroundImage: 'radial-gradient(#cbd5e1 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-lg ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border-2 border-blue-100 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-400 p-4 rounded-2xl border-2 border-blue-50 flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} /> Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t-2 border-blue-50">
        <div className="flex gap-4">
          <input
            type="text"
            className="flex-1 p-4 bg-gray-50 border-2 border-blue-100 rounded-2xl focus:border-blue-500 outline-none transition-all text-lg text-gray-900 placeholder-gray-400"
            placeholder="Ask anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`p-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50`}
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
