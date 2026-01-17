
import React, { useState } from 'react';
import { Profile, Lesson } from '../types';
import { BookOpen, Calendar, ChevronRight, ArrowLeft, Clock, MessageCircle } from 'lucide-react';

interface LessonHistoryProps {
  profile: Profile;
  onBack: () => void;
}

export const LessonHistory: React.FC<LessonHistoryProps> = ({ profile, onBack }) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedLesson) {
    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto bg-white shadow-2xl rounded-t-3xl overflow-hidden border-t-4 border-x-4 border-blue-100">
        <div className="bg-white p-4 flex items-center justify-between border-b-2 border-blue-50 px-6">
          <button onClick={() => setSelectedLesson(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all flex items-center gap-2 text-gray-500 font-bold">
            <ArrowLeft size={20} /> Back to History
          </button>
          <div className="text-right">
            <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{selectedLesson.title}</h3>
            <span className="text-xs text-gray-400">{formatDate(selectedLesson.timestamp)}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {selectedLesson.messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border-2 border-blue-100 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-md text-blue-600 hover:bg-blue-50 transition-all">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-blue-900">Learning Journal</h1>
          <p className="text-blue-500 font-medium">Review your past lessons with {profile.name}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {(!profile.lessons || profile.lessons.length === 0) ? (
          <div className="bg-white p-12 rounded-[40px] shadow-xl text-center border-4 border-dashed border-blue-100">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-200">
              <BookOpen size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-400">No Lessons Yet</h3>
            <p className="text-gray-400 mt-2">Start a new classroom session to build your history!</p>
          </div>
        ) : (
          profile.lessons.map(lesson => (
            <div
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className="group bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-400 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Clock size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {lesson.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-400 font-medium">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(lesson.timestamp)}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={14} /> {lesson.messages.length} steps</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-blue-400 transition-all transform group-hover:translate-x-1" size={28} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
