"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Ghost, Sparkles, BookOpen, Heart, Brain, Laugh, Zap, Languages, Music, Palette, ChevronLeft, ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { LANGUAGES, VOICES } from "@/lib/data/voices";
import { MUSIC_TRACKS, MUSIC_GENRES } from "@/lib/data/music";
import { VISUAL_STYLES } from "@/lib/data/styles";
import { LanguageSelector } from "@/components/create-series/language-selector";
import { VoiceCard } from "@/components/create-series/voice-card";
import { MusicCard } from "@/components/create-series/music-card";
import { StyleCard } from "@/components/create-series/style-card";

const STEPS = [
  { id: 1, name: "Niche" },
  { id: 2, name: "Language" },
  { id: 3, name: "Music" },
  { id: 4, name: "Style" },
  { id: 5, name: "Captions" },
  { id: 6, name: "Review" },
];

const PREDEFINED_NICHES = [
  { id: "scary_story", title: "Scary Story", description: "Spooky and thrilling short stories that keep viewers hooked.", icon: Ghost },
  { id: "motivation", title: "Motivation", description: "Inspiring quotes, discipline advice, and daily motivation.", icon: Sparkles },
  { id: "facts", title: "Interesting Facts", description: "Mind-blowing and rare facts about the world and history.", icon: BookOpen },
  { id: "romance", title: "Romance", description: "Heartwarming love stories and relationship advice.", icon: Heart },
  { id: "philosophy", title: "Philosophy", description: "Deep thoughts, stoic wisdom, and life lessons.", icon: Brain },
  { id: "comedy", title: "Comedy", description: "Funny scenarios, dad jokes, and relatable humor.", icon: Laugh },
  { id: "technology", title: "Technology", description: "Latest tech news, AI updates, and futuristic concepts.", icon: Zap },
];

