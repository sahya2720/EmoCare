
import React from 'react';
import { User } from '../types';
import { db } from '../services/database';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const userData = db.getUserData(user.id);
  const stats = {
    messages: userData.messages.length,
    journalEntries: userData.journal.length,
    moodsCaptured: userData.moodHistory.reduce((acc, curr) => acc + curr.count, 0)
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all your Lumi data? This will delete your history and log you out for a fresh start.")) {
      db.saveUserData(user.id, {
        messages: [],
        journal: [],
        settings: userData.settings,
        moodHistory: []
      });
      // After clearing, it's safest to logout
      localStorage.removeItem('lumi_session');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-black">
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-100/30 overflow-hidden">
        {/* Header Decoration */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
          <div className="absolute -bottom-12 left-10">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-lg flex items-center justify-center border-4 border-white">
              <span className="text-4xl font-bold text-indigo-600">{user.name.charAt(0)}</span>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-10 px-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-3xl font-bold text-black tracking-tight">{user.name}</h1>
              <p className="text-black font-medium opacity-70">{user.email}</p>
            </div>
            <button 
              onClick={onLogout}
              className="px-8 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="p-6 bg-gray-50 rounded-3xl text-center">
              <p className="text-2xl font-bold text-black">{stats.messages}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Chat Messages</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl text-center">
              <p className="text-2xl font-bold text-black">{stats.journalEntries}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Journal Logs</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl text-center">
              <p className="text-2xl font-bold text-black">{stats.moodsCaptured}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Mood Checks</p>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-black mb-4">Privacy & Database</h3>
              <div className="p-6 border border-gray-100 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-black text-sm">Clear Conversation History</p>
                    <p className="text-xs text-gray-600">Remove all messages stored in your local sanctuary.</p>
                  </div>
                  <button 
                    onClick={handleClearData}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Reset Now
                  </button>
                </div>
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-black text-sm">Account ID</p>
                    <p className="text-[10px] font-mono text-gray-500">{user.id}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full">Encrypted Local Storage</span>
                </div>
              </div>
            </div>
            
            <p className="text-center text-xs text-gray-500">
              Lumi values your privacy. Your data is stored locally in this browser's database and is never shared with third parties without your consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
