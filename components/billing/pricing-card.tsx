"use client";

import { Check, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PricingPlan } from "@/lib/data/plans";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  plan: PricingPlan;
  billingCycle: "monthly" | "yearly";
  isCurrentPlan?: boolean;
}

export function PricingCard({ plan, billingCycle, isCurrentPlan }: PricingCardProps) {
  const price = billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;
  const savings = plan.price.monthly - plan.price.yearly;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col p-8 rounded-3xl border bg-card/50 backdrop-blur-sm transition-all duration-300",
        plan.isPopular ? "border-primary shadow-xl shadow-primary/10 ring-1 ring-primary/20" : "border-border/50",
        isCurrentPlan && "ring-2 ring-green-500/50"
      )}
    >
      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-semibold shadow-lg">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Most Popular
          </Badge>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge variant="outline" className="bg-background text-green-600 border-green-500/50 px-4 py-1.5 rounded-full font-semibold">
            Current Plan
          </Badge>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <p className="text-muted-foreground text-sm min-h-[40px]">{plan.description}</p>
      </div>

      <div className="mb-8 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold tracking-tight">${price}</span>
        <span className="text-muted-foreground text-sm font-medium">/month</span>
      </div>

      {billingCycle === "yearly" && plan.price.monthly > 0 && (
        <div className="mb-6 p-2 rounded-lg bg-green-500/10 text-green-600 text-xs font-semibold text-center">
          Save ${savings * 12} per year
        </div>
      )}

      <div className="space-y-4 mb-8 flex-grow">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            {feature.included ? (
              <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                <Check className="w-3.5 h-3.5 text-primary" />
              </div>
            ) : (
              <div className="mt-1 rounded-full bg-muted p-0.5">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
            <span className={cn(
              "text-sm",
              feature.included ? "text-foreground" : "text-muted-foreground",
              feature.isPremium && "font-semibold text-primary decoration-primary/30 underline-offset-4"
            )}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      <Button
        className={cn(
          "w-full py-6 text-lg font-bold rounded-2xl transition-all duration-300",
          plan.isPopular 
            ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" 
            : "variant-outline hover:bg-accent"
        )}
        variant={plan.isPopular ? "default" : "outline"}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? "Active Plan" : plan.cta}
      </Button>

      {plan.id !== 'free' && (
        <p className="text-[10px] text-center text-muted-foreground mt-4">
          Cancel anytime. Prices in USD.
        </p>
      )}
    </motion.div>
  );
}