export default function CreateSeriesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const [customNiche, setCustomNiche] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>("en-US");
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<string[]>([]);
  const [musicGenreFilter, setMusicGenreFilter] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const availableVoices = VOICES.filter((v) => v.languageCode === selectedLanguage);
  const filteredMusic = MUSIC_TRACKS.filter(m => musicGenreFilter === "All" || m.genre === musicGenreFilter);

  const toggleMusicSelection = (id: string) => {
    setSelectedMusic(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12 pt-4">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Create New Series</h1>
        <p className="text-muted-foreground text-lg">Follow the steps to configure your automated video series.</p>
      </div>

      {/* Progress Bar Stepper */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          {STEPS.map((step) => (
            <div key={step.id} className="flex-1 relative">
              <div 
                className={cn(
                  "h-2 w-full rounded-full transition-all duration-500 ease-in-out",
                  currentStep >= step.id ? "bg-primary" : "bg-secondary"
                )}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between px-1">
          {STEPS.map((step) => (
            <span 
              key={step.id} 
              className={cn(
                "text-[10px] sm:text-xs font-semibold transition-colors duration-300",
                currentStep >= step.id ? "text-primary" : "text-muted-foreground",
                currentStep === step.id && "scale-110 transform"
              )}
            >
              {step.name}
            </span>
          ))}
        </div>
      </div>

      {/* Step 1: Niche Selection */}
      <div className={cn(
        "transition-all duration-500 ease-in-out", 
        currentStep === 1 ? "opacity-100 translate-y-0" : "opacity-0 hidden translate-y-4"
      )}>
        <Card className="border-border/40 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-8 pt-8 px-8">
            <CardTitle className="text-2xl">Select a Niche</CardTitle>
            <CardDescription className="text-base">Choose from our high-performing niches or create your own custom niche.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <Tabs defaultValue="available" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 h-12 rounded-lg bg-accent/40 p-1">
                <TabsTrigger value="available" className="cursor-pointer rounded-md h-full text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Available Niches</TabsTrigger>
                <TabsTrigger value="custom" className="cursor-pointer rounded-md h-full text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">Custom Niche</TabsTrigger>
              </TabsList>
              
              <TabsContent value="available" className="mt-0">
                {/* Specific Height List Container */}
                <ScrollArea className="h-[420px] pr-5 rounded-2xl border border-border/30 bg-accent/5 p-4 shadow-inner">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                    {PREDEFINED_NICHES.map((niche) => (
                      <div
                        key={niche.id}
                        onClick={() => setSelectedNiche(niche.id)}
                        className={cn(
                          "relative flex flex-col items-start p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md",
                          selectedNiche === niche.id 
                            ? "border-primary bg-primary/5 shadow-sm shadow-primary/10" 
                            : "border-border/30 bg-background hover:border-primary/40"
                        )}
                      >
                        <div className={cn(
                          "p-2.5 rounded-lg mb-3 transition-colors",
                          selectedNiche === niche.id ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                        )}>
                          <niche.icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold mb-1.5">{niche.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{niche.description}</p>
                        
                        {selectedNiche === niche.id && (
                          <div className="absolute top-5 right-5">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="custom" className="mt-0">
                <div className="h-[420px] flex flex-col">
                  <div className="flex-1 bg-background rounded-3xl border border-border/30 p-10 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <Zap className="w-16 h-16 text-primary mb-6 opacity-80 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                    <h3 className="text-2xl font-bold mb-3">Create a Custom Niche</h3>
                    <p className="text-base text-muted-foreground mb-8 max-w-lg leading-relaxed">
                      Describe exactly what kind of shorts you want to generate. Be specific about the topic, tone, and your target audience.
                    </p>
                    <div className="w-full max-w-xl">
                      <Textarea 
                        placeholder="e.g. Daily psychological tricks to improve social skills, presented in a mysterious and cinematic tone..."
                        className="w-full min-h-[160px] bg-accent/10 border-border/50 hover:border-primary/30 focus-visible:ring-primary/50 text-base p-5 resize-none rounded-2xl transition-colors shadow-sm"
                        value={customNiche}
                        onChange={(e) => {
                          setCustomNiche(e.target.value);
                          if (e.target.value) setSelectedNiche('custom');
                          else if (selectedNiche === 'custom') setSelectedNiche(null);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-10">
          <Button 
            size="lg" 
            className="rounded-xl px-12 h-14 text-lg font-bold shadow-xl shadow-primary/25 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-primary/40 bg-gradient-to-r from-primary to-primary/90 cursor-pointer disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={handleNext}
            disabled={!selectedNiche || (selectedNiche === 'custom' && !customNiche.trim())}
          >
            Continue to Language
          </Button>
        </div>
      </div>
      
      {/* Step 2: Language & Voice */}
      <div className={cn(
        "transition-all duration-500 ease-in-out", 
        currentStep === 2 ? "opacity-100 translate-y-0" : "opacity-0 hidden translate-y-4"
      )}>
        <Card className="border-border/40 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-6 pt-8 px-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Languages className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Language & Voice</CardTitle>
                <CardDescription className="text-base mt-1">Select the spoken language and voice for your shorts.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">1. Select Language</h3>
              <LanguageSelector 
                languages={LANGUAGES}
                selectedCode={selectedLanguage}
                onSelect={(code) => {
                  setSelectedLanguage(code);
                  setSelectedVoice(null); // reset voice on language change
                }}
              />
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">2. Select Voice</h3>
                <span className="text-sm text-muted-foreground bg-accent/50 px-3 py-1 rounded-full font-medium">
                  {availableVoices.length} voices available
                </span>
              </div>
              
              <ScrollArea className="h-[360px] pr-5 rounded-2xl border border-border/30 bg-accent/5 p-4 shadow-inner">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                  {availableVoices.map((voice) => (
                    <VoiceCard 
                      key={voice.id} 
                      voice={voice} 
                      isSelected={selectedVoice === voice.id}
                      onSelect={setSelectedVoice}
                    />
                  ))}
                  {availableVoices.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center">
                      <Zap className="w-12 h-12 mb-3 opacity-20" />
                      <p>No voices available for this language yet.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

          </CardContent>
        </Card>

        <div className="flex justify-between mt-10">
          <Button 
            variant="outline"
            size="lg" 
            className="rounded-xl px-8 h-14 text-lg font-medium shadow-sm transition-all duration-300 hover:bg-accent cursor-pointer"
            onClick={handleBack}
          >
            Go Back
          </Button>
          <Button 
            size="lg" 
            className="rounded-xl px-12 h-14 text-lg font-bold shadow-xl shadow-primary/25 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-primary/40 bg-gradient-to-r from-primary to-primary/90 cursor-pointer disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={handleNext}
            disabled={!selectedVoice}
          >
            Continue to Music
          </Button>
        </div>
      </div>

      {/* Step 3: Background Score */}
      <div className={cn(
        "transition-all duration-500 ease-in-out", 
        currentStep === 3 ? "opacity-100 translate-y-0" : "opacity-0 hidden translate-y-4"
      )}>
        <Card className="border-border/40 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-6 pt-8 px-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Background Score</CardTitle>
                <CardDescription className="text-base mt-1">Select one or more background tracks. They will cycle through your shorts.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">1. Filter by Mood / Genre</h3>
              <div className="flex flex-wrap gap-2">
                {MUSIC_GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setMusicGenreFilter(genre)}
                    className={cn(
                      "px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer",
                      musicGenreFilter === genre 
                        ? "bg-primary text-primary-foreground border-primary shadow-md" 
                        : "bg-background border-border hover:border-primary/40 hover:bg-accent/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">2. Select Tracks <span className="text-sm font-normal text-muted-foreground">(Multiple allowed)</span></h3>
                <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full font-bold">
                  {selectedMusic.length} selected
                </span>
              </div>
              
              <ScrollArea className="h-[360px] pr-5 rounded-2xl border border-border/30 bg-accent/5 p-4 shadow-inner">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                  {filteredMusic.map((track) => (
                    <MusicCard 
                      key={track.id} 
                      track={track} 
                      isSelected={selectedMusic.includes(track.id)}
                      onToggle={toggleMusicSelection}
                    />
                  ))}
                  {filteredMusic.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center">
                      <Music className="w-12 h-12 mb-3 opacity-20" />
                      <p>No tracks available for this genre.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

          </CardContent>
        </Card>

        <div className="flex justify-between mt-10">
          <Button 
            variant="outline"
            size="lg" 
            className="rounded-xl px-8 h-14 text-lg font-medium shadow-sm transition-all duration-300 hover:bg-accent cursor-pointer"
            onClick={handleBack}
          >
            Go Back
          </Button>
          <Button 
            size="lg" 
            className="rounded-xl px-12 h-14 text-lg font-bold shadow-xl shadow-primary/25 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-primary/40 bg-gradient-to-r from-primary to-primary/90 cursor-pointer disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={handleNext}
            disabled={selectedMusic.length === 0}
          >
            Continue to Style
          </Button>
        </div>
      </div>

      {/* Step 4: Visual Style */}
      <div className={cn(
        "transition-all duration-500 ease-in-out", 
        currentStep === 4 ? "opacity-100 translate-y-0" : "opacity-0 hidden translate-y-4"
      )}>
        <Card className="border-border/40 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-6 pt-8 px-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Visual Style</CardTitle>
                <CardDescription className="text-base mt-1">Select the visual aesthetic for your generated video.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 relative group">
            
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button variant="secondary" size="icon" className="rounded-full shadow-lg border border-border bg-background/80 backdrop-blur-sm hover:bg-accent cursor-pointer h-10 w-10" onClick={scrollLeft}>
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button variant="secondary" size="icon" className="rounded-full shadow-lg border border-border bg-background/80 backdrop-blur-sm hover:bg-accent cursor-pointer h-10 w-10" onClick={scrollRight}>
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            <div 
              ref={scrollContainerRef}
              className="flex w-full space-x-4 p-4 overflow-x-auto snap-x snap-mandatory rounded-2xl border border-border/30 bg-accent/5 shadow-inner scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {VISUAL_STYLES.map((style) => (
                <div key={style.id} className="snap-center shrink-0 first:pl-2 last:pr-2">
                  <StyleCard 
                    style={style} 
                    isSelected={selectedStyle === style.id}
                    onSelect={setSelectedStyle}
                  />
                </div>
              ))}
            </div>

          </CardContent>
        </Card>

        <div className="flex justify-between mt-10">
          <Button 
            variant="outline"
            size="lg" 
            className="rounded-xl px-8 h-14 text-lg font-medium shadow-sm transition-all duration-300 hover:bg-accent cursor-pointer"
            onClick={handleBack}
          >
            Go Back
          </Button>
          <Button 
            size="lg" 
            className="rounded-xl px-12 h-14 text-lg font-bold shadow-xl shadow-primary/25 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-primary/40 bg-gradient-to-r from-primary to-primary/90 cursor-pointer disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={handleNext}
            disabled={!selectedStyle}
          >
            Continue to Captions
          </Button>
        </div>
      </div>

      {/* Placeholder for Next Steps */}
      {currentStep > 4 && (
        <div className="text-center py-24 bg-accent/20 rounded-2xl border-2 border-border/50 border-dashed animate-in fade-in zoom-in-95 duration-500">
          <h2 className="text-3xl font-bold mb-3">Step {currentStep}: {currentStep === 5 ? "Captions" : "Review"}</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            This step will handle {currentStep === 5 ? "captions and overlays" : "final review and rendering"}.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" className="rounded-full px-8 cursor-pointer" onClick={handleBack}>
              Go Back
            </Button>
            <Button size="lg" className="rounded-full px-8 cursor-pointer disabled:cursor-not-allowed" onClick={handleNext} disabled={currentStep === 6}>
              Next Step (Prototype)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
