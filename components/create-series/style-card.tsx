import { VisualStyle } from "@/lib/data/styles";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";

interface StyleCardProps {
  style: VisualStyle;
  isSelected: boolean;
  onSelect: (styleId: string) => void;
}

export function StyleCard({ style, isSelected, onSelect }: StyleCardProps) {
  return (
    <div
      onClick={() => onSelect(style.id)}
      className={cn(
        "relative flex-shrink-0 w-64 aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-xl group",
        isSelected 
          ? "ring-4 ring-primary shadow-lg shadow-primary/20 scale-[1.02]" 
          : "ring-2 ring-border/50 hover:ring-primary/40 hover:scale-[1.01]"
      )}
    >
      <Image 
        src={style.imagePath} 
        alt={style.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground p-1.5 rounded-full shadow-sm z-10 animate-in zoom-in duration-300">
          <Check className="w-5 h-5" />
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <h4 className="text-xl font-bold text-white mb-2 leading-tight">{style.title}</h4>
        <p className="text-sm text-white/80 line-clamp-2">{style.description}</p>
      </div>
    </div>
  );
}
