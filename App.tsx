
import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Auth from './components/Auth';
import ChatInterface from './components/ChatInterface';
import Journal from './components/Journal';
import Insights from './components/Insights';
import Customizer from './components/Customizer';
import Profile from './components/Profile';
import { AppState, User } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.LANDING);
  const [activeTab, setActiveTab] = useState<'chat' | 'journal' | 'insights' | 'customize' | 'profile'>('chat');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('lumi_session');
    if (session) {
      setCurrentUser(JSON.parse(session));
      setView(AppState.DASHBOARD);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('lumi_session', JSON.stringify(user));
    setView(AppState.DASHBOARD);
    setActiveTab('chat');
  };

  const handleLogout = () => {
    // Instant logout for better UX
    setCurrentUser(null);
    localStorage.removeItem('lumi_session');
    setView(AppState.AUTH);
    setActiveTab('chat'); 
  };

  if (view === AppState.LANDING) {
    return <Landing setView={setView} />;
  }

  if (view === AppState.AUTH) {
    return <Auth onLogin={handleLogin} />;
  }

  if (!currentUser) {
    // Fallback if session is lost but view state is incorrect
    return <Auth onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'chat', label: 'Sanctuary', icon: '✨' },
    { id: 'journal', label: 'Journal', icon: '📓' },
    { id: 'insights', label: 'Insights', icon: '📊' },
    { id: 'customize', label: 'Lumi', icon: '🎨' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col transition-colors duration-500 text-black">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('chat')}
            className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-100 shadow-lg cursor-pointer hover:rotate-12 transition-transform"
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-black tracking-tight leading-none">Lumi</span>
            <span className="text-[10px] text-gray-400 font-medium">Hello, {currentUser.name.split(' ')[0]}</span>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-1 p-1 bg-gray-100 rounded-2xl">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-black hover:bg-white/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
              activeTab === 'profile' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-white'
            }`}
          >
            <span className="text-xs font-bold">{currentUser.name.charAt(0)}</span>
          </button>
          <button 
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>
      
      {/* Mobile/Tablet Navigation */}
      <div className="lg:hidden flex items-center justify-start gap-1 p-3 bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-500'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
          <button 
            onClick={handleLogout}
            className="px-4 py-2 rounded-full text-[10px] font-bold whitespace-nowrap bg-red-50 text-red-500 transition-all flex items-center gap-1.5 ml-auto"
          >
            <span>👋</span>
            Sign Out
          </button>
      </div>

      <main className="flex-1 relative p-6 max-w-7xl mx-auto w-full overflow-x-hidden">
        {activeTab === 'chat' && <ChatInterface userId={currentUser.id} />}
        {activeTab === 'journal' && <Journal userId={currentUser.id} />}
        {activeTab === 'insights' && <Insights userId={currentUser.id} />}
        {activeTab === 'customize' && <Customizer userId={currentUser.id} />}
        {activeTab === 'profile' && <Profile user={currentUser} onLogout={handleLogout} />}
      </main>
    </div>
  );
};

export default App;
