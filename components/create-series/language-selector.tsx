import { Language } from "@/lib/data/voices";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  languages: Language[];
  selectedCode: string | null;
  onSelect: (code: string) => void;
}

export function LanguageSelector({ languages, selectedCode, onSelect }: LanguageSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onSelect(lang.code)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer",
            selectedCode === lang.code
              ? "bg-primary text-primary-foreground border-primary shadow-md"
              : "bg-background border-border hover:border-primary/40 hover:bg-accent/30 text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="text-base leading-none">{lang.flag}</span>
          <span>{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
