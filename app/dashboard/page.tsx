import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <UserButton />
      </div>
      
      <div className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
        <p className="text-muted-foreground">
          Welcome to your dashboard! Your account has been synced to the database successfully.
        </p>
      </div>
    </div>
  );
}
