import React, { useState, useEffect } from 'react';
import { Profile, Message, Lesson } from './types';
import { Onboarding } from './components/Onboarding';
import { Classroom } from './components/Classroom';
import { LessonHistory } from './components/LessonHistory';
import { MascotIcon } from './components/MascotIcon';
import { Trash2, BookOpen, UserPlus, History } from 'lucide-react';

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [view, setView] = useState<'selection' | 'onboarding' | 'classroom' | 'history'>('selection');

  useEffect(() => {
    const saved = localStorage.getItem('mr_ego_profiles');
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfiles(parsed);
      if (parsed.length === 0) setView('onboarding');
    } else {
      setView('onboarding');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mr_ego_profiles', JSON.stringify(profiles));
  }, [profiles]);

  const addProfile = (profile: Profile) => {
    setProfiles(prev => [...prev, profile]);
    setActiveProfileId(profile.id);
    setView('classroom');
  };

  const deleteProfile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this profile and all its history?')) {
      setProfiles(prev => prev.filter(p => p.id !== id));
      if (activeProfileId === id) setActiveProfileId(null);
    }
  };

  const handleExitClassroom = (history: Message[]) => {
    if (history.length > 1 && activeProfileId) {
      const firstUserMsg = history.find(m => m.role === 'user');
      const title = firstUserMsg ? firstUserMsg.text.slice(0, 40) + (firstUserMsg.text.length > 40 ? '...' : '') : 'Quick Lesson';
      
      const newLesson: Lesson = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        timestamp: Date.now(),
        messages: history
      };

      setProfiles(prev => prev.map(p => 
        p.id === activeProfileId 
          ? { ...p, lessons: [newLesson, ...(p.lessons || [])] }
          : p
      ));
    }
    setView('selection');
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  if (view === 'onboarding') {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <Onboarding 
          onComplete={addProfile} 
          onCancel={profiles.length > 0 ? () => setView('selection') : undefined}
          showCancel={profiles.length > 0}
        />
      </div>
    );
  }

  if (view === 'classroom' && activeProfile) {
    return (
      <div className="h-screen bg-blue-50 pt-4 px-4 sm:pt-10">
        <Classroom 
          profile={activeProfile} 
          onExit={handleExitClassroom} 
        />
      </div>
    );
  }

  if (view === 'history' && activeProfile) {
    return (
      <div className="min-h-screen bg-blue-50 pt-10">
        <LessonHistory 
          profile={activeProfile} 
          onBack={() => setView('selection')} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6 sm:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-5xl font-extrabold text-blue-600 tracking-tight">Mr. Ego ✨</h1>
            <p className="text-blue-400 font-medium text-lg mt-2">Personalized AI Tutors with Voice Mode</p>
          </div>
          <button
            onClick={() => setView('onboarding')}
            className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold shadow-lg border-b-4 border-blue-100 hover:bg-blue-50 transition-all"
          >
            <UserPlus size={22} /> New Account
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map(profile => (
            <div
              key={profile.id}
              className="group bg-white rounded-[40px] shadow-xl hover:shadow-2xl transition-all border-4 border-transparent hover:border-blue-400 overflow-hidden flex flex-col"
            >
              <div className="p-8 text-center flex-1">
                <div className="relative inline-block mb-6">
                  <MascotIcon gender={profile.gender} size={120} className="transform group-hover:scale-110 transition-transform" />
                  <button
                    onClick={(e) => deleteProfile(e, profile.id)}
                    className="absolute -top-2 -right-2 p-2 bg-red-50 text-red-300 hover:text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{profile.name}</h3>
                <p className="text-blue-500 font-semibold mb-4 capitalize">Learning with {profile.gender === 'boy' ? 'Mr. Ego' : 'Miss Ego'}</p>
                
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {profile.interests.slice(0, 3).map(interest => (
                    <span key={interest} className="px-3 py-1 bg-blue-50 text-blue-400 text-xs rounded-full font-bold">
                      #{interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 flex gap-2">
                <button
                  onClick={() => {
                    setActiveProfileId(profile.id);
                    setView('classroom');
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen size={18} /> Start
                </button>
                <button
                  onClick={() => {
                    setActiveProfileId(profile.id);
                    setView('history');
                  }}
                  className="px-4 bg-white text-blue-600 border-2 border-blue-100 rounded-2xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center"
                  title="Lesson History"
                >
                  <History size={20} />
                </button>
              </div>
            </div>
          ))}

          {profiles.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <h2 className="text-3xl font-bold text-gray-400">No profiles found.</h2>
              <p className="text-gray-400 mt-2">Create a new account to start learning!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;