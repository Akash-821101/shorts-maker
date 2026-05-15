"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface Section {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  sections: Section[];
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, sections, children }: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0% -80% 0%' }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 selection:bg-primary/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-24">
        {/* Header */}
        <div className="mb-16 space-y-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
              {title}
            </h1>
            <p className="text-zinc-500 text-lg">Last Updated: {lastUpdated}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-3 mb-6">Contents</p>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "w-full flex items-center text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      activeSection === section.id
                        ? "bg-white/5 text-white translate-x-1"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                    )}
                  >
                    <ChevronRight className={cn(
                      "mr-2 w-3 h-3 transition-transform duration-200",
                      activeSection === section.id ? "rotate-90 opacity-100" : "opacity-0"
                    )} />
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm shadow-2xl">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Footer link for mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
         <button 
           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
           className="bg-white text-black p-4 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform"
         >
           <ChevronRight className="-rotate-90 w-6 h-6" />
         </button>
      </div>
    </div>
  );
}

export function LegalSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 mb-16 last:mb-0">
      <h2 className="text-3xl font-bold mb-6 text-white">{title}</h2>
      <div className="text-zinc-400 leading-relaxed space-y-4 text-lg">
        {children}
      </div>
    </section>
  );
}
