
import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { db } from '../services/database';

const Journal: React.FC<{ userId: string }> = ({ userId }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const data = db.getUserData(userId);
    setEntries(data.journal);
  }, [userId]);

  const saveEntry = () => {
    if (!newEntry.content.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntry.title || 'Untitled Thought',
      content: newEntry.content,
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    db.updateJournal(userId, updated);
    setNewEntry({ title: '', content: '' });
    setIsAdding(false);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    db.updateJournal(userId, updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black tracking-tight">Your Reflection Journal</h2>
          <p className="text-gray-600 text-sm mt-1">A private space for your innermost thoughts.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-md ${
            isAdding 
              ? 'bg-gray-100 text-black hover:bg-gray-200' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95'
          }`}
        >
          {isAdding ? 'Close Editor' : 'Record New Thought'}
        </button>
      </div>

      {isAdding && (
        <div className="p-8 bg-white rounded-[2.5rem] border border-indigo-50 shadow-xl shadow-indigo-100/50 space-y-6 animate-in zoom-in-95 duration-300">
          <input
            type="text"
            placeholder="Give this thought a title..."
            className="w-full text-2xl font-bold outline-none border-b-2 border-gray-50 pb-4 focus:border-indigo-100 transition-colors placeholder:text-gray-300 text-black"
            value={newEntry.title}
            onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
          />
          <textarea
            placeholder="Let it all out here. What happened? How did it feel?"
            className="w-full h-64 outline-none resize-none text-black leading-relaxed text-lg placeholder:text-gray-300"
            value={newEntry.content}
            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
          />
          <div className="flex justify-end pt-4 border-t border-gray-50">
            <button 
              onClick={saveEntry}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:translate-y-[-2px]"
            >
              Preserve Reflection
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map(entry => (
          <div key={entry.id} className="group p-6 bg-white rounded-[2rem] border border-gray-100 hover:border-indigo-100 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 relative">
            <button 
              onClick={() => deleteEntry(entry.id)}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">{entry.date}</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-3 line-clamp-1">{entry.title}</h3>
            <p className="text-black line-clamp-4 text-sm leading-relaxed">{entry.content}</p>
          </div>
        ))}
        {entries.length === 0 && !isAdding && (
          <div className="col-span-full py-32 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <div className="text-5xl mb-6 grayscale opacity-30">📓</div>
            <p className="text-black font-medium">Your sanctuary journal is waiting for its first entry.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-6 text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
            >
              Start Writing Now →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;