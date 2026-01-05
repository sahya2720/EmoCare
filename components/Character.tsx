
import React from 'react';
import { LumiSettings } from '../types';

const LumiCharacter: React.FC<{ mood?: string; settings?: LumiSettings }> = ({ 
  mood = 'happy', 
  settings = { color: 'sky', accessory: 'none' } 
}) => {
  const colors = {
    sky: { primary: '#BAE6FD', secondary: '#E0F2FE', blush: '#FCA5A5', glow: 'bg-blue-200' },
    rose: { primary: '#FDA4AF', secondary: '#FFE4E6', blush: '#F472B6', glow: 'bg-rose-200' },
    emerald: { primary: '#6EE7B7', secondary: '#D1FAE5', blush: '#34D399', glow: 'bg-emerald-200' },
    amber: { primary: '#FCD34D', secondary: '#FEF3C7', blush: '#F59E0B', glow: 'bg-amber-200' }
  };

  const theme = colors[settings.color] || colors.sky;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center animate-float">
      {/* Background Glow */}
      <div className={`absolute inset-0 ${theme.glow} blur-2xl opacity-30 rounded-full`}></div>
      
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
        {/* Body */}
        <circle cx="50" cy="50" r="40" fill={theme.secondary} />
        <circle cx="50" cy="50" r="35" fill={theme.primary} />
        
        {/* Eyes */}
        <g>
          <circle cx="35" cy="45" r="4" fill="#1E293B" />
          <circle cx="65" cy="45" r="4" fill="#1E293B" />
          <circle cx="34" cy="44" r="1.5" fill="white" />
          <circle cx="64" cy="44" r="1.5" fill="white" />
        </g>
        
        {/* Blushed Cheeks */}
        <circle cx="28" cy="55" r="6" fill={theme.blush} fillOpacity="0.4" />
        <circle cx="72" cy="55" r="6" fill={theme.blush} fillOpacity="0.4" />

        {/* Mouth */}
        {(mood.toLowerCase().includes('happy') || mood.toLowerCase().includes('neutral')) && (
          <path d="M40 60 Q50 70 60 60" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        )}
        {(mood.toLowerCase().includes('sad') || mood.toLowerCase().includes('stress')) && (
          <path d="M40 65 Q50 55 60 65" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        )}
        {mood.toLowerCase().includes('fatigued') && (
          <path d="M42 62 L58 62" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* Accessories */}
        {settings.accessory === 'glasses' && (
          <g>
            <circle cx="35" cy="45" r="7" fill="none" stroke="#1E293B" strokeWidth="2" />
            <circle cx="65" cy="45" r="7" fill="none" stroke="#1E293B" strokeWidth="2" />
            <line x1="42" y1="45" x2="58" y2="45" stroke="#1E293B" strokeWidth="2" />
          </g>
        )}
        {settings.accessory === 'hat' && (
          <g transform="translate(30, 0) rotate(-15, 20, 20)">
            <rect x="5" y="10" width="30" height="15" rx="2" fill="#4F46E5" />
            <rect x="0" y="22" width="40" height="4" rx="2" fill="#4338CA" />
          </g>
        )}
        {settings.accessory === 'bowtie' && (
          <g transform="translate(38, 75)">
            <path d="M0 0 L24 12 L24 -12 Z" fill="#EF4444" />
            <path d="M24 0 L0 12 L0 -12 Z" fill="#EF4444" transform="translate(24, 0) scale(-1, 1) translate(-24, 0)" />
            <circle cx="12" cy="0" r="4" fill="#B91C1C" />
          </g>
        )}
        
        {/* Antenna */}
        <line x1="50" y1="15" x2="50" y2="10" stroke="#1E293B" strokeWidth="2" />
        <circle cx="50" cy="8" r="3" fill="#FCD34D" className="animate-pulse" />
      </svg>
    </div>
  );
};

export default LumiCharacter;
