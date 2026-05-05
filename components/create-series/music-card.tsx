import { MusicTrack } from "@/lib/data/music";
import { cn } from "@/lib/utils";
import { Play, Square, Music, Check, Clock } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface MusicCardProps {
  track: MusicTrack;
  isSelected: boolean;
  onToggle: (trackId: string) => void;
}

export function MusicCard({ track, isSelected, onToggle }: MusicCardProps) {
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
      onClick={() => onToggle(track.id)}
      className={cn(
        "relative flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md",
        isSelected 
          ? "border-primary bg-primary/5 shadow-sm shadow-primary/10" 
          : "border-border/40 bg-card hover:border-primary/40"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 overflow-hidden pr-2">
          <div 
            onClick={handlePreview}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-sm shrink-0",
              isPlaying ? "bg-primary text-primary-foreground" : "bg-accent hover:bg-primary/20 text-foreground"
            )}
          >
            {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-1" />}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-bold text-lg leading-tight truncate">{track.title}</h4>
            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
          </div>
        </div>
        
        <div className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors mt-1",
          isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30"
        )}>
          {isSelected && <Check className="w-3.5 h-3.5" />}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <Badge variant="secondary" className="flex items-center gap-1.5 rounded-full px-2.5 font-medium bg-background border border-border/50">
          <Music className="w-3.5 h-3.5 text-primary/70" />
          {track.genre}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium ml-auto">
          <Clock className="w-3.5 h-3.5" />
          {track.duration}
        </div>
      </div>
    </div>
  );
}
