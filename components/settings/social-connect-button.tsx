"use client";

import { Button } from "@/components/ui/button";
import { PlaySquare, Camera, Smartphone, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { simulateConnect, disconnectSocialAccount, getYouTubeAuthUrl } from "@/app/actions/settings";
import { checkPlatformAccess } from "@/app/actions/platform-access";
import { UpgradeDialog } from "@/components/shared/upgrade-dialog";

interface SocialConnectButtonProps {
  platform: "youtube" | "instagram" | "tiktok";
  isConnected: boolean;
  username?: string;
}

export function SocialConnectButton({ platform, isConnected, username }: SocialConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const platformConfig = {
    youtube: {
      name: "YouTube",
      icon: PlaySquare,
      color: "bg-[#FF0000] hover:bg-[#CC0000]",
      connectFn: async () => {
        const url = await getYouTubeAuthUrl();
        if (url) {
          window.location.href = url;
        } else {
          // If no client ID, simulate for demo purposes
          await simulateConnect("youtube" as any);
          toast.success("Connected to YouTube (Simulated)");
        }
      }
    },
    instagram: {
      name: "Instagram",
      icon: Camera,
      color: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90",
      connectFn: async () => {
        await simulateConnect("instagram");
        toast.success("Connected to Instagram (Simulated)");
      }
    },
    tiktok: {
      name: "TikTok",
      icon: Smartphone,
      color: "bg-black hover:bg-zinc-900",
      connectFn: async () => {
        await simulateConnect("tiktok");
        toast.success("Connected to TikTok (Simulated)");
      }
    }
  };

  const config = platformConfig[platform];

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const { isAllowed } = await checkPlatformAccess(platform);
      if (!isAllowed) {
        setShowUpgradeDialog(true);
        return;
      }
      await config.connectFn();
    } catch (error) {
      toast.error(`Failed to connect to ${config.name}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await disconnectSocialAccount(platform);
      toast.success(`Disconnected from ${config.name}`);
    } catch (error) {
      toast.error(`Failed to disconnect from ${config.name}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isConnected) {
    return (
      <div className="group flex items-center justify-between p-5 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${config.color} text-white shadow-inner transition-transform duration-300 group-hover:scale-110`}>
            <config.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm tracking-tight">{config.name}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
              {username || "Connected"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisconnect}
            disabled={isLoading}
            className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl cursor-pointer transition-all duration-200"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Disconnect"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
    <Button
      onClick={handleConnect}
      disabled={isLoading || platform === "instagram" || platform === "tiktok"}
      className={`group relative overflow-hidden w-full h-16 justify-start gap-4 rounded-lg text-white font-bold shadow-xl transition-all duration-300 ${
        platform === "instagram" || platform === "tiktok"
          ? "opacity-60 cursor-not-allowed hover:-translate-y-0 grayscale-[50%]"
          : "cursor-pointer active:scale-[0.98] hover:shadow-2xl hover:-translate-y-0.5"
      } ${config.color}`}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {isLoading ? (
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      ) : (
        <>
          <div className="p-2.5 bg-white/20 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <config.icon className="w-6 h-6" />
          </div>
          <span className="text-lg tracking-tight">Connect {config.name}</span>
          
          {platform === "instagram" || platform === "tiktok" ? (
            <div className="ml-auto">
              <span className="text-[10px] bg-black/40 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest text-white/90 font-black shadow-inner">
                Coming Soon
              </span>
            </div>
          ) : (
            <div className="ml-auto pr-2 opacity-0 group-hover:opacity-50 transition-all duration-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
        </>
      )}
    </Button>
    <UpgradeDialog 
      isOpen={showUpgradeDialog} 
      onOpenChange={setShowUpgradeDialog} 
      title="Pro Feature"
      description={`Connecting to ${config.name} is a Pro feature. Upgrade to the Unlimited plan to connect all your social accounts.`}
    />
    </>
  );
}
