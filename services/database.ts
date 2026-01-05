
import { User, UserData, Message, JournalEntry, LumiSettings, MoodLog } from "../types";

const USERS_KEY = 'lumi_users';
const DATA_PREFIX = 'lumi_data_';

const DEFAULT_SETTINGS: LumiSettings = {
  color: 'sky',
  accessory: 'none'
};

export const db = {
  // --- USER CORE ---
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  registerUser: (name: string, email: string, password: string): User | null => {
    const users = db.getUsers();
    if (users.find(u => u.email === email)) return null;

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      password
    };

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    
    // Initialize default integrated database structure for this user
    const initialData: UserData = { 
      messages: [], 
      journal: [], 
      settings: DEFAULT_SETTINGS,
      moodHistory: [] 
    };
    db.saveUserData(newUser.id, initialData);
    
    return newUser;
  },

  loginUser: (email: string, password: string): User | null => {
    const users = db.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },

  // --- DATA INTEGRATION ---
  getUserData: (userId: string): UserData => {
    const data = localStorage.getItem(`${DATA_PREFIX}${userId}`);
    const defaultData: UserData = { 
      messages: [], 
      journal: [], 
      settings: DEFAULT_SETTINGS,
      moodHistory: [] 
    };

    if (!data) return defaultData;

    try {
      const parsed = JSON.parse(data);
      return { ...defaultData, ...parsed }; // Merge to ensure new fields exist
    } catch (e) {
      return defaultData;
    }
  },

  saveUserData: (userId: string, data: UserData) => {
    localStorage.setItem(`${DATA_PREFIX}${userId}`, JSON.stringify(data));
  },

  // --- FEATURE-SPECIFIC UPDATES ---
  updateMessages: (userId: string, messages: Message[]) => {
    const data = db.getUserData(userId);
    db.saveUserData(userId, { ...data, messages });
  },

  updateJournal: (userId: string, journal: JournalEntry[]) => {
    const data = db.getUserData(userId);
    db.saveUserData(userId, { ...data, journal });
  },

  updateSettings: (userId: string, settings: LumiSettings) => {
    const data = db.getUserData(userId);
    db.saveUserData(userId, { ...data, settings });
  },

  logMood: (userId: string, emotion: string) => {
    const data = db.getUserData(userId);
    const today = new Date().toLocaleDateString();
    const history = [...(data.moodHistory || [])];
    
    const existingIndex = history.findIndex(h => h.date === today && h.emotion === emotion);
    if (existingIndex > -1) {
      history[existingIndex].count += 1;
    } else {
      history.push({ date: today, emotion, count: 1 });
    }
    
    // Maintain a healthy history limit
    if (history.length > 100) history.shift();
    
    db.saveUserData(userId, { ...data, moodHistory: history });
  }
};
