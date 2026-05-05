"use client";

import { CaptionStyle } from "@/lib/data/captions";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";
import { CaptionPreview } from "./caption-preview";

interface CaptionCardProps {
  styleConfig: CaptionStyle;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function CaptionCard({ styleConfig, isSelected, onSelect }: CaptionCardProps) {
  return (
    <div
      onClick={() => onSelect(styleConfig.id)}
      className={cn(
        "relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group border-2",
        isSelected
          ? "border-primary shadow-lg shadow-primary/20 bg-primary/5 scale-[1.02]"
          : "border-border/40 hover:border-primary/50 hover:bg-accent/5"
      )}
    >
      <div className="w-full h-2/3 relative overflow-hidden flex items-center justify-center">
        <Image
          src="/styles/cinematic.png"
          alt="Video background"
          fill
          className="object-cover blur-md opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <CaptionPreview styleConfig={styleConfig} />
      </div>

      <div className="w-full h-1/3 flex items-center justify-between px-4 bg-card border-t border-border/20">
        <div>
          <h4 className="font-semibold text-sm">{styleConfig.name}</h4>
          <p className="text-xs text-muted-foreground capitalize">{styleConfig.animationType} animation</p>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground p-1 rounded-full shadow-sm z-20 animate-in zoom-in duration-300">
          <Check className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
