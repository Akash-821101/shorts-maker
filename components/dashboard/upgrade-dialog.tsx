"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles, CheckCircle2, X } from "lucide-react";
import Link from "next/link";

interface UpgradeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function UpgradeDialog({ 
  isOpen, 
  onOpenChange, 
  title = "Upgrade to unlock more", 
  description = "You've reached the limit of your current plan. Upgrade to continue creating and connecting."
}: UpgradeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-border/60 bg-card/70 backdrop-blur-xl p-8 sm:max-w-[450px] shadow-2xl shadow-primary/20 overflow-hidden [&>button]:hidden">
        {/* Custom Close Button */}
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200 z-50 cursor-pointer group"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <DialogHeader className="items-center text-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-primary/20 shadow-inner">
            <Zap className="w-10 h-10 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
          </div>
          <DialogTitle className="text-3xl font-black tracking-tight leading-none">{title}</DialogTitle>
          <DialogDescription className="text-base font-medium pt-3 text-muted-foreground leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 my-8 space-y-4 relative z-10 backdrop-blur-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-2">Pro Features Include:</p>
          
          {[
            "Unlimited Series Creation",
            "Connect Instagram & TikTok",
            "Priority AI Rendering",
            "4K High-Quality Assets"
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <div className="bg-emerald-500/20 p-1 rounded-lg transition-transform group-hover:scale-110">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-sm font-bold text-foreground/90">{feature}</span>
            </div>
          ))}
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-3 relative z-10">
          <Button 
            asChild 
            className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 cursor-pointer active:scale-[0.95] transition-all bg-primary hover:bg-primary/90"
            onClick={() => onOpenChange(false)}
          >
            <Link href="/dashboard/billing">
              <Sparkles className="w-5 h-5 mr-2" />
              View Pricing Plans
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)} 
            className="w-full h-12 rounded-xl font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
