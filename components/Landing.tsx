
import React from 'react';
import { AppState } from '../types';

const Landing: React.FC<{ setView: (v: AppState) => void }> = ({ setView }) => {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
          <span className="text-xl font-bold text-black">Lumi</span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-gray-600">
          <a href="#" className="hover:text-indigo-600 transition-colors">Home</a>
          <a href="#about" className="hover:text-indigo-600 transition-colors">About Us</a>
          <a href="#features" className="hover:text-indigo-600 transition-colors">Contact</a>
        </div>
        <button 
          onClick={() => setView(AppState.AUTH)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">
            Emotional Wellness Companion
          </span>
          <h1 className="text-6xl md:text-7xl font-bold text-black leading-[1.1]">
            Your Mind's <br /><span className="text-indigo-600">Sanctuary.</span>
          </h1>
          <p className="text-lg text-black leading-relaxed max-w-lg">
            Meet Lumi, an AI-powered empathetic companion that understands your emotions, listens to your thoughts, and helps you find peace through mindful interactions.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => setView(AppState.AUTH)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-xl hover:bg-indigo-700 transition-all scale-100 active:scale-95"
            >
              Start Your Journey
            </button>
            <button className="px-8 py-4 bg-white text-black rounded-full font-bold shadow-sm border border-gray-100 hover:border-indigo-200 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-indigo-400 blur-[100px] opacity-20 animate-pulse rounded-full"></div>
          <div className="relative z-10 w-full max-w-md p-12 bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/50 shadow-2xl animate-float">
             <div className="flex flex-col items-center gap-6">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🤖</span>
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-indigo-600 font-bold">Lumi is online</p>
                  <p className="text-sm text-black italic font-medium">"I'm here to listen, always."</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold text-black">Designed for your well-being</h2>
            <p className="text-black max-w-2xl mx-auto">Emotional health is as important as physical health. Lumi combines cutting-edge AI with empathetic care.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Sentiment Analysis", icon: "🧠", text: "Advanced text analysis understands the subtle nuances of your mood." },
              { title: "Facial Insights", icon: "📸", text: "Periodic webcam checks detect stress or fatigue to offer real-time support." },
              { title: "Personal Journal", icon: "📓", text: "A private space to log your thoughts and track your emotional evolution." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-all hover:shadow-lg">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                <p className="text-black leading-relaxed opacity-80">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;