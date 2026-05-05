import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PlayCircle,
  Calendar,
  MonitorPlay,
  Camera,
  Music,
  Mail,
  Sparkles,
  Zap,
  Video,
} from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { syncUser } from "@/app/actions/user";

export default async function Home() {
  // Sync user on page load (runs once when visiting root)
  await syncUser();

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans overflow-clip">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <PlayCircle className="text-primary w-6 h-6 fill-primary/20" />
            </div>
            <span className="font-bold text-xl tracking-tight">Shorts-Maker</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How it Works</Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal" asChild>
                <Button variant="ghost" className="hidden sm:inline-flex cursor-pointer">Log in</Button>
              </SignInButton>
              <SignUpButton mode="modal" asChild>
                <Button className="rounded-full px-6 cursor-pointer">Get Started</Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Button variant="ghost" asChild className="hidden sm:inline-flex cursor-pointer">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton />
            </Show>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Video Generation 2.0 is Here
            </div>

            <h1 className="max-w-4xl mx-auto text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Automate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-text-gradient">Viral Success</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Generate stunning AI shorts and auto-schedule them to YouTube, Instagram, TikTok, and Email. Grow your audience on autopilot.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Show when="signed-out">
                <SignUpButton mode="modal" asChild>
                  <Button size="lg" className="rounded-full h-14 px-8 text-lg font-semibold shadow-xl shadow-primary/25 w-full sm:w-auto cursor-pointer">
                    Start Generating for Free
                    <Zap className="ml-2 w-5 h-5 fill-current/20" />
                  </Button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Button size="lg" asChild className="rounded-full h-14 px-8 text-lg font-semibold shadow-xl shadow-primary/25 w-full sm:w-auto cursor-pointer">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <Zap className="ml-2 w-5 h-5 fill-current/20" />
                  </Link>
                </Button>
              </Show>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg font-medium w-full sm:w-auto bg-background/50 backdrop-blur-md border-border/50 cursor-pointer">
                View Demo
                <PlayCircle className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Platform Icons */}
            <div className="mt-16 pt-8 border-t border-border/40 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
              <div className="flex items-center gap-2 text-muted-foreground font-medium"><MonitorPlay className="w-6 h-6" /> YouTube</div>
              <div className="flex items-center gap-2 text-muted-foreground font-medium"><Camera className="w-6 h-6" /> Instagram</div>
              <div className="flex items-center gap-2 text-muted-foreground font-medium"><Music className="w-6 h-6" /> TikTok</div>
              <div className="flex items-center gap-2 text-muted-foreground font-medium"><Mail className="w-6 h-6" /> Email</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-secondary/30 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to go viral</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our all-in-one platform combines powerful AI video generation with smart scheduling capabilities.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-background/60 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-colors duration-300 shadow-lg rounded-md">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                    <Video className="w-6 h-6 text-primary fill-primary/20" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI Video Generator</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Turn text prompts or blog posts into highly engaging short-form videos with AI-generated voiceovers and captions in seconds.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/60 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-colors duration-300 shadow-lg rounded-md">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                    <Calendar className="w-6 h-6 text-primary fill-primary/20" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Auto-Scheduler</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Set it and forget it. Schedule your content calendar weeks in advance and let our system publish at the optimal times.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/60 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-colors duration-300 shadow-lg rounded-md">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-primary fill-primary/20" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Cross-Platform Sync</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Publish your generated shorts to YouTube, Instagram Reels, TikTok, and even your email newsletter simultaneously.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Shorts-Maker Works</h2>
              <p className="text-lg text-muted-foreground">Three simple steps to automate your content strategy.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border/50 -z-10" />

              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-background border-2 border-primary/20 rounded-full flex items-center justify-center text-3xl font-bold text-primary mb-6 shadow-xl shadow-primary/10">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect Platforms</h3>
                <p className="text-muted-foreground">Link your YouTube, Instagram, TikTok, and Email accounts securely.</p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-background border-2 border-primary/20 rounded-full flex items-center justify-center text-3xl font-bold text-primary mb-6 shadow-xl shadow-primary/10">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Generate Videos</h3>
                <p className="text-muted-foreground">Input prompts, scripts, or URLs and let our AI create stunning short videos.</p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-background border-2 border-primary/20 rounded-full flex items-center justify-center text-3xl font-bold text-primary mb-6 shadow-xl shadow-primary/10">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Auto-Schedule</h3>
                <p className="text-muted-foreground">Review, edit if needed, and queue them up. We handle the publishing.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          {/* Abstract pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] [background-size:24px_24px]" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to scale your audience?</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Join thousands of creators who are automating their video content with Shorts-Maker.
            </p>
            <Show when="signed-out">
              <SignUpButton mode="modal" asChild>
                <Button size="lg" variant="secondary" className="rounded-full h-14 px-10 text-lg font-bold shadow-2xl cursor-pointer">
                  Get Started for Free
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Button size="lg" variant="secondary" asChild className="rounded-full h-14 px-10 text-lg font-bold shadow-2xl cursor-pointer">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </Show>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <PlayCircle className="text-primary w-6 h-6 fill-primary/20" />
                <span className="font-bold text-xl">Shorts-Maker</span>
              </div>
              <p className="text-muted-foreground max-w-sm">
                The AI-powered short video generator and auto-scheduler designed for modern creators.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Showcase</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/40 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 Shorts-Maker. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
