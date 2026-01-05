
import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../services/database';

const Auth: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = db.loginUser(email, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password.');
      }
    } else {
      const user = db.registerUser(name, email, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Email already registered.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-6">
      <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white space-y-8 animate-float">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-xl shadow-indigo-100">
             <div className="w-6 h-6 bg-white/30 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-bold text-black tracking-tight">{isLogin ? 'Welcome Back' : 'Create Sanctuary'}</h1>
          <p className="text-black text-sm opacity-70">Empathetic support is just a step away.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-black" 
                placeholder="Jane Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-black" 
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2 ml-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-black" 
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:translate-y-[-2px] transition-all active:scale-95 active:translate-y-0"
          >
            {isLogin ? 'Sign In' : 'Join EMOCARE'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {isLogin ? "New here? Create an account" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;