
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, EmotionResult, LumiSettings } from '../types';
import { getLumiResponse, analyzeFacialEmotion } from '../services/geminiService';
import { db } from '../services/database';
import LumiCharacter from './Character';

const ChatInterface: React.FC<{ userId: string }> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [settings, setSettings] = useState<LumiSettings>({ color: 'sky', accessory: 'none' });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const data = db.getUserData(userId);
    setSettings(data.settings);
    if (data.messages.length === 0) {
      const welcome: Message = { 
        id: '1', 
        role: 'model', 
        text: "Welcome back to your sanctuary. I'm here to listen—how are you feeling in this moment?", 
        timestamp: new Date().toISOString() 
      };
      setMessages([welcome]);
      db.updateMessages(userId, [welcome]);
    } else {
      setMessages(data.messages);
    }
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240, facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn("Camera access denied or failed", err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: input, 
      timestamp: new Date().toISOString() 
    };
    
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    db.updateMessages(userId, updatedMessages);
    
    setInput('');
    setIsTyping(true);

    try {
      const response = await getLumiResponse(updatedMessages, input);
      const lumiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: response, 
        timestamp: new Date().toISOString() 
      };
      const finalMessages = [...updatedMessages, lumiMsg];
      setMessages(finalMessages);
      db.updateMessages(userId, finalMessages);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return;

    try {
      const context = canvasRef.current.getContext('2d');
      if (context && videoRef.current.videoWidth > 0) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
        
        const result = await analyzeFacialEmotion(base64);
        if (result) {
          setDetectedEmotion(result);
          db.logMood(userId, result.emotion);
          
          const emotionMsg: Message = {
            id: 'emotion-' + Date.now(),
            role: 'model',
            text: `I noticed you seem a bit ${result.emotion.toLowerCase()}. ${result.suggestion}`,
            timestamp: new Date().toISOString()
          };
          const updated = [...messages, emotionMsg];
          setMessages(updated);
          db.updateMessages(userId, updated);
        }
      }
    } catch (err) {
      console.warn("Analysis failed", err);
    }
  }, [isCameraActive, messages, userId]);

  useEffect(() => {
    const timer = setTimeout(() => captureAndAnalyze(), 8000);
    const interval = setInterval(() => captureAndAnalyze(), 60000 * 10); // Check every 10 mins
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [captureAndAnalyze]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto relative">
      <div className="absolute top-0 right-0 z-40 group">
        <div className="relative w-32 h-32 md:w-48 md:h-48 overflow-hidden rounded-[2.5rem] border-4 border-white shadow-2xl bg-gray-200 transition-all hover:scale-105">
          {!isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center text-black p-4 text-center text-[10px] font-bold uppercase tracking-widest leading-tight">
              Sensing<br/>Paused
            </div>
          )}
          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover transform -scale-x-100 ${!isCameraActive ? 'hidden' : 'block'}`} 
            autoPlay 
            playsInline 
            muted 
          />
          {detectedEmotion && (
            <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-md rounded-xl py-1.5 px-3 text-[10px] text-white font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              {detectedEmotion.emotion.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-24 scrollbar-hide">
        <div className="flex justify-center my-12">
          <LumiCharacter 
            mood={detectedEmotion?.emotion || 'happy'} 
            settings={settings}
          />
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-[2.5rem] shadow-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100' 
                : 'bg-white text-black border border-gray-100 rounded-tl-none'
            }`}>
              <p className="text-sm md:text-base font-medium whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-[9px] mt-2 font-black uppercase tracking-widest opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left text-black'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-5 rounded-[2rem] border border-gray-100 rounded-tl-none shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-4 left-4 right-4 lg:left-0 lg:right-0 lg:max-w-4xl lg:mx-auto">
        <div className="relative group">
          <input
            type="text"
            className="w-full pl-8 pr-16 py-6 bg-white rounded-[2rem] shadow-2xl border border-gray-100 focus:ring-8 focus:ring-indigo-50 outline-none transition-all text-sm md:text-base text-black placeholder:text-gray-400"
            placeholder="Share your heart with Lumi..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:bg-indigo-200 transition-all shadow-lg active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ChatInterface;