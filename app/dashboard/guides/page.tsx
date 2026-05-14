"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Zap,
  Video,
  Calendar,
  Layers,
  Sparkles,
  MonitorPlay,
  Camera,
  Music,
  CreditCard,
  ChevronRight,
  PlayCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function GuidesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center md:text-left"
      >
        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
          <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary">
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Learning Center
          </Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary">Content Engine</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Everything you need to know about generating viral shorts, automating your schedule, and growing your audience with AI.
        </p>
      </motion.div>

      {/* Quick Start Steps */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b pb-4">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Quick Start Guide</h2>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Create a Series",
              desc: "Define your niche, topic, and AI personality. This is the blueprint for your videos.",
              icon: Layers,
              step: "01",
            },
            {
              title: "Generate Content",
              desc: "Use our AI generator to turn ideas into fully-edited shorts with voiceovers and captions.",
              icon: Sparkles,
              step: "02",
            },
            {
              title: "Auto-Schedule",
              desc: "Set your posting frequency and let us handle the publishing across all platforms.",
              icon: Clock,
              step: "03",
            },
          ].map((step, i) => (
            <motion.div key={i} variants={item}>
              <Card className="relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all group rounded-2xl">
                <div className="absolute top-0 right-0 p-4 text-4xl font-black opacity-5 group-hover:opacity-10 transition-opacity">
                  {step.step}
                </div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Detailed Guides Tabs */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b pb-4">
          <Video className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">In-Depth Resources</h2>
        </div>
        
        <Tabs defaultValue="creation" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="creation" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Video Creation</TabsTrigger>
            <TabsTrigger value="automation" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Automation</TabsTrigger>
            <TabsTrigger value="platforms" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Platforms</TabsTrigger>
          </TabsList>

          <TabsContent value="creation" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Prompting Tips
                </h3>
                <ul className="space-y-3">
                  {[
                    "Be specific about the tone (e.g., 'energetic', 'educational')",
                    "Mention your target audience for better context",
                    "Use keywords that relate to trending topics",
                    "Specify the visual style (e.g., 'minimalist', 'vibrant')",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full md:w-auto mt-4 group">
                  Try it now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <h4 className="text-lg font-bold mb-2 relative z-10">Pro Tip</h4>
                <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                  Combine different series topics to create a unique content mix. For example, a "Tech News" series paired with an "AI Tools" series keeps your audience engaged with variety.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>How Automation Works</CardTitle>
                <CardDescription>Our system works in the background so you don't have to.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-medium">
                      <Clock className="w-4 h-4 text-primary" />
                      Scheduling Queue
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Once a video is generated, it's added to your queue. You can review, edit, or delete items before they go live.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Auto-Publishing
                    </div>
                    <p className="text-sm text-muted-foreground">
                      At your specified time, our system securely uploads the video to your connected social channels automatically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "YouTube", icon: MonitorPlay, color: "text-red-500", bg: "bg-red-500/10" },
                { name: "Instagram", icon: Camera, color: "text-pink-500", bg: "bg-pink-500/10" },
                { name: "TikTok", icon: Music, color: "text-slate-900 dark:text-white", bg: "bg-slate-900/10 dark:bg-white/10" },
              ].map((platform, i) => (
                <Card key={i} className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardHeader className="text-center">
                    <div className={`${platform.bg} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <platform.icon className={`w-6 h-6 ${platform.color}`} />
                    </div>
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-muted-foreground">
                    Connect your account in <span className="text-primary font-medium">Settings</span> to enable auto-posting for {platform.name} Shorts.
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Credits Section */}
      <section className="bg-primary/5 rounded-[2rem] border border-primary/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <CreditCard className="w-32 h-32 text-primary rotate-12" />
        </div>
        <div className="p-8 md:p-12 space-y-6 relative z-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Understanding Credits</h2>
            <p className="text-muted-foreground max-w-xl">
              Each video generation costs credits based on length and quality. Here's how it breaks down:
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Standard Video", value: "1 Credit" },
              { label: "High Quality", value: "2 Credits" },
              { label: "AI Voiceover", value: "Included" },
              { label: "Auto-Subtitles", value: "Included" },
            ].map((item, i) => (
              <div key={i} className="bg-background/80 backdrop-blur-sm p-4 rounded-2xl border border-primary/5 text-center">
                <div className="text-primary font-bold text-lg">{item.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">{item.label}</div>
              </div>
            ))}
          </div>
          <Button className="rounded-full px-8 shadow-lg shadow-primary/20">
            Buy More Credits
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b pb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {[
            {
              q: "How long does it take to generate a video?",
              a: "Most videos are generated within 2-5 minutes, depending on the complexity and queue length. You'll receive a notification once it's ready.",
            },
            {
              q: "Can I use my own voice for the voiceover?",
              a: "Currently, we offer a range of premium AI voices. Custom voice cloning is a feature coming soon for Pro plan users.",
            },
            {
              q: "Is there a limit to how many videos I can schedule?",
              a: "Free users can schedule up to 3 videos. Pro users have unlimited scheduling capacity.",
            },
            {
              q: "What video formats are supported?",
              a: "We generate high-definition vertical videos (9:16 aspect ratio), optimized for mobile platforms like TikTok and Reels.",
            },
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border/50">
              <AccordionTrigger className="hover:text-primary transition-colors py-4 cursor-pointer">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-primary text-primary-foreground rounded-[2.5rem] p-8 md:p-16 text-center space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <h2 className="text-3xl md:text-4xl font-black tracking-tight">Still have questions?</h2>
        <p className="text-lg opacity-90 max-w-xl mx-auto font-medium">
          Our support team is here to help you get the most out of Shorts Maker.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" variant="secondary" className="rounded-full px-8 font-bold text-primary cursor-pointer h-14">
            Contact Support
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 font-bold border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 cursor-pointer h-14">
            Join Discord Community
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
