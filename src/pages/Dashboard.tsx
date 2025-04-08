
import { useState, useEffect } from "react";
import WalletSummary from "@/components/dashboard/WalletSummary";
import CommunitySummary from "@/components/dashboard/CommunitySummary";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchCommunities } from "@/lib/communityService";
import { fetchWalletBalance } from "@/lib/walletService";

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [communities, setCommunities] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState({
    availableBalance: 0,
    fixedBalance: 0
  });
  
  // Mock data for activities
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
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      if (user) {
        try {
          // Load communities
          const communitiesData = await fetchCommunities('my');
          setCommunities(communitiesData.map((community: any) => ({
            id: community.id,
            name: community.name,
            totalContribution: community.total_contribution || 0,
            contributionGoal: community.contribution_goal || 0,
            memberCount: community.member_count || 0,
            nextCycle: formatNextCycleDate(community.status),
            status: community.status
          })));
          
          // Load wallet data
          const walletData = await fetchWalletBalance();
          setWalletBalance({
            availableBalance: walletData.availableBalance,
            fixedBalance: walletData.fixedBalance
          });
        } catch (error) {
          console.error("Failed to load dashboard data:", error);
        }
      }
      
      setIsLoading(false);
    };
    
    loadDashboardData();
  }, [user]);
  
  const formatNextCycleDate = (status: string) => {
    if (status === "Completed") return "Completed";
    if (status === "Locked") return "Locked";
    
    // In a real implementation, we would get this from the actual cycle data
    return "Next: " + new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();
  };

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
      
      {!user ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">Welcome to Kolo</h2>
          <p className="text-gray-600 text-center max-w-md">
            Sign in to view your dashboard, manage your communities, and track your savings.
          </p>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WalletSummary
              availableBalance={walletBalance.availableBalance}
              fixedBalance={walletBalance.fixedBalance}
            />
            
            <div className="md:col-span-2">
              <ActivityFeed activities={activities} />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">My Circles</h2>
              <Link to="/communities/new">
                <Button variant="outline" size="sm">Create New Circle</Button>
              </Link>
            </div>
            
            {communities.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">You don't have any circles yet.</p>
                <Link to="/communities/new">
                  <Button>Create Your First Circle</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map((community) => (
                  <CommunitySummary key={community.id} {...community} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
