"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { canCreateSeries } from "@/app/actions/limits";
import { toast } from "sonner";
import { UpgradeDialog } from "@/components/shared/upgrade-dialog";
import { cn } from "@/lib/utils";

interface CreateSeriesButtonProps extends React.ComponentProps<typeof Button> {
  label?: string;
  showIcon?: boolean;
}

export function CreateSeriesButton({
  label = "Create Series",
  showIcon = true,
  className,
  variant,
  size,
  ...props
}: CreateSeriesButtonProps) {
  const router = useRouter();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [isCheckingLimit, setIsCheckingLimit] = useState(false);

  const handleCreateNew = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsCheckingLimit(true);
    try {
      const { canCreate } = await canCreateSeries();
      if (canCreate) {
        router.push("/dashboard/create");
      } else {
        setShowUpgradeDialog(true);
      }
    } catch (error) {
      toast.error("Failed to check plan limits");
    } finally {
      setIsCheckingLimit(false);
    }
  };

  return (
    <>
      <Button
        {...props}
        className={cn(
          "cursor-pointer font-bold rounded-xl transition-all duration-300",
          "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary",
          "shadow-md shadow-primary/20 hover:shadow-xl hover:shadow-primary/40",
          "hover:scale-[1.02] active:scale-[0.98]",
          "gap-2",
          className
        )}
        variant={variant}
        size={size}
        onClick={handleCreateNew}
        disabled={isCheckingLimit || props.disabled}
      >
        {isCheckingLimit ? (
          <Zap className="w-5 h-5 animate-pulse" />
        ) : (
          showIcon && <Plus className="w-5 h-5" />
        )}
        {label}
      </Button>

      <UpgradeDialog
        isOpen={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        title="Series Limit Reached"
        description="You've reached the maximum number of series for your current plan. Upgrade to Pro or Agency for more slots and premium features."
      />
    </>
  );
}
