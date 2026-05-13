"use client";

import { useEffect, useState } from "react";
import { Zap, PlusCircle } from "lucide-react";
import { getUserCredits } from "@/app/actions/credits";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export function CreditIndicator() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      const amount = await getUserCredits();
      setCredits(amount);
    };
    fetchCredits();
  }, []);

  if (credits === null) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/dashboard/billing">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all cursor-pointer group">
              <div className="p-1 rounded-full bg-primary/20 group-hover:scale-110 transition-transform">
                <Zap className="w-3.5 h-3.5 text-primary fill-primary" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-primary tracking-tight">
                  {credits}
                </span>
                <span className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">
                  Credits
                </span>
              </div>
              <PlusCircle className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors ml-1" />
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="p-3 max-w-[200px] text-xs font-medium">
          <p>You have {credits} video credits remaining. Credits are deducted per video generation.</p>
          <p className="mt-2 text-primary font-bold">Click to upgrade or buy more.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
