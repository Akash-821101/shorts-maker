"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PricingCard } from "./pricing-card";
import { PRICING_PLANS } from "@/lib/data/plans";
import { Badge } from "@/components/ui/badge";

interface PricingGridProps {
  currentPlanId: string;
}

export function PricingGrid({ currentPlanId }: PricingGridProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <div className="space-y-12">
      {/* Billing Toggle */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 bg-muted/50 p-1.5 rounded-2xl border border-border/50">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              billingCycle === "monthly" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              billingCycle === "yearly" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yearly
            <Badge className="bg-green-500/10 text-green-600 border-none px-2 py-0 text-[10px] font-black uppercase tracking-wider">
              Save 20%
            </Badge>
          </button>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          {billingCycle === "yearly" 
            ? "Billed annually. Prices reflect the discount." 
            : "Billed month-to-month. Switch to yearly to save."}
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PRICING_PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
            isCurrentPlan={currentPlanId === plan.id}
          />
        ))}
      </div>

      {/* Comparison Text/Footer */}
      <div className="text-center space-y-4 pt-12">
        <h4 className="text-xl font-bold">Need a custom plan for your brand?</h4>
        <p className="text-muted-foreground max-w-xl mx-auto">
          If you have more than 10 brands or need enterprise-level automation, 
          contact our sales team for a tailored solution.
        </p>
        <div className="flex justify-center gap-8 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium">Secure SSL Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium">24/7 Priority Support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium">Money-back Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
