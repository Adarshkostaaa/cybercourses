import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, Flame, Trophy, Sparkles, Heart, Zap, Award } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'milestone' | 'social' | 'learning';
  xpReward: number;
  completed: boolean;
  icon: string;
  action?: string;
}

interface PsychologicalEngagementProps {
  userEmail: string;
  isSignedIn: boolean;
}

const PsychologicalEngagement: React.FC<PsychologicalEngagementProps> = ({ userEmail, isSignedIn }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [showReward, setShowReward] = useState(false);
  const [lastCompletedTask, setLastCompletedTask] = useState('');
  const [dailyQuote, setDailyQuote] = useState('');

  const quotes = [
    "The expert in anything was once a beginner.",
    "Learning never exhausts the mind. — Leonardo da Vinci",
    "The beautiful thing about learning is nobody can take it away from you.",
    "Education is the passport to the future.",
    "A journey of a thousand miles begins with a single step.",
    "Invest in yourself. Your career is the engine of your wealth.",
    "The more you learn, the more you earn.",
    "Knowledge is power. Information is liberating."
  ];

  const defaultTasks: Task[] = [
    { id: 't1', title: 'Daily Check-in', description: 'Visit the platform today', type: 'daily', xpReward: 10, completed: false, icon: '☀️' },
    { id: 't2', title: 'Explore a Course', description: 'View details of any course', type: 'learning', xpReward: 15, completed: false, icon: '📖' },
    { id: 't3', title: 'Share Knowledge', description: 'Share a course with a friend', type: 'social', xpReward: 25, completed: false, icon: '💬' },
    { id: 't4', title: 'Complete Profile', description: 'Set up your username and details', type: 'milestone', xpReward: 50, completed: false, icon: '👤' },
    { id: 't5', title: 'Wishlist a Course', description: 'Add a course to your wishlist', type: 'learning', xpReward: 10, completed: false, icon: '❤️' },
    { id: 't6', title: 'Read Reviews', description: 'Read student reviews on any course', type: 'learning', xpReward: 10, completed: false, icon: '⭐' },
  ];

  useEffect(() => {
    const dayIndex = new Date().getDate() % quotes.length;
    setDailyQuote(quotes[dayIndex]);

    if (!userEmail) return;

    const key = `engagement_${userEmail.toLowerCase()}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      const data = JSON.parse(stored);
      const today = new Date().toDateString();
      
      if (data.lastVisit !== today) {
        // New day — reset daily tasks, increment streak
        const resetTasks = data.tasks.map((t: Task) => 
          t.type === 'daily' ? { ...t, completed: false } : t
        );
        const newStreak = data.lastVisit === new Date(Date.now() - 86400000).toDateString() 
          ? data.streak + 1 : 1;
        
        const updatedData = {
          ...data,
          tasks: resetTasks,
          streak: newStreak,
          lastVisit: today
        };
        localStorage.setItem(key, JSON.stringify(updatedData));
        setTasks(resetTasks);
        setStreak(newStreak);
        setTotalXP(data.totalXP);
        setLevel(Math.floor(data.totalXP / 100) + 1);
      } else {
        setTasks(data.tasks);
        setStreak(data.streak);
        setTotalXP(data.totalXP);
        setLevel(Math.floor(data.totalXP / 100) + 1);
      }
    } else {
      const initialData = {
        tasks: defaultTasks,
        streak: 1,
        totalXP: 0,
        lastVisit: new Date().toDateString()
      };
      localStorage.setItem(key, JSON.stringify(initialData));
      setTasks(defaultTasks);
      setStreak(1);
    }

    // Auto-complete daily check-in
    setTimeout(() => completeTask('t1'), 1000);
  }, [userEmail]);

  const completeTask = (taskId: string) => {
    if (!userEmail) return;
    
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId && !t.completed) {
          setTotalXP(xp => {
            const newXP = xp + t.xpReward;
            setLevel(Math.floor(newXP / 100) + 1);
            return newXP;
          });
          setLastCompletedTask(t.title);
          setShowReward(true);
          setTimeout(() => setShowReward(false), 2500);
          return { ...t, completed: true };
        }
        return t;
      });

      const key = `engagement_${userEmail.toLowerCase()}`;
      const stored = JSON.parse(localStorage.getItem(key) || '{}');
      stored.tasks = updated;
      stored.totalXP = (stored.totalXP || 0) + (prev.find(t => t.id === taskId && !t.completed)?.xpReward || 0);
      localStorage.setItem(key, JSON.stringify(stored));
      
      return updated;
    });
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const taskProgress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  const xpToNext = 100 - (totalXP % 100);

  if (!isSignedIn) return null;

  return (
    <div className="relative">
      {/* XP Reward Toast */}
      {showReward && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
            <div>
              <p className="font-bold text-sm">+XP Earned!</p>
              <p className="text-xs text-indigo-200">{lastCompletedTask}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 rounded-2xl border border-blue-100/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <Trophy className="h-6 w-6 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-heading">Your Learning Journey</h3>
                <p className="text-indigo-200 text-sm">Keep up the great work!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur px-3 py-1.5 rounded-lg">
                <Flame className="h-4 w-4 text-orange-300" />
                <span className="font-bold text-sm">{streak} day streak</span>
              </div>
            </div>
          </div>

          {/* Level & XP Bar */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-300" />
                <span className="font-bold">Level {level}</span>
              </div>
              <span className="text-indigo-200 text-sm">{totalXP} XP • {xpToNext} XP to next level</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${(totalXP % 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Daily Quote */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900 italic">"{dailyQuote}"</p>
              <p className="text-xs text-amber-600 mt-1">Daily Motivation</p>
            </div>
          </div>
        </div>

        {/* Task Progress Overview */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-500" /> Today's Tasks
            </h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
              {completedCount}/{tasks.length} done
            </span>
          </div>
          
          <div className="w-full h-2 bg-gray-100 rounded-full mb-5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${taskProgress}%` }} />
          </div>

          {/* Tasks */}
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id}
                onClick={() => !task.completed && completeTask(task.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer group ${
                  task.completed 
                    ? 'bg-green-50/50 border-green-100' 
                    : 'bg-white border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-sm'
                }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                  task.completed ? 'bg-green-100' : 'bg-gray-50 group-hover:bg-indigo-100'
                }`}>
                  {task.completed ? <CheckCircle className="h-5 w-5 text-green-500" /> : task.icon}
                </div>
                <div className="flex-1">
                  <h5 className={`text-sm font-medium transition-colors ${task.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </h5>
                  <p className="text-xs text-gray-500">{task.description}</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  task.completed ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  +{task.xpReward} XP
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Flame, value: streak, label: 'Streak', color: 'text-orange-500' },
              { icon: Zap, value: totalXP, label: 'Total XP', color: 'text-indigo-500' },
              { icon: Award, value: `Lv.${level}`, label: 'Level', color: 'text-purple-500' },
              { icon: CheckCircle, value: completedCount, label: 'Tasks', color: 'text-green-500' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
                <div className="text-sm font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Calming message */}
        <div className="px-6 py-3 text-center bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-t border-blue-100/30">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Heart className="h-3 w-3 text-pink-400" />
            Take it easy. Learning is a marathon, not a sprint.
            <Heart className="h-3 w-3 text-pink-400" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default PsychologicalEngagement;
