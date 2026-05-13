import { Voice } from "@/lib/data/voices";
import { cn } from "@/lib/utils";
import { Play, Square, Cpu, User, Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getVoicePreviewAction } from "@/app/actions/tts";

interface VoiceCardProps {
  voice: Voice;
  isSelected: boolean;
  onSelect: (voiceId: string) => void;
}

export function VoiceCard({ voice, isSelected, onSelect }: VoiceCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);


  const handlePreview = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      return;
    }
    try {
      setIsLoading(true);
      const result = await getVoicePreviewAction(voice.id);

      if (result.success && result.audioUrl) {
        if (audioRef.current) {
          audioRef.current.pause();
        }

        const audio = new Audio(result.audioUrl);
        audioRef.current = audio;

        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
        audio.onpause = () => setIsPlaying(false);
        audio.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
        };

        await audio.play();
      }
    } catch (error) {
      console.error("Failed to play preview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => onSelect(voice.id)}
      className={cn(
        "relative flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md",
        isSelected
          ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
          : "border-border/40 bg-card hover:border-primary/40"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            onClick={handlePreview}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-sm",
              isPlaying ? "bg-primary text-primary-foreground" : "bg-accent hover:bg-primary/20 text-foreground"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Square className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-1" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-lg leading-none">{voice.name}</h4>
          </div>
        </div>

        {isSelected && (
          <div className="bg-primary text-primary-foreground p-1 rounded-full shadow-sm">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <Badge variant="secondary" className="flex items-center gap-1.5 rounded-full px-2.5 font-medium bg-background border border-border/50">
          <Cpu className="w-3.5 h-3.5 text-primary/70" />
          {voice.model}
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1.5 rounded-full px-2.5 font-medium bg-background border border-border/50">
          <User className="w-3.5 h-3.5 text-muted-foreground" />
          {voice.gender}
        </Badge>
      </div>
    </div>
  );
}
