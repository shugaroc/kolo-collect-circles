
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Settings, 
  ArrowLeft, 
  CircleDollarSign,
  Users,
  Calendar,
  Wallet
} from "lucide-react";
import CycleProgress from "@/components/communities/CycleProgress";
import MemberList from "@/components/communities/MemberList";
import ContributionForm from "@/components/contributions/ContributionForm";

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data - in a real app this would come from API based on the ID
  const community = {
    id: id || "1",
    name: "Family Savings Circle",
    description: "A circle for our family to save together for emergencies and celebrations",
    status: "Active" as const,
    totalContribution: 1200,
    backupFund: 120,
    memberCount: 8,
    admin: "John Doe",
    settings: {
      contributionFrequency: "Monthly",
      minContribution: 30,
      maxMembers: 10,
      backupFundPercentage: 10,
    },
    cycle: {
      number: 2,
      startDate: "Jan 15, 2024",
      endDate: "Jun 15, 2024",
      progress: 65,
      midCycles: [
        { id: 1, isComplete: true, payoutDate: "Feb 15, 2024" },
        { id: 2, isComplete: true, payoutDate: "Mar 15, 2024" },
        { id: 3, isComplete: false, payoutDate: "Apr 15, 2024" },
        { id: 4, isComplete: false, payoutDate: "May 15, 2024" },
        { id: 5, isComplete: false, payoutDate: "Jun 15, 2024" },
      ]
    },
    members: [
      { id: "1", name: "John Doe", email: "john@example.com", position: 1, status: "active" as const, contributionPaid: 300, penalty: 0 },
      { id: "2", name: "Jane Smith", email: "jane@example.com", position: 2, status: "active" as const, contributionPaid: 300, penalty: 0 },
      { id: "3", name: "Bob Johnson", email: "bob@example.com", position: 3, status: "active" as const, contributionPaid: 250, penalty: 10 },
      { id: "4", name: "Alice Brown", email: "alice@example.com", position: 4, status: "active" as const, contributionPaid: 300, penalty: 0 },
      { id: "5", name: "Charlie Davis", email: "charlie@example.com", position: 5, status: "inactive" as const, contributionPaid: 50, penalty: 30 },
    ]
  };

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-600 font-normal">Active</Badge>;
      case "Locked":
        return <Badge className="bg-orange-100 text-orange-600 font-normal">Locked</Badge>;
      case "Completed":
        return <Badge className="bg-blue-100 text-blue-600 font-normal">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Link to="/communities" className="inline-flex items-center text-kolo-purple hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Circles</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{community.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(community.status)}
              <span className="text-sm text-gray-500">Admin: {community.admin}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-1" />
              Invite
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>
      </div>
      
      <Card className="shadow-md">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CircleDollarSign className="h-5 w-5 text-kolo-purple" />
                <h3 className="font-medium">Total Contribution</h3>
              </div>
              <p className="text-2xl font-bold text-kolo-purple">€{community.totalContribution}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="h-5 w-5 text-kolo-purple" />
                <h3 className="font-medium">Backup Fund</h3>
              </div>
              <p className="text-2xl font-bold text-kolo-purple">€{community.backupFund}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-5 w-5 text-kolo-purple" />
                <h3 className="font-medium">Members</h3>
              </div>
              <p className="text-2xl font-bold text-kolo-purple">{community.memberCount} / {community.settings.maxMembers}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-5 w-5 text-kolo-purple" />
                <h3 className="font-medium">Frequency</h3>
              </div>
              <p className="text-2xl font-bold text-kolo-purple">{community.settings.contributionFrequency}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="contribute">Contribute</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CycleProgress
                cycleNumber={community.cycle.number}
                startDate={community.cycle.startDate}
                endDate={community.cycle.endDate}
                progress={community.cycle.progress}
                midCycles={community.cycle.midCycles}
              />
            </div>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700">About This Circle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">{community.description}</p>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">Min Contribution</p>
                      <p className="font-medium">€{community.settings.minContribution}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Backup Fund</p>
                      <p className="font-medium">{community.settings.backupFundPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Admin</p>
                      <p className="font-medium">{community.admin}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium">{community.status}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="members">
          <MemberList members={community.members} />
        </TabsContent>
        
        <TabsContent value="contribute">
          <div className="max-w-md mx-auto">
            <ContributionForm
              communityName={community.name}
              minContribution={community.settings.minContribution}
              currentBalance={250}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityDetail;
