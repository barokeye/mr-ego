export type Gender = 'boy' | 'girl' | 'other';

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  audioUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}

export interface Profile {
  id: string;
  name: string;
  dob: string;
  gender: Gender;
  interests: string[];
  lessons?: Lesson[];
}
