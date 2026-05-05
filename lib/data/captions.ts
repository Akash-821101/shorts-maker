export type AnimationType = 'pop' | 'fade' | 'slide-up' | 'typewriter' | 'bounce';

export interface CaptionStyle {
  id: string;
  name: string;
  fontFamily: string;
  textColor: string;
  highlightColor: string;
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  dropShadow?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'none';
  animationType: AnimationType;
  fontWeight?: string;
}

export const CAPTION_STYLES: CaptionStyle[] = [

  {
    id: "minimalist_fade",
    name: "Minimalist Fade",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: "500",
    textColor: "#1f53c4ff",
    highlightColor: "#FFFFFF",
 
    textTransform: "none",
    animationType: "fade"
  },
  {
    id: "neon_glow",
    name: "Neon Cyber",
    fontFamily: "'Courier New', Courier, monospace",
    fontWeight: "bold",
    textColor: "#FFFFFF",
    highlightColor: "#FF00FF",
    dropShadow: "0px 0px 8px #FF00FF, 0px 0px 16px #FF00FF",
    textTransform: "uppercase",
    animationType: "pop"
  },
  {
    id: "karaoke_highlight",
    name: "Karaoke Reveal",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontWeight: "800",
    textColor: "rgba(255, 255, 255, 0.4)",
    highlightColor: "#00FF00",
    strokeColor: "rgba(0, 0, 0, 0.5)",
    strokeWidth: 1,
    textTransform: "none",
    animationType: "typewriter"
  },
  {
    id: "news_ticker",
    name: "News Ticker",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontWeight: "bold",
    textColor: "#FFFFFF",
    highlightColor: "#FF3333",
    dropShadow: "1px 1px 2px rgba(0,0,0,0.8)",
    textTransform: "uppercase",
    animationType: "slide-up"
  },
  {
    id: "cinematic",
    name: "Cinematic Subs",
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
    fontWeight: "normal",
    textColor: "#F3F3F3",
    highlightColor: "#FFFFFF",
    dropShadow: "1px 1px 2px rgba(0,0,0,0.8)",
    textTransform: "none",
    animationType: "fade"
  },
  {
    id: "typewriter_mono",
    name: "Terminal",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontWeight: "normal",
    textColor: "#00FF41",
    highlightColor: "#FFFFFF",
    dropShadow: "1px 1px 2px rgba(0,0,0,0.8)",
    textTransform: "uppercase",
    animationType: "typewriter"
  }
];
