export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: "Lo-Fi" | "Suspense" | "Upbeat" | "Horror" | "Cinematic" | "Ambient" | "Phonk";
  duration: string; // e.g. "2:30"
  previewUrl?: string; // mocked
}

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: "m-1", title: "Midnight Stroll", artist: "ChillHop Beats", genre: "Lo-Fi", duration: "2:45" },
  { id: "m-2", title: "Deep Focus", artist: "Study Music", genre: "Lo-Fi", duration: "3:10" },
  { id: "m-3", title: "Unseen Danger", artist: "Dark Audio", genre: "Suspense", duration: "1:55" },
  { id: "m-4", title: "Ticking Clock", artist: "Tension Builders", genre: "Suspense", duration: "2:15" },
  { id: "m-5", title: "Summer Vibes", artist: "Pop Tunes", genre: "Upbeat", duration: "2:30" },
  { id: "m-6", title: "Happy Steps", artist: "Pop Tunes", genre: "Upbeat", duration: "2:05" },
  { id: "m-7", title: "Creeping Shadows", artist: "Dark Audio", genre: "Horror", duration: "3:00" },
  { id: "m-8", title: "Jump Scare", artist: "Tension Builders", genre: "Horror", duration: "1:30" },
  { id: "m-9", title: "Epic Journey", artist: "Symphony X", genre: "Cinematic", duration: "2:50" },
  { id: "m-10", title: "Hero's Return", artist: "Symphony X", genre: "Cinematic", duration: "3:20" },
  { id: "m-11", title: "Drift Away", artist: "Cloud Sounds", genre: "Ambient", duration: "4:00" },
  { id: "m-12", title: "Night Rider", artist: "Bass Boosted", genre: "Phonk", duration: "2:10" },
];

export const MUSIC_GENRES = ["All", "Lo-Fi", "Suspense", "Upbeat", "Horror", "Cinematic", "Ambient", "Phonk"];
