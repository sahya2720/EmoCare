
import React, { useMemo } from 'react';
import { db } from '../services/database';

const Insights: React.FC<{ userId: string }> = ({ userId }) => {
  const userData = db.getUserData(userId);
  const history = userData.moodHistory || [];

  const stats = useMemo(() => {
    const moodCounts: Record<string, number> = {};
    history.forEach(h => {
      moodCounts[h.emotion] = (moodCounts[h.emotion] || 0) + h.count;
    });
    
    const sorted = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
    const topMood = sorted[0]?.[0] || 'Unknown';
    const total = Object.values(moodCounts).reduce((a, b) => a + b, 0);

    // Group by date for the chart (last 7 days)
    const daily: Record<string, number> = {};
    history.slice(-20).forEach(h => {
      daily[h.date] = (daily[h.date] || 0) + h.count;
    });
    
    return { topMood, total, sorted, daily: Object.entries(daily).slice(-7) };
  }, [history]);

  const emotionColors: Record<string, string> = {
    'Happy': 'bg-amber-400',
    'Sad': 'bg-blue-400',
    'Stressed': 'bg-rose-400',
    'Fatigued': 'bg-emerald-400',
    'Neutral': 'bg-indigo-400'
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-8 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Dominant Emotion</p>
          <p className="text-4xl font-bold text-indigo-600">{stats.topMood}</p>
          <p className="text-sm text-gray-500 mt-2">Based on {stats.total} snapshots.</p>
        </div>
        
        <div className="md:col-span-2 p-8 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Weekly Activity Trend</p>
          <div className="flex items-end justify-between h-32 gap-2">
            {stats.daily.length > 0 ? stats.daily.map(([date, count], i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-indigo-500 rounded-t-xl transition-all duration-1000 group-hover:bg-indigo-600 shadow-sm"
                  style={{ height: `${Math.min(100, (count / 10) * 100)}%` }}
                />
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">
                  {date.split('/')[1]}/{date.split('/')[0]}
                </span>
              </div>
            )) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-sm">
                Log more moments to see your trend
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-8 bg-indigo-600 rounded-[3rem] text-white shadow-xl shadow-indigo-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">💡</div>
            <h3 className="text-xl font-bold">Lumi's Weekly Reflection</h3>
          </div>
          <p className="text-indigo-100 leading-relaxed italic">
            "Looking at the data, you've experienced a lot of {stats.topMood.toLowerCase()} moments this week. 
            It's beautiful to see your emotional journey unfold. Remember, every state is temporary and valid. 
            Continue being kind to yourself."
          </p>
        </div>

        <div className="p-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Emotion Breakdown</h3>
          <div className="space-y-4">
            {stats.sorted.map(([emotion, count]) => (
              <div key={emotion} className="space-y-1">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-gray-500">{emotion}</span>
                  <span className="text-indigo-600">{Math.round((count / stats.total) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${emotionColors[emotion] || 'bg-indigo-400'} rounded-full transition-all duration-1000`}
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {stats.sorted.length === 0 && (
                <p className="text-gray-400 italic text-sm text-center py-4">No data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
