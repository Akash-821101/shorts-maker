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
  { code: "es-ES", name: "Spanish", flag: "🇪🇸" },
  { code: "fr-FR", name: "French", flag: "🇫🇷" },
  { code: "de-DE", name: "German", flag: "🇩🇪" },
  { code: "it-IT", name: "Italian", flag: "🇮🇹" },
  { code: "pt-BR", name: "Portuguese", flag: "🇧🇷" },
  { code: "hi-IN", name: "Hindi", flag: "🇮🇳" },
  { code: "ja-JP", name: "Japanese", flag: "🇯🇵" },
  { code: "ar-AE", name: "Arabic", flag: "🇦🇪" },
];

export const VOICES: Voice[] = [
  // English US
  { id: "dg-asteria", name: "Asteria", model: "Deepgram", gender: "Female", languageCode: "en-US" },
  { id: "dg-luna", name: "Luna", model: "Deepgram", gender: "Female", languageCode: "en-US" },
  { id: "dg-orion", name: "Orion", model: "Deepgram", gender: "Male", languageCode: "en-US" },
  { id: "fl-alex", name: "Alex", model: "Fondalab", gender: "Male", languageCode: "en-US" },
  { id: "fl-emma", name: "Emma", model: "Fondalab", gender: "Female", languageCode: "en-US" },
  
  // English UK
  { id: "dg-stella", name: "Stella", model: "Deepgram", gender: "Female", languageCode: "en-UK" },
  { id: "fl-arthur", name: "Arthur", model: "Fondalab", gender: "Male", languageCode: "en-UK" },
  
  // Spanish
  { id: "dg-isabella", name: "Isabella", model: "Deepgram", gender: "Female", languageCode: "es-ES" },
  { id: "fl-mateo", name: "Mateo", model: "Fondalab", gender: "Male", languageCode: "es-ES" },
  
  // French
  { id: "dg-chloe", name: "Chloe", model: "Deepgram", gender: "Female", languageCode: "fr-FR" },
  { id: "fl-louis", name: "Louis", model: "Fondalab", gender: "Male", languageCode: "fr-FR" },

  // German
  { id: "dg-klara", name: "Klara", model: "Deepgram", gender: "Female", languageCode: "de-DE" },
  { id: "fl-lukas", name: "Lukas", model: "Fondalab", gender: "Male", languageCode: "de-DE" },

  // Italian
  { id: "dg-sofia", name: "Sofia", model: "Deepgram", gender: "Female", languageCode: "it-IT" },
  { id: "fl-marco", name: "Marco", model: "Fondalab", gender: "Male", languageCode: "it-IT" },

  // Portuguese
  { id: "dg-valentina", name: "Valentina", model: "Deepgram", gender: "Female", languageCode: "pt-BR" },
  { id: "fl-gabriel", name: "Gabriel", model: "Fondalab", gender: "Male", languageCode: "pt-BR" },

  // Hindi
  { id: "dg-diya", name: "Diya", model: "Deepgram", gender: "Female", languageCode: "hi-IN" },
  { id: "fl-aarav", name: "Aarav", model: "Fondalab", gender: "Male", languageCode: "hi-IN" },

  // Japanese
  { id: "dg-yui", name: "Yui", model: "Deepgram", gender: "Female", languageCode: "ja-JP" },
  { id: "fl-ren", name: "Ren", model: "Fondalab", gender: "Male", languageCode: "ja-JP" },

  // Arabic
  { id: "dg-layla", name: "Layla", model: "Deepgram", gender: "Female", languageCode: "ar-AE" },
  { id: "fl-omar", name: "Omar", model: "Fondalab", gender: "Male", languageCode: "ar-AE" },
];
