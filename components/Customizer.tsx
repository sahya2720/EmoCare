
import React, { useState, useEffect } from 'react';
import { LumiSettings } from '../types';
import { db } from '../services/database';
import LumiCharacter from './Character';

const Customizer: React.FC<{ userId: string }> = ({ userId }) => {
  const [settings, setSettings] = useState<LumiSettings>({ color: 'sky', accessory: 'none' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = db.getUserData(userId);
    setSettings(data.settings);
  }, [userId]);

  const save = () => {
    db.updateSettings(userId, settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-100/50">
          <LumiCharacter settings={settings} />
          <p className="mt-8 text-indigo-600 font-bold tracking-tight">Meet Your Personalized Lumi</p>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Personalize Lumi</h2>
            <p className="text-gray-500">Choose colors and accessories that make you feel at ease.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Lumi's Glow</label>
              <div className="flex gap-4">
                {(['sky', 'rose', 'emerald', 'amber'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setSettings({ ...settings, color: c })}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      settings.color === c ? 'border-indigo-600 scale-110 shadow-lg' : 'border-white hover:scale-105'
                    } ${
                      c === 'sky' ? 'bg-sky-200' : c === 'rose' ? 'bg-rose-200' : c === 'emerald' ? 'bg-emerald-200' : 'bg-amber-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Accessories</label>
              <div className="grid grid-cols-2 gap-3">
                {(['none', 'glasses', 'hat', 'bowtie'] as const).map(a => (
                  <button
                    key={a}
                    onClick={() => setSettings({ ...settings, accessory: a })}
                    className={`px-4 py-3 rounded-2xl text-sm font-bold border transition-all ${
                      settings.accessory === a 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                        : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-100 hover:bg-indigo-50/30'
                    }`}
                  >
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={save}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-xl ${
              saved ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {saved ? 'Appearance Saved! ✨' : 'Apply Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customizer;
