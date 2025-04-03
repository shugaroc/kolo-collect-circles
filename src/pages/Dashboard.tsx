
import { useState, useEffect } from "react";
import WalletSummary from "@/components/dashboard/WalletSummary";
import CommunitySummary from "@/components/dashboard/CommunitySummary";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

const Dashboard = () => {
  // Mock data - in a real app this would come from API
  const [isLoading, setIsLoading] = useState(true);
  
  const walletData = {
    availableBalance: 250.75,
    fixedBalance: 500.00,
  };

  const communities = [
    {
      id: "1",
      name: "Family Savings Circle",
      totalContribution: 1200,
      contributionGoal: 2000,
      memberCount: 8,
      nextCycle: "Feb 15",
      status: "Active" as const,
    },
    {
      id: "2",
      name: "Friends Investment Group",
      totalContribution: 800,
      contributionGoal: 1500,
      memberCount: 5,
      nextCycle: "Mar 1",
      status: "Active" as const,
    },
    {
      id: "3",
      name: "Neighborhood Fund",
      totalContribution: 3000,
      contributionGoal: 3000,
      memberCount: 12,
      nextCycle: "Completed",
      status: "Completed" as const,
    }
  ];

  const activities = [
    {
      id: "1",
      type: "contribution" as const,
      message: "You contributed €50 to Family Savings Circle",
      timestamp: "Today, 10:30 AM",
      community: "Family Savings Circle",
    },
    {
      id: "2",
      type: "payout" as const,
      message: "You received a payout of €650 from Friends Investment Group",
      timestamp: "Yesterday, 2:15 PM",
      community: "Friends Investment Group",
    },
    {
      id: "3",
      type: "join" as const,
      message: "John Doe joined Family Savings Circle",
      timestamp: "Feb 10, 9:45 AM",
      community: "Family Savings Circle",
    },
    {
      id: "4",
      type: "notification" as const,
      message: "Upcoming contribution due in 2 days",
      timestamp: "Feb 9, 8:00 AM",
      community: "Family Savings Circle",
    },
    {
      id: "5",
      type: "penalty" as const,
      message: "Late contribution penalty of €5 applied",
      timestamp: "Feb 5, 11:30 AM",
      community: "Friends Investment Group",
    },
  ];

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-pulse-scale">
          <div className="bg-kolo-purple rounded-full w-16 h-16 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">K</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WalletSummary
          availableBalance={walletData.availableBalance}
          fixedBalance={walletData.fixedBalance}
        />
        
        <div className="md:col-span-2">
          <ActivityFeed activities={activities} />
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Circles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <CommunitySummary key={community.id} {...community} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
