export interface Voice {
  id: string;
  name: string;
  model: "Deepgram" | "Fondalab";
  gender: "Male" | "Female";
  previewUrl?: string; // mocked for now
  languageCode: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string; // emoji
}

export const LANGUAGES: Language[] = [
  { code: "en-US", name: "English (US)", flag: "🇺🇸" },
  { code: "en-UK", name: "English (UK)", flag: "🇬🇧" },
  { code: "hi-IN", name: "Hindi", flag: "🇮🇳" },
  
];

export const VOICES: Voice[] = [
  // English US
   { id: "aura-2-asteria-en", name: "Asteria", model: "Deepgram", gender: "Female", languageCode: "en-US" },
  { id: "aura-2-luna-en", name: "Luna", model: "Deepgram", gender: "Female", languageCode: "en-US" },
  { id: "aura-2-pluto-en", name: "Pluto", model: "Deepgram", gender: "Male", languageCode: "en-US" },
  { id: "aura-2-thalia-en", name: "Thalia", model: "Deepgram", gender: "Female", languageCode: "en-US" },
  {id: "aura-2-iris-en", name: "Iris", model: "Deepgram", gender: "Female", languageCode: "en-US"},
  
  // English UK
  { id: "aura-2-draco-en", name: "Draco", model: "Deepgram", gender: "Male", languageCode: "en-UK" },
  { id: "aura-2-pandora-en", name: "Pandora", model: "Deepgram", gender: "Female", languageCode: "en-UK" },

  // Hindi
   { id: "fl-meghra", name: "Meghra", model: "Fondalab", gender: "Female", languageCode: "hi-IN" },
  { id: "fl-pancham", name: "Pancham", model: "Fondalab", gender: "Male", languageCode: "hi-IN" },
  { id: "fl-kritika", name: "Kritika", model: "Fondalab", gender: "Female", languageCode: "hi-IN" },
  { id: "fl-raag", name: "Raag", model: "Fondalab", gender: "Male", languageCode: "hi-IN" },
  { id: "fl-sarvagya", name: "Sarvagya", model: "Fondalab", gender: "Male", languageCode: "hi-IN" },
  { id: "fl-tara", name: "Tara", model: "Fondalab", gender: "Female", languageCode: "hi-IN" },
  { id: "fl-komal", name: "Komal", model: "Fondalab", gender: "Female", languageCode: "hi-IN" },
  { id: "fl-dhruv", name: "Dhruv", model: "Fondalab", gender: "Male", languageCode: "hi-IN" },
  { id: "fl-gauri", name: "Gauri", model: "Fondalab", gender: "Female", languageCode: "hi-IN" },
  { id: "fl-roshini", name: "Roshini", model: "Fondalab", gender: "Female", languageCode: "hi-IN" },
  { id: "fl-parikshit", name: "Parikshit", model: "Fondalab", gender: "Male", languageCode: "hi-IN" },
  { id: "fl-karn", name: "Karn", model: "Fondalab", gender: "Male", languageCode: "hi-IN" },
  { id: "fl-mandra", name: "Mandra", model: "Fondalab", gender: "Female", languageCode: "hi-IN" },
  { id: "fl-ruhi", name: "Ruhi", model: "Fondalab", gender: "Female", languageCode: "hi-IN" },
  { id: "fl-sharad", name: "Sharad", model: "Fondalab", gender: "Male", languageCode: "hi-IN" },
];

export const SAMPLE_VOICE_ENGLISH='Hi! Welcome to Shorts Maker. I’m excited to help you create amazing stories and viral videos.'
export const SAMPLE_VOICE_HINDI='नमस्ते! शॉर्ट्स मेकर में आपका स्वागत है। चलिए मिलकर शानदार और वायरल वीडियो बनाते हैं।'
