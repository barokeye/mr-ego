import { GoogleGenAI, Modality } from "@google/genai";
import { Profile, Message, Gender } from "../types";

/**
 * Helper to decode Base64 strings into Uint8Array.
 */
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Fetches a response from the Gemini tutor model.
 */
export const getTutorResponse = async (
  profile: Profile,
  history: Message[],
  userInput: string
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-pro-preview";

  const mascotName = profile.gender === 'boy' ? 'Mr. Ego (the Dog)' : 'Miss Ego (the Cat)';
  const personality = profile.gender === 'boy' 
    ? 'a friendly, energetic, and encouraging golden retriever dog tutor' 
    : 'a wise, graceful, and patient calico cat tutor';

  const systemInstruction = `
    You are ${mascotName}, ${personality}. 
    You are teaching ${profile.name}.
    Explain educational concepts simply and funly.
    Always use emojis. Keep text concise and encouraging.
    If the student is young, use very simple words.
  `;

  const contents = history.map(m => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));
  
  contents.push({
    role: 'user',
    parts: [{ text: userInput }]
  });

  const response = await ai.models.generateContent({
    model,
    contents,
    config: { systemInstruction, temperature: 0.7 },
  });

  return response.text || "";
};

/**
 * Generates speech for the tutor using Gemini TTS.
 */
export const generateSpeech = async (text: string, gender: Gender): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const voiceName = gender === 'boy' ? 'Kore' : 'Puck';

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) return "";

  const audioData = decodeBase64(base64Audio);
  const blob = new Blob([audioData], { type: 'audio/pcm' });
  return URL.createObjectURL(blob);
};

/**
 * Helper to decode raw PCM audio data for the Web Audio API.
 */
export async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}
