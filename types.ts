
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface LumiSettings {
  color: 'sky' | 'rose' | 'emerald' | 'amber';
  accessory: 'none' | 'glasses' | 'hat' | 'bowtie';
}

export interface MoodLog {
  date: string;
  emotion: string;
  count: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  sentiment?: string;
}

export interface UserData {
  messages: Message[];
  journal: JournalEntry[];
  settings: LumiSettings;
  moodHistory: MoodLog[];
}

export enum AppState {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD'
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  suggestion: string;
}
