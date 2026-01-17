
import React, { useState } from 'react';
import { Gender, Profile } from '../types';
import { User, Calendar, Smile, Heart, ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: Profile) => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onCancel, showCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Profile>>({
    id: Math.random().toString(36).substr(2, 9),
    interests: [],
    gender: 'boy'
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (formData.name && formData.dob && formData.gender) {
      onComplete(formData as Profile);
    }
  };

  const interestOptions = ['Math', 'Science', 'Art', 'Music', 'History', 'Reading', 'Animals', 'Space'];

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border-4 border-blue-200 text-gray-900">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
          <Smile size={40} />
        </div>
        <h2 className="text-3xl font-bold text-blue-900">Welcome to Mr. Ego!</h2>
        <p className="text-blue-600 mt-2">Let's set up your student profile.</p>
      </div>

      <div className="flex justify-between mb-8 px-4">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`w-3 h-3 rounded-full ${s <= step ? 'bg-blue-500' : 'bg-blue-200'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <label className="block">
            <span className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <User size={20} className="text-blue-500" /> What's your name?
            </span>
            <input
              type="text"
              className="w-full p-4 bg-gray-50 border-2 border-blue-100 rounded-xl focus:border-blue-500 outline-none transition-all text-xl text-gray-900 placeholder-gray-400"
              placeholder="Enter your name..."
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <label className="block">
            <span className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Calendar size={20} className="text-blue-500" /> When is your birthday?
            </span>
            <input
              type="date"
              className="w-full p-4 bg-gray-50 border-2 border-blue-100 rounded-xl focus:border-blue-500 outline-none transition-all text-xl text-gray-900"
              value={formData.dob || ''}
              onChange={e => setFormData({ ...formData, dob: e.target.value })}
            />
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <span className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2">
            Who should your teacher be?
          </span>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setFormData({ ...formData, gender: 'boy' })}
              className={`p-6 rounded-2xl border-4 transition-all flex flex-col items-center gap-3 ${
                formData.gender === 'boy' ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100' : 'border-gray-100 bg-white hover:border-blue-200'
              }`}
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">🐕</div>
              <span className="font-bold text-lg text-gray-900">A Dog</span>
              <p className="text-xs text-gray-500">Fun & Energetic</p>
            </button>
            <button
              onClick={() => setFormData({ ...formData, gender: 'girl' })}
              className={`p-6 rounded-2xl border-4 transition-all flex flex-col items-center gap-3 ${
                formData.gender === 'girl' ? 'border-pink-500 bg-pink-50 ring-4 ring-pink-100' : 'border-gray-100 bg-white hover:border-pink-200'
              }`}
            >
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-3xl">🐈</div>
              <span className="font-bold text-lg text-gray-900">A Cat</span>
              <p className="text-xs text-gray-500">Calm & Patient</p>
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <span className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2">
            <Heart size={20} className="text-red-500" /> What do you like to learn?
          </span>
          <div className="grid grid-cols-3 gap-2">
            {interestOptions.map(interest => (
              <button
                key={interest}
                onClick={() => {
                  const current = formData.interests || [];
                  if (current.includes(interest)) {
                    setFormData({ ...formData, interests: current.filter(i => i !== interest) });
                  } else {
                    setFormData({ ...formData, interests: [...current, interest] });
                  }
                }}
                className={`py-2 px-3 rounded-full text-sm font-medium transition-all ${
                  formData.interests?.includes(interest)
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex gap-4">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="flex-1 p-4 flex items-center justify-center gap-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <ChevronLeft size={20} /> Back
          </button>
        )}
        {step < 4 ? (
          <button
            disabled={
              (step === 1 && !formData.name) ||
              (step === 2 && !formData.dob)
            }
            onClick={nextStep}
            className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg hover:shadow-blue-200"
          >
            Next <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex-[2] bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg hover:shadow-green-200"
          >
            Finish Setup! ✨
          </button>
        )}
      </div>

      {showCancel && onCancel && (
        <button 
          onClick={onCancel}
          className="w-full mt-4 text-gray-400 hover:text-gray-600 text-sm font-medium"
        >
          Cancel
        </button>
      )}
    </div>
  );
};
