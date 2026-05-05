import { Voice } from "@/lib/data/voices";
import { cn } from "@/lib/utils";
import { Play, Square, Cpu, User, Check } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface VoiceCardProps {
  voice: Voice;
  isSelected: boolean;
  onSelect: (voiceId: string) => void;
}

export function VoiceCard({ voice, isSelected, onSelect }: VoiceCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
    // Simulate audio playing length
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 3000);
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
            {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-1" />}
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
