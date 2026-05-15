export type PlanTier = "free" | "starter" | "pro";

export interface PricingPlan {
  id: PlanTier;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  credits: number;
  seriesSlots: number;
  features: {
    text: string;
    included: boolean;
    isPremium?: boolean;
  }[];
  cta: string;
  isPopular?: boolean;
  color: string;
  voiceLevel: "Standard" | "Premium" | "Ultra";
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free Trial",
    description: "Experience the power of AI video creation.",
    price: {
      monthly: 0,
      yearly: 0,
    },
    credits: 3,
    seriesSlots: 2,
    voiceLevel: "Standard",
    cta: "Start for free",
    color: "hsl(var(--muted-foreground))",
    features: [
      { text: "3 Video Credits (One-time)", included: true },
      { text: "1 Active Series", included: true },
      { text: "720p Rendering", included: true },
      { text: "Auto Connect to YouTube for video upload", included: false },
      {text: "Email Notification", included: false}
    ],
  },
  {
    id: "starter",
    name: "Starter",
    description: "Ideal for hobbyists and new creators.",
    price: {
      monthly: 19,
      yearly: 15, // $15 * 12 = $180
    },
    credits: 15,
    seriesSlots: 3,
    voiceLevel: "Standard",
    cta: "Upgrade to Starter",
    color: "hsl(var(--primary))",
    features: [
      { text: "15 Videos per month", included: true },
      { text: "3 Active Series", included: true },
      { text: "1080p Full HD", included: true },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "The sweet spot for serious growth.",
    price: {
      monthly: 49,
      yearly: 39,
    },
    credits: 60,
    seriesSlots: 10,
    voiceLevel: "Premium",
    isPopular: true,
    cta: "Get Pro Now",
    color: "#8B5CF6", // Vibrant Purple
    features: [
      { text: "60 Videos per month", included: true },
      { text: "10 Active Series", included: true },
      { text: "Priority Rendering", included: true },
      { text: "Advanced Transitions", included: true },
      { text: "All Connectors (YouTube, IG, TikTok)", included: true },
    ],
  },
  // {
  //   id: "agency",
  //   name: "Agency",
  //   description: "Scalable power for multiple brands.",
  //   price: {
  //     monthly: 129,
  //     yearly: 99,
  //   },
  //   credits: 200,
  //   seriesSlots: 50,
  //   voiceLevel: "Ultra",
  //   cta: "Go Agency",
  //   color: "#F59E0B", // Amber/Gold
  //   features: [
  //     { text: "200 Videos per month", included: true },
  //     { text: "50 Active Series", included: true },
  //     { text: "All Ultra-Realistic Voices", included: true },
  //     { text: "Whitelabel Emails", included: true },
  //     { text: "Dedicated Support", included: true },
  //     { text: "Early Beta Access", included: true },
  //   ],
  // },
];
