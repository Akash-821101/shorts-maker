import { PricingTable } from "@clerk/nextjs";
import { getUserPlan } from "@/lib/plan-limits";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default async function BillingPage() {
  const plan = await getUserPlan();
  
  const planDisplay = {
    free: "Free Explorer",
    basics: "Basics Pro",
    unlimited: "Unlimited Master",
  }[plan];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-inner">
            <CreditCard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Billing & Plans</h1>
            <p className="text-muted-foreground font-medium">Choose a plan that scales with your creativity</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-gradient-to-br from-primary/10 to-primary/5 px-8 py-5 rounded-[2rem] border border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform duration-500">
            <Zap className="w-20 h-20 text-primary" />
          </div>
          <div className="p-3 bg-primary/20 rounded-2xl relative z-10">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">Your Subscription</p>
            <p className="text-2xl font-black text-primary tracking-tighter leading-none">{planDisplay}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Benefits & Trust */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/60 shadow-xl shadow-primary/5 rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 pt-6 px-6">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Sparkles className="w-5 h-5" />
                <CardTitle className="text-lg font-black tracking-tight uppercase text-xs">Why Upgrade?</CardTitle>
              </div>
              <CardDescription className="text-sm font-medium">
                Unlock the full potential of AI-driven shorts generation.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8 space-y-5">
              <div className="flex items-start gap-3 group">
                <div className="mt-1 bg-emerald-500/10 p-1.5 rounded-xl transition-colors group-hover:bg-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-sm">
                  <p className="font-black text-foreground tracking-tight">
                    {plan === 'free' ? '3 Series Slots' : 'Unlimited Series'}
                  </p>
                  <p className="text-muted-foreground text-xs font-medium leading-relaxed">
                    {plan === 'free' ? 'Move up to 3 active video series.' : 'Create without limits.'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group">
                <div className="mt-1 bg-emerald-500/10 p-1.5 rounded-xl transition-colors group-hover:bg-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-sm">
                  <p className="font-black text-foreground tracking-tight">Full Social Access</p>
                  <p className="text-muted-foreground text-xs font-medium leading-relaxed">
                    Connect Instagram Reels and TikTok alongside YouTube.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="mt-1 bg-emerald-500/10 p-1.5 rounded-xl transition-colors group-hover:bg-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-sm">
                  <p className="font-black text-foreground tracking-tight">Premium Assets</p>
                  <p className="text-muted-foreground text-xs font-medium leading-relaxed">
                    Higher quality AI images and realistic voice synthesis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10 shadow-none rounded-2xl overflow-hidden">
            <CardContent className="p-6 flex gap-4">
              <div className="p-2 bg-primary/10 rounded-xl shrink-0 h-fit">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-bold">
                Payments are securely processed by Stripe through Clerk. 
                Cancel your subscription at any time with one click.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Clerk Pricing Table */}
        <Card className="lg:col-span-2 border-border/60 shadow-2xl shadow-primary/10 rounded-[2.5rem] bg-card/30 backdrop-blur-xl overflow-hidden p-2 min-h-[600px]">
          <div className="w-full h-full rounded-[2rem] overflow-hidden bg-background/50">
            {/* 
                Clerk PricingTable Component
                Note: In production, you would typically pass a pricingTableId if configured in Clerk Dashboard.
                If not provided, it will show the default tables configured in your Clerk instance.
            */}
            <PricingTable />
          </div>
        </Card>
      </div>
    </div>
  );
}
