import { getSocialConnections } from "@/app/actions/settings";
import { currentUser } from "@clerk/nextjs/server";
import { getUserPlan } from "@/lib/plan-limits";
import { SocialConnectButton } from "@/components/settings/social-connect-button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Trash2,
  Share2,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteUserAccount } from "@/app/actions/settings";

export default async function SettingsPage() {
  const user = await currentUser();
  const plan = await getUserPlan();
  const connections = await getSocialConnections();

  const isConnected = (platform: string) => 
    connections.some((c: any) => c.platform === platform);
  
  const getUsername = (platform: string) => 
    connections.find((c: any) => c.platform === platform)?.platform_username;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-inner">
          <SettingsIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Settings</h1>
          <p className="text-muted-foreground font-medium">Manage your workspace and social presence</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Section */}
        <Card className="overflow-hidden border-border/60 shadow-xl shadow-primary/5 rounded-2xl bg-card/50 backdrop-blur-sm lg:col-span-3">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center ring-4 ring-background shadow-xl transition-transform duration-500 group-hover:scale-105">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-primary">{user?.firstName?.charAt(0) || "U"}</span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-lg shadow-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-1">
                <h2 className="text-3xl font-black tracking-tight">{user?.fullName || "User Name"}</h2>
                <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {user?.primaryEmailAddress?.emailAddress || "email@example.com"}
                </p>
                <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
                  <div className="px-4 py-1.5 rounded-xl bg-primary/5 border border-primary/10 text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
                  </div>
                  {plan !== 'unlimited' && (
                    <Link href="/dashboard/billing">
                      <div className="px-4 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold uppercase tracking-wider text-amber-600 hover:bg-amber-500/20 transition-colors cursor-pointer">
                        Get Pro
                      </div>
                    </Link>
                  )}
                  <div className="px-4 py-1.5 rounded-xl bg-primary/5 border border-primary/10 text-xs font-bold uppercase tracking-wider text-primary">
                    {connections.length} Social Linked
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto">
                <Button variant="outline" className="w-full md:w-auto h-12 px-8 rounded-xl font-bold border-border/60 hover:bg-primary/5 transition-all cursor-pointer">
                  Manage Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:col-span-3">
          {/* Social Connections Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <Share2 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Social Connections</h2>
            </div>
            
            <div className="grid gap-4">
              <SocialConnectButton 
                platform="youtube" 
                isConnected={isConnected("youtube")} 
                username={getUsername("youtube")}
              />
              <SocialConnectButton 
                platform="instagram" 
                isConnected={isConnected("instagram")} 
                username={getUsername("instagram")}
              />
              <SocialConnectButton 
                platform="tiktok" 
                isConnected={isConnected("tiktok")} 
                username={getUsername("tiktok")}
              />
            </div>
            
            <Card className="bg-primary/5 border-primary/10 shadow-none rounded-2xl overflow-hidden">
              <CardContent className="p-6 flex gap-4">
                <div className="p-2 bg-primary/10 rounded-xl shrink-0 h-fit">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  We only request permissions necessary to publish videos on your behalf. 
                  Your credentials are encrypted and stored securely using industry standards.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Account Info & Other Settings */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Account Security</h2>
            </div>

            <Card className="overflow-hidden border-border/60 shadow-xl shadow-primary/5 transition-all duration-300 hover:shadow-primary/10 rounded-2xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4 pt-6 px-6">
                <CardTitle className="text-lg font-black tracking-tight">Privacy Settings</CardTitle>
                <CardDescription className="text-sm font-medium">
                  Control how your data is used and shared.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-6 pb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-muted-foreground">Data Syncing</span>
                  <span className="text-[10px] px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full font-black uppercase tracking-wider">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-muted-foreground">Two-Factor Auth</span>
                  <span className="text-[10px] px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full font-black uppercase tracking-wider">Cloud Managed</span>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-2 px-1 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="text-xl font-black uppercase tracking-widest text-[10px]">Danger Zone</h2>
              </div>
              
              <Card className="border-destructive/20 bg-destructive/5 shadow-xl shadow-destructive/5 overflow-hidden rounded-2xl">
                <CardHeader className="pb-4 pt-6 px-6">
                  <CardTitle className="text-lg font-black text-destructive tracking-tight">Delete Account</CardTitle>
                  <CardDescription className="text-sm font-medium text-destructive/80">
                    Permanently remove your account and all associated data. This action is irreversible.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full h-14 gap-3 font-black text-base rounded-2xl shadow-lg shadow-destructive/20 active:scale-[0.98] transition-all cursor-pointer hover:shadow-destructive/30">
                        <Trash2 className="w-5 h-5" />
                        Delete My Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[2.5rem] border-destructive/10 p-8">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base font-medium">
                          This action cannot be undone. This will permanently delete your
                          account and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel className="rounded-2xl font-bold h-12 cursor-pointer border-border/50">Cancel</AlertDialogCancel>
                        <form action={deleteUserAccount}>
                          <AlertDialogAction 
                            type="submit"
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-2xl font-black h-12 px-8 cursor-pointer shadow-lg shadow-destructive/20"
                          >
                            Delete Everything
                          </AlertDialogAction>
                        </form>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
