import { getUserPlan } from "@/lib/plan-limits";
import {
  CreditCard,
  Zap,
  CheckCircle2,
  ShieldCheck,
  RefreshCcw,
  Headphones,
} from "lucide-react";
import { PricingTable } from "@clerk/nextjs";
import { PRICING_PLANS } from "@/lib/data/plans";

export default async function BillingPage() {
  const planId = await getUserPlan();
  const currentPlan = PRICING_PLANS.find(p => p.id === planId) || PRICING_PLANS[0];

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-widest animate-in zoom-in duration-500">
          <Zap className="w-3.5 h-3.5 fill-current" />
          Subscription Management
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          Plans & Pricing
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
          Choose the perfect plan for your viral content factory. Upgrade anytime to unlock more credits and premium features.
        </p>

        {/* Current Plan Indicator - Subtle & Clean */}
        <div className="pt-4 flex justify-center">
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-secondary/50 border border-border/50 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-semibold text-muted-foreground">Current Plan:</span>
            </div>
            <span className="text-sm font-black text-foreground uppercase tracking-tight">{currentPlan.name}</span>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="relative group">
        {/* Decorative background glow */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000 -z-10" />
        <PricingTable />

      </div>

      {/* Trust & Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-16 border-t border-border/40">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Secure Billing</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All transactions are encrypted and processed securely via Stripe. Your data is safe with us.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <RefreshCcw className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Flexibility First</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Switch plans or cancel at any time. No hidden fees or long-term contracts.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Instant Access</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Unlock premium voices, 1080p rendering, and more slots the moment you upgrade.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Headphones className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Expert Support</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Get priority assistance from our dedicated support team to help you scale your channels.
          </p>
        </div>
      </div>
    </div>
  );
}


