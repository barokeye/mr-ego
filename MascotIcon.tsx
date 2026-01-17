import React from 'react';
import { Gender } from '../types';

interface MascotIconProps {
  gender: Gender;
  className?: string;
  size?: number;
}

export const MascotIcon: React.FC<MascotIconProps> = ({ gender, className = "", size = 120 }) => {
  if (gender === 'boy') {
    return (
      <div className={`relative flex items-center justify-center bg-orange-100 rounded-full p-4 border-4 border-orange-400 ${className}`} style={{ width: size, height: size }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-orange-600">
          <path d="M10 5.172C10 3.972 11 3 12 3s2 .972 2 2.172c0 .59-.24 1.123-.632 1.503L12 8l-1.368-1.325A2.162 2.162 0 0 1 10 5.172Z" />
          <path d="M12 18c-3.5 0-5-2.5-5-2.5S8.5 14 12 14s5 1.5 5 1.5-1.5 2.5-5 2.5Z" />
          <path d="M4.421 4.421c-1.454 1.454-1.217 4.545-.303 6.666.275.635.845.834 1.48.598 1.406-.522 3.033-.923 4.402-1.118" />
          <path d="M19.579 4.421c1.454 1.454 1.217 4.545.303 6.666-.275.635-.845.834-1.48.598-1.406-.522-3.033-.923-4.402-1.118" />
          <circle cx="9" cy="11" r="1" fill="currentColor" />
          <circle cx="15" cy="11" r="1" fill="currentColor" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center bg-pink-100 rounded-full p-4 border-4 border-pink-400 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-pink-600">
        <path d="M12 21c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8Z" />
        <path d="M7.5 3 9 7" />
        <path d="M16.5 3 15 7" />
        <circle cx="9" cy="12" r="1" fill="currentColor" />
        <circle cx="15" cy="12" r="1" fill="currentColor" />
        <path d="M10 16c1 1 3 1 4 0" />
      </svg>
    </div>
  );
};